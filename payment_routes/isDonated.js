import connection from "../config/ConnectDB.js"

const isDonated = (req , res) => {
    let check_donation_status = "SELECT * FROM users WHERE `email`=?";

    // Getting Data from request body
    let data = req.body;

    let values = [
        req.body.email
    ]

   
    

    connection.query(check_donation_status, [values], (error, results) => {
        if(error) return res.json({status: false, isDonated: false, error: true, error_details: error});
        if (results.length > 0) {
            let isDonated = results[0].isDonated;
            if (isDonated == 0) {
                return res.json({status: true, isDonated: false, error: false})
            } 
            return res.json({status: true, isDonated: true, error: false})
            
        }
        if (results.length == 0) {
            return res.json({status: false, isDonated: false, error: false});
        }
    })
}

export default isDonated