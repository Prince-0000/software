const mongoose = require("mongoose");

const durationSchema = new mongoose.Schema({
  duration: {
    type: String,
    enum: ["1 month", "6 month", "12 month" , "1 year"],
    required: true,
  },
  priceINR: {
    type: Number,
    required: true,
  },
  priceUSD: {
    type: Number,
    required: true,
  },
});

const subscriptionPlanSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  serviceImage: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["tool", "bundle"],
    required: true,
  },
  plans: [durationSchema],
  available: {
    type: Boolean,
    default: true,
  },
});

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);


// const insertSubscriptionPlans = async () => {
//   const plans = [
//     {
//       serviceName: "Helium 10 (Web + Extension)",
//       type: "tool",
//       serviceImage: "https://example.com/helium10-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 700, priceUSD: 9 },
//         { duration: "6 month", priceINR: 1800, priceUSD: 22 },
//         { duration: "12 month", priceINR: 3000, priceUSD: 36 },
//       ],
//     },
//     {
//       serviceName: "Jungle Scout (Web + Extension)",
//       type: "tool",
//       serviceImage: "https://example.com/junglescout-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 700, priceUSD: 9 },
//         { duration: "6 month", priceINR: 1800, priceUSD: 22 },
//         { duration: "12 month", priceINR: 3000, priceUSD: 36 },
//       ],
//     },
//     {
//       serviceName: "Viral Launch",
//       type: "tool",
//       serviceImage: "https://example.com/virallaunch-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 500, priceUSD: 6 },
//         { duration: "6 month", priceINR: 1000, priceUSD: 12 },
//         { duration: "12 month", priceINR: 1500, priceUSD: 18 },
//       ],
//     },
//     {
//       serviceName: "Egrow",
//       type: "tool",
//       serviceImage: "https://example.com/egrow-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 500, priceUSD: 6 },
//         { duration: "6 month", priceINR: 1000, priceUSD: 12 },
//         { duration: "12 month", priceINR: 1500, priceUSD: 18 },
//       ],
//     },
//     {
//       serviceName: "Rocket Source",
//       type: "tool",
//       serviceImage: "https://example.com/rocketsource-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 500, priceUSD: 6 },
//         { duration: "6 month", priceINR: 1000, priceUSD: 12 },
//         { duration: "12 month", priceINR: 1500, priceUSD: 18 },
//       ],
//     },
//     {
//       serviceName: "Data Spark",
//       type: "tool",
//       serviceImage: "https://example.com/dataspark-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 500, priceUSD: 6 },
//         { duration: "6 month", priceINR: 1000, priceUSD: 12 },
//         { duration: "12 month", priceINR: 1500, priceUSD: 18 },
//       ],
//     },
//     {
//       serviceName: "Nice Scraper",
//       type: "tool",
//       serviceImage: "https://example.com/nicescraper-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 500, priceUSD: 6 },
//         { duration: "6 month", priceINR: 1000, priceUSD: 12 },
//         { duration: "12 month", priceINR: 1500, priceUSD: 18 },
//       ],
//     },
//     {
//       serviceName: "Xenon Hunt",
//       type: "tool",
//       serviceImage: "https://example.com/xenonhunt-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 500, priceUSD: 6 },
//         { duration: "6 month", priceINR: 1000, priceUSD: 12 },
//         { duration: "12 month", priceINR: 1500, priceUSD: 18 },
//       ],
//     },
//     {
//       serviceName: "Sell The Trend",
//       type: "tool",
//       serviceImage: "https://example.com/sellthetrend-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 500, priceUSD: 6 },
//         { duration: "6 month", priceINR: 1000, priceUSD: 12 },
//         { duration: "12 month", priceINR: 1500, priceUSD: 18 },
//       ],
//     },
//     {
//       serviceName: "Chat GPT",
//       type: "tool",
//       serviceImage: "https://example.com/chatgpt-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 500, priceUSD: 6 },
//         { duration: "6 month", priceINR: 1000, priceUSD: 12 },
//         { duration: "12 month", priceINR: 1500, priceUSD: 18 },
//       ],
//     },
//     {
//       serviceName: "Canva Pro",
//       type: "tool",
//       serviceImage: "https://example.com/canvapro-logo.png",
//       plans: [{ duration: "1 year", priceINR: 250, priceUSD: 3 }],
//     },
//     {
//       serviceName: "Grammarly",
//       type: "tool",
//       serviceImage: "https://example.com/grammarly-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 300, priceUSD: 4 },
//         { duration: "6 month", priceINR: 600, priceUSD: 7 },
//         { duration: "12 month", priceINR: 1500, priceUSD: 12 },
//       ],
//     },
//     {
//       serviceName: "Skill Share",
//       type: "tool",
//       serviceImage: "https://example.com/skillshare-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 300, priceUSD: 4 },
//         { duration: "6 month", priceINR: 600, priceUSD: 7 },
//         { duration: "12 month", priceINR: 1000, priceUSD: 12 },
//       ],
//     },
//     {
//       serviceName: "Linked In Learning",
//       type: "tool",
//       serviceImage: "https://example.com/linkedinlearning-logo.png",
//       plans: [
//         { duration: "1 month", priceINR: 300, priceUSD: 4 },
//         { duration: "6 month", priceINR: 600, priceUSD: 7 },
//         { duration: "12 month", priceINR: 1000, priceUSD: 12 },
//       ],
//     },
//   ];

//   try {
//     await SubscriptionPlan.insertMany(plans);
//     console.log("Subscription plans inserted successfully");
//   } catch (error) {
//     console.error("Error inserting subscription plans:", error);
//   } finally {
//   }
// };

// insertSubscriptionPlans();


module.exports = SubscriptionPlan;




