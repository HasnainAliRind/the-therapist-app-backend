import connection from "../config/ConnectDB.js";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()


const login = async (req, res) => {
    let sql = "SELECT * FROM users where `email` = ? and `password` = ?";
    let values = [
        req.body.email,
        req.body.password
    ];
    

    await connection.query(sql, values, async (err, result) => {
        if (err) return res.json({ login: false, reason: "Something went wrong", error: err });
        if (result.length > 0) {
            
            // Set isDonation to false
            let set_isdonation_to_false = "UPDATE users SET `isDonated` = ? WHERE `email` = ?";

            await connection.query(set_isdonation_to_false, [false, values[0]])

            // Generating a token
            jwt.sign({ email: values[0] }, process.env.SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
                if (err) return res.json({ status: false, reason: "Something went wrong, Please try again after sometime!" })
                return res.json({ status: true, email: result[0].email, isDonated: false, isVerified: result[0].isVerified == 0 ? false : true ,accessToken: token });
            });
            
        } else {
            return res.json({ login: false, reason: "Incorrect Email or Password!" })
        };
    });

}
export default login;