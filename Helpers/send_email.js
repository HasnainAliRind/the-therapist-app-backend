import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sendingMail = async ({ from, to, subject, text }) => {

  let key = process.env.SIB_API_KEY;

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: "Hasnain Ali", email: "nrind4956@gmail.com" },
        to: [{ email: to }],
        subject: subject || "Verify Your Email with This OTP Code",
        htmlContent: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">The Therapist</a>
              </div>
              <p style="font-size:1.1em">Hi,</p>
              <p>Welcome to The Therapist! To complete your signup, please use the following One-Time Password (OTP). The OTP is valid for 5 minutes, so make sure to enter it soon.</p>
              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${text}</h2>
              <p style="font-size:0.9em;">Thank you for joining,<br />The Therapist App Developer</p>
              <hr style="border:none;border-top:1px solid #eee" />
            </div>
          </div>
        `
      },
      {
        headers: {
          'api-key': key,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.data : error.message);
  }
};

export default sendingMail;
