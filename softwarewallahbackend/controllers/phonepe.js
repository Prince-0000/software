const crypto = require("crypto");
const axios = require("axios");
const Payment = require("../models/payment.model"); // Import the Payment model

require("dotenv").config();

const newPayment = async (req, res) => {
  try {
    const merchantTransactionId = "M" + Date.now();
    const { tool_id, price, phone, name, email } = req.body;
    console.log(
      process.env.MERCHANT_ID,
      process.env.SALT_KEY,
      process.env.API_URL
    );
    const data = {
      merchantId: process.env.MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: "MUID" + tool_id,
      name: name,
      amount: price * 100,
      redirectUrl: `${process.env.API_URL}/api/payment/status/${merchantTransactionId}`,
      redirectMode: "POST",
      mobileNumber: phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + process.env.SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;
    const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };
    axios
      .request(options)
      .then(async function (response) {
        // Save the payment details to the database
        const newPayment = new Payment({
          name,
          email: email, // Make sure to include email in the request body
          phoneNumber: phone,
          price,
          status: "initiated",
          currency: "INR",
        });
        await newPayment.save();

        return res.status(200).send({
          success: true,
          message: "Payment Initiated",
          url: response.data.data.instrumentResponse.redirectInfo.url,
        });
      })
      .catch(function (error) {
        console.error(error);
        res.status(404).send({
          message: error.message,
          success: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

const checkStatus = async (req, res) => {
  const merchantTransactionId = req.params["txnId"];
  const merchantId = process.env.MERCHANT_ID;
  const keyIndex = 1;
  const string =
    `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
    process.env.SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;
  const options = {
    method: "GET",
    url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };

  axios
    .request(options)
    .then(async (response) => {
      if (response.data.success === true) {
        // Update the payment status in the database
        await Payment.findOneAndUpdate(
          { merchantTransactionId },
          { status: "completed" }
        );

        return res.status(200).send({
          success: true,
          message:
            "Payment Successful! Our team will contact you within 2-4 hours.",
        });
      } else {
        // Update the payment status in the database
        await Payment.findOneAndUpdate(
          { merchantTransactionId },
          { status: "failed" }
        );

        return res.status(400).send({
          success: false,
          message: "Payment Failed! Try Again.",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ msg: err.message });
    });
};

module.exports = {
  newPayment,
  checkStatus,
};
