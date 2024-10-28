import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET);

// checkout api

const donate = async (req, res) => {
    try {
        const { amount, user_email } = req.body;
        // Fixed amount for donation, $3 in cents (300 cents)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "gbp",
                        product_data: {
                            name: "Donation to The Therapist & Chat Helpers",
                        },
                        unit_amount: amount * 100, // $3 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "https://the-therapist-beta.netlify.app/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "https://the-therapist-beta.netlify.app/cancel",
            metadata: {
                user_email: user_email
            }
        });


        // Send the session ID back to the frontend to complete the checkout
        res.json({ status: true, id: session.id });

    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.json({ status: false, error: "Failed to create Stripe session" });
    }
};


export default donate
