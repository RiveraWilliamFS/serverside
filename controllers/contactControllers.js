const express = require("express");
const fs = require("fs");
const path = require("path");

const contactsFilePath = path.join(__dirname, "../data/contacts.json");

const setCorsHeaders = (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const readContacts = () => {
    try {
        if (!fs.existsSync(contactsFilePath)) {
            return []; 
        }

        const data = fs.readFileSync(contactsFilePath, "utf8");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading contacts file:", error);
        return [];
    }
};

const writeContacts = (contacts) => {
    try {
        fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2));
    } catch (error) {
        console.error("Error writing to contacts file:", error);
    }
};

const getAllContacts = (req, res) => {
    try {
        setCorsHeaders(res);
        const contacts = readContacts();
        console.log("GET ALL CONTACTS:", contacts);
        res.status(200).json({ data: contacts });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getContactById = (req, res) => {
    try {
        setCorsHeaders(res);
        const contacts = readContacts();
        const contact = contacts.find(c => c.id === parseInt(req.params.id));

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        console.log("GET CONTACT BY ID:", contact);
        res.status(200).json({ data: contact });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const createContact = (req, res) => {
    try {
        setCorsHeaders(res);
        const contacts = readContacts();
        const { fname, lname, email, phone, birthday } = req.body;

        if (!fname || !lname || !email || !phone || !birthday) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newContact = {
            id: contacts.length ? contacts[contacts.length - 1].id + 1 : 1,
            fname,
            lname,
            email,
            phone,
            birthday
        };

        contacts.push(newContact);
        writeContacts(contacts);

        console.log("CREATED CONTACT:", newContact);
        res.status(201).json({ data: newContact });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const updateContact = (req, res) => {
    try {
        setCorsHeaders(res);
        const contacts = readContacts();
        const contactIndex = contacts.findIndex(c => c.id === parseInt(req.params.id));

        if (contactIndex === -1) {
            return res.status(404).json({ message: "Contact not found" });
        }

        const { fname, lname, email, phone, birthday } = req.body;

        if (fname) contacts[contactIndex].fname = fname;
        if (lname) contacts[contactIndex].lname = lname;
        if (email) contacts[contactIndex].email = email;
        if (phone) contacts[contactIndex].phone = phone;
        if (birthday) contacts[contactIndex].birthday = birthday;

        writeContacts(contacts);

        console.log("UPDATED CONTACT:", contacts[contactIndex]);
        res.status(200).json({ data: contacts[contactIndex] });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const deleteContact = (req, res) => {
    try {
        setCorsHeaders(res);
        const contacts = readContacts();
        const contactIndex = contacts.findIndex(c => c.id === parseInt(req.params.id));

        if (contactIndex === -1) {
            return res.status(404).json({ message: "Contact not found" });
        }

        const deletedContact = contacts.splice(contactIndex, 1);
        writeContacts(contacts);

        console.log("DELETED CONTACT:", deletedContact);
        res.status(200).json({ message: "Contact deleted successfully" });
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
