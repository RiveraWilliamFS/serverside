const axios = require("axios");
const { validateContactData } = require("@jworkman-fs/asl");
const { ServerUnreachableError } = require("@jworkman-fs/asl");
const { InvalidContactSchemaError } = require("@jworkman-fs/asl");
const { Curl } = require("node-libcurl");

describe("Contacts API Tests", () => {
    const baseURL = "http://localhost:8080/contacts";

    it("should return all contacts", async () => {
        try {
            const response = await axios.get(baseURL);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data.data)).toBe(true); 
        } catch (error) {
            throw new ServerUnreachableError("Failed to reach the server at /contacts.");
        }
    });

    it("should return a contact by ID", async () => {
        try {
            const response = await axios.get(`${baseURL}/1`);
            expect(response.status).toBe(200);
            expect(response.data.id).toBe(1);
        } catch (error) {
            throw new InvalidContactSchemaError("Failed to retrieve a valid contact.");
        }
    });

    it("should create a new contact", async () => {
        const newContact = {
            fname: "Alice",
            lname: "Brown",
            email: "alicebrown@example.com",
            phone: "555-555-5555",
            birthday: "1985-12-10"
        };

        try {
            const response = await axios.post(baseURL, newContact);
            expect(response.status).toBe(201);
            expect(response.data.fname).toBe("Alice");
        } catch (error) {
            throw new InvalidContactSchemaError("Contact creation failed.");
        }
    });

    it("should update a contact", async () => {
        const updatedContact = {
            fname: "Updated Name"
        };

        try {
            const response = await axios.put(`${baseURL}/1`, updatedContact);
            expect(response.status).toBe(200);
            expect(response.data.fname).toBe("Updated Name");
        } catch (error) {
            throw new InvalidContactSchemaError("Contact update failed.");
        }
    });

    it("should delete a contact", async () => {
        try {
            const response = await axios.delete(`${baseURL}/1`);
            expect(response.status).toBe(200); 
        } catch (error) {
            throw new InvalidContactSchemaError("Contact deletion failed.");
        }
    });
});
