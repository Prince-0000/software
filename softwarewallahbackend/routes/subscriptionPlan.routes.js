const express = require('express');
const router = express.Router();
const subscriptionPlanController = require('../controllers/subscriptionPlan.controller');

router.get('/', subscriptionPlanController.getSubscriptionPlans);
router.get('/:type', subscriptionPlanController.getSubscriptionPlansByType);
router.post('/', subscriptionPlanController.addSubscriptionPlan);

module.exports = router;
