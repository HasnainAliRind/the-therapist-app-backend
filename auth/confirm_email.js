import connection from "../config/ConnectDB.js";


const confirm_email = async (req, res) => {

    // Getting the OTP from frontend
    let otp = req.body.otp;
    let email = req.body.email;

    // Verifying OTP in DB
    let verifyOTP = "SELECT * FROM otp_table WHERE `otp_code` = ? AND `user_email` = ?"

    connection.query(verifyOTP, [otp, email], (error, results) => {
        if (error) return res.json({ status: false, verified: false, error, reason: "an error occured!" });

        if (results.length == 0) {
            return res.json({ status: true, verified: false, reason: "The otp has been expired!" })
        }

        if (results.length == 1) {
            return res.json({ status: true, verified: true })
        }
    })

}

export default confirm_email