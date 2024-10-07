const express = require('express');
const { newPayment, checkStatus } = require('../controllers/phonepe');
const { newPaymentPaypal, checkStatusPaypal, cancelPaymentPaypal } = require('../controllers/paypal');
// const { createPaymentRequest, paymentCallback } = require('../controllers/payment');
const router = express.Router();


// router.post('/create', createPaymentRequest);
// router.get('/callback', paymentCallback);

router.post('/payment', newPayment);
router.post('/paypal', newPaymentPaypal);
router.get('/status/:txnId', checkStatus);
router.get('/paypal/status', checkStatusPaypal);
router.get('/paypal/cancel', cancelPaymentPaypal);
// router.post('/status/:txnId', checkStatus);

module.exports = router;
