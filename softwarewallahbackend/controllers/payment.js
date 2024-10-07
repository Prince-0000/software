const Instamojo = require("instamojo-nodejs");
require("dotenv").config();

Instamojo.setKeys(
  process.env.INSTAMOJO_API_KEY,
  process.env.INSTAMOJO_AUTH_TOKEN
);
Instamojo.isSandboxMode(true); // Change to `false` for production

const createPaymentRequest = (req, res) => {
  const { amount, purpose, buyer_name, email, phone } = req.body;

  const data = new Instamojo.PaymentData();
  data.setRedirectUrl("https://softwarewallah.onrender.com/api/payment/callback"); // Change to your callback URL
  data.send_email = "False";
  data.send_sms = "False";
  data.setName(buyer_name);
  data.setEmail(email);
  data.setPhone(phone);
  data.setAmount(amount);
  data.setPurpose(purpose);

  Instamojo.createPayment(data, (error, response) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json(JSON.parse(response));
    }
  });
};

// Utility function to verify Instamojo's signature
const verifySignature = (params, salt) => {
  const sortedKeys = Object.keys(params).sort();
  const sortedParams = {};
  sortedKeys.forEach((key) => {
    sortedParams[key] = params[key];
  });

  const queryString = Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join("&");

  const hmac = crypto.createHmac("sha1", salt);
  hmac.update(queryString);
  const signature = hmac.digest("hex");
  return signature;
};

const paymentCallback = (req, res) => {
  const params = req.query;

  const paymentId = params.payment_id;
  const paymentRequestId = params.payment_request_id;
  const paymentStatus = params.payment_status;
  const instamojoSalt = process.env.INSTAMOJO_SALT;

  // Verify the signature
  const generatedSignature = verifySignature(params, instamojoSalt);
  const receivedSignature = params.signature;

  if (generatedSignature !== receivedSignature) {
    return res.status(400).send("Payment signature mismatch");
  }

  // Check payment status
  if (paymentStatus === "Credit") {
    // Payment was successful
    // You can now update your database, send confirmation emails, etc.
    console.log(
      `Payment successful for Payment ID: ${paymentId}, Payment Request ID: ${paymentRequestId}`
    );
    res.send("Payment successful");
  } else {
    // Payment failed
    console.log(
      `Payment failed for Payment ID: ${paymentId}, Payment Request ID: ${paymentRequestId}`
    );
    res.send("Payment failed");
  }
};

module.exports = { createPaymentRequest, paymentCallback };
