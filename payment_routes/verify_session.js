import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET);


const verify_session = async (req, res) => {
    const sessionId = req.params.session_id;

    try {
        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log(session.id);
        

        if (session.payment_status === "paid") {
            // Retrieve the payment intent for timestamp details
            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

            // Calculate payment age
            const paymentTime = new Date(paymentIntent.created * 1000); // Convert from seconds to milliseconds
            const now = new Date();
            const minutesSincePayment = (now - paymentTime) / (1000 * 60);

            // Check if the payment was made within the last 5 minutes
            if (minutesSincePayment <= 5) {
                return res.json({ verified: true, message: "Payment verified within last 5 minutes." });
            } else {
                return res.json({ verified: false, message: "Payment expired (made more than 5 minutes ago)." });
            }

        } else {
            return res.json({ verified: false, message: "Payment not completed or failed." });
        }
    } catch (error) {
        console.error("Error verifying session:", error);
        res.status(500).json({ error: "Error verifying payment session." });
    }
}


export default verify_session
