// routes/contactRoutes.js
const express = require("express");
const {
  getAllTools,
  getToolById,
  createTool
} = require("../controllers/tool.controller");

const router = express.Router();

router.post("/create", createTool);
router.get("/", getAllTools);
router.get("/:id", getToolById);

module.exports = router;
