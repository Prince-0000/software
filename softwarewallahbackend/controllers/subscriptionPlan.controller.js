const SubscriptionPlan = require("../models/subscriptionPlan");

// Fetch subscription plans
exports.getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json(plans);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching subscription plans", error });
  }
};

exports.getSubscriptionPlanById = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await SubscriptionPlan.findById(id);
    res.status(200).json(plan);
  }
  catch (error) {
    res.status(400).json({ message: "Error fetching subscription plan by id", error });
  } 
};

// Add a new subscription plan
exports.addSubscriptionPlan = async (req, res) => {
  const { serviceName, type, plans , serviceImage } = req.body;

  const plan = new SubscriptionPlan({ serviceName, type, plans , serviceImage });
  try {
    await plan.save();
    res.status(201).json({ message: "Subscription plan added successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error adding subscription plan", error });
  }
};

// Fetch subscription plans by type
exports.getSubscriptionPlansByType = async (req, res) => {
  const { type } = req.params;
  try {
    const plans = await SubscriptionPlan.find({ type });
    res.status(200).json(plans);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching subscription plans by type", error });
  }
};
