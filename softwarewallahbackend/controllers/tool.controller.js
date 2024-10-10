// controllers/ToolController.js
const Tool = require("../models/tool.model");

exports.createTool = async (req, res) => {
    try {
      const newTool = new Tool({
        name: req.body.name,
        description: req.body.description,
        month: req.body.month,
        quarter: req.body.quarter,
        yearly: req.body.yearly,
        img: req.body.img,
      });
  
      const savedTool = await newTool.save();
      res.status(201).json(savedTool);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
exports.getAllTools = async (req, res) => {
  try {
    const Tools = await Tool.find();
    console.log(Tools);
    res.status(200).json(Tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getToolById = async (req, res) => {
  try {
    const Toole = await Tool.findById(req.params.id);
    if (!Toole) {
      return res.status(404).json({ message: "Tools not found" });
    }
    res.status(200).json(Toole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

