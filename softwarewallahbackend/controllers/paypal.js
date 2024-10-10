const paypal = require("paypal-rest-sdk");
const Payment = require("../models/payment.model"); // Import the Payment model

require("dotenv").config();

// Configure PayPal with your credentials
paypal.configure({
  mode: "sandbox", // or 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// Create a new payment
const newPaymentPaypal = async (req, res) => {
  try {
    const { tool_id, price, phone, name, email } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.API_URL}/api/payment/paypal/status`, // Success URL
        cancel_url: `${process.env.API_URL}/api/payment/paypal/cancel`, // Cancel URL
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Tool Purchase",
                sku: tool_id,
                price: price.toFixed(2),
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: price.toFixed(2),
          },
          description: "Payment for tool purchase",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: error.message });
      } else {
        const newPayment = new Payment({
          name,
          email,
          phoneNumber: phone,
          price,
          status: "initiated",
          currency: "USD",
        });
        await newPayment.save();

        return res.status(200).send({
          success: true,
          message: "Payment Initiated",
          url: payment.links.find((link) => link.rel === "approval_url").href,
        });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// Check payment status
const checkStatusPaypal = async (req, res) => {
  const paymentId = req.query.paymentId;
  const payerId = { payer_id: req.query.PayerID };

  paypal.payment.execute(paymentId, payerId, async function (error, payment) {
    if (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    } else {
      if (payment.state === "approved") {
        await Payment.findOneAndUpdate(
          { merchantTransactionId: payment.id },
          { status: "completed" }
        );

        return res.status(200).send({
          success: true,
          message:
            "Payment Successful! Our team will contact you within 2-4 hours.",
        });
      } else {
        await Payment.findOneAndUpdate(
          { merchantTransactionId: payment.id },
          { status: "failed" }
        );

        return res.status(400).send({
          success: false,
          message: "Payment Failed! Try Again.",
        });
      }
    }
  });
};

// Handle payment cancellation
const cancelPaymentPaypal = async (req, res) => {
  try {
    const paymentId = req.query.paymentId;

    await Payment.findOneAndUpdate(
      { merchantTransactionId: paymentId },
      { status: "cancelled" }
    );

    return res.status(200).send({
      success: false,
      message: "Payment Cancelled by the user.",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  newPaymentPaypal,
  checkStatusPaypal,
  cancelPaymentPaypal,
};
