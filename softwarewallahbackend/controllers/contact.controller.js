// controllers/contactController.js
const Contact = require("../models/contact.model");

exports.createContact = async (req, res) => {
  const { name, email, phoneNumber, address, message } = req.body;

  try {
    const newContact = new Contact({
      name,
      email,
      phoneNumber,
      address,
      message,
    });

    const savedContact = await newContact.save();
    res
      .status(201)
      .json({ message: "Message Sent Successfully ! ", savedContact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContact = async (req, res) => {
  const { name, email, phoneNumber, address, message } = req.body;

  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phoneNumber = phoneNumber || contact.phoneNumber;
    contact.address = address || contact.address;
    contact.message = message || contact.message;

    const updatedContact = await contact.save();
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await contact.remove();
    res.status(200).json({ message: "Contact removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
