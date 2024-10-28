import connection from "../config/ConnectDB.js";


const register = (req, res) => {
    // console.log(req.body);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    // it will run multiple queries , one will be to check If the user is already present and if it is then it will send error message
    let data = req.body;
    
    
    if (data.email[0] !== "" && data.password[0] !== "") {
        let sql = "SELECT * FROM users WHERE `email` = ?";
        connection.query(sql, [data.email], (err, result) => {
            if (err) return res.json({ signup: false, reason: "Something went wrong in backend", error: err });
            if (result.length > 0) {
                return res.json({ signup: false, reason: "Your account is already created, consider signing in!" });
            } else {
                let sql = "INSERT INTO users(`username`,`email`,`password`, `isVerified`, `isDonated`, `donation_date`) VALUES (?)";
                let values = [
                    data.name,
                    data.email,
                    data.password,
                    true,
                    false,
                    null
                    // formattedDate
                ];
                connection.query(sql, [values], (err, info) => {
                    if (err) return res.json({ signup: false, reason: err });
                    // if the user is created then a default list for him/her will be created !
                    if (info.affectedRows == 1) {
                        // creating a default list
                        res.json({ signup: true, result: info });
                    } else {
                        res.json({ signup: false, reason: "something went wrong" });
                    }
                });
            }
        })
    } else {
        return res.json({
            signup: false,
            reason: "email or password can't be undefined!"
        });
    };
};

export default register;