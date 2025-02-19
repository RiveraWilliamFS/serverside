const { ContactModel } = require("@jworkman-fs/asl");
const express = require("express");
const router = express.Router();

let contacts = [
    ContactModel.create({
        id: 1,
        fname: "William",
        lname: "Rivera",
        email: "wdrivera@student.fullsail.edu",
        phone: "386-837-6525",
        birthday: "1990-03-12"
    }),
    ContactModel.create({
        id: 2,
        fname: "Jessica",
        lname: "Totman",
        email: "jmaetotman@gmail.com",
        phone: "407-412-3404",
        birthday: "1991-07-22"
    })
];

const setCorsHeaders = (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const getAllContacts = (req, res) => {
    try {
        setCorsHeaders(res);
        res.json({ data: contacts });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getContactById = (req, res) => {
    try {
        setCorsHeaders(res);
        const contact = contacts.find(c => c.id === parseInt(req.params.id));
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const createContact = (req, res) => {
    try {
        setCorsHeaders(res);
        const { fname, lname, email, phone, birthday } = req.body;

        if (!fname || !lname || !email || !phone || !birthday) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newContact = ContactModel.create({
            id: contacts.length + 1,
            fname,
            lname,
            email,
            phone,
            birthday
        });

        contacts.push(newContact);
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const updateContact = (req, res) => {
    try {
        setCorsHeaders(res);
        const contact = contacts.find(c => c.id === parseInt(req.params.id));
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        const { fname, lname, email, phone, birthday } = req.body;

        if (fname) contact.fname = fname;
        if (lname) contact.lname = lname;
        if (email) contact.email = email;
        if (phone) contact.phone = phone;
        if (birthday) contact.birthday = birthday;

        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteContact = (req, res) => {
    try {
        setCorsHeaders(res);
        const contactIndex = contacts.findIndex(c => c.id === parseInt(req.params.id));
        if (contactIndex === -1) {
            return res.status(404).json({ message: "Contact not found" });
        }

        contacts.splice(contactIndex, 1);
        res.json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};

