import express, { response } from "express";
let router = express.Router();
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import connection from "../config/ConnectDB.js"
import register from "../auth/register.js";
import login from "../auth/login.js";
import donate from "../payment_routes/donate.js";
import isDonated from "../payment_routes/isDonated.js";
import confirm_email from "../auth/confirm_email.js";
import createAndStoreOTP from "../Helpers/createAndSotrOTP.js";
import { stripeWebhookHandler } from "../payment_routes/webhook.js";
import bodyParser from "body-parser";
import verify_session from "../payment_routes/verify_session.js";

dotenv.config()


const verify = (req, res, next) => {
    console.log("called verified...!");

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log("got the token : ", token);

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res.json({ status: false, reason: "Token is not valid!" });
            }

            req.user = user;
            next();
        });
    } else {
        res.json({ status: false, reason: "You are not authenticated!" });
    }
};

const initWebRoutes = (app) => {
    router.get("/", (req, res) => {
        return res.json({ status: true, response: "Server is connected & working fine for now..." })
    });

    app.get("/verify-session/:session_id", verify_session);

    // User registration
    app.post("/register", register)


    // confirm email
    app.post("/confirm-email", confirm_email)


    // Create & send otp
    app.post('/generate-otp', (req, res) => {
        const userEmail = req.body.email;
        if (!userEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }
        let isUserExist = "SELECT * FROM users WHERE `email` = ?";
        connection.query(isUserExist, [userEmail], (err, results) => {
            if (err) {
                return res.json({ status: false, reason: "Something went wrong, Please try again after some time!", err });
            }

            if (results.length > 0)
                createAndStoreOTP(userEmail, res);
                // return res.json({ status: false, reason: "The email is already used! consider login" });
               
            if (results.length == 0) {
                createAndStoreOTP(userEmail, res);
            }


        })
        // Call the OTP generation and storage function

    });

    // User login
    app.post("/login", login)

    // Check if user donated or not
    app.post("/isDonated", isDonated)

    // create-checkout-session
    app.post("/create-checkout-session", donate)

    // Webhook Handler
    app.post("/webhook", bodyParser.raw({ type: "application/json" }), stripeWebhookHandler);

    // Protected Route to verify user's token
    app.post("/protected", verify, async (req, res) => {
        if (req.user) {
            console.log("Working...")
            let check_donation_status = "SELECT * FROM users WHERE `email` = ?";

            connection.query(check_donation_status, [req.user.email[0]], (error, resp) => {
                if (error) return res.json({ status: false, message: "something went wrong!" })
                if (resp.length == 0) {
                    return res.json({ status: false, message: "Please create your account first!" })
                }
                if (resp.length == 1) {

                    let donation_status = resp[0].isDonated;

                    return res.json({ status: true, userEmail: req.user.email[0], isDonated: donation_status == 1 ? true : false, message: "you're good to go!" })
                }
            })


        } else {
            return res.json({ status: false, message: "you're not authenticated!" })
        }
    })

    return app.use("/", router);
};

export default initWebRoutes;