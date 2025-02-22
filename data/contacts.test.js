const axios = require("axios");

describe("Contacts API Tests", () => {
    const baseURL = "http://localhost:8080/contacts";

    it("should return all contacts", async () => {
        const response = await axios.get(baseURL);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
    });

    it("should return a contact by ID", async () => {
        const response = await axios.get(`${baseURL}/1`);
        expect(response.status).toBe(200);
        expect(response.data.data.id).toBe(1);
    });

    it("should create a new contact", async () => {
        const newContact = {
            fname: "Alice",
            lname: "Brown",
            email: "alicebrown@example.com",
            phone: "555-555-5555",
            birthday: "1985-12-10"
        };

        const response = await axios.post(baseURL, newContact);
        expect(response.status).toBe(201);
        expect(response.data.data.fname).toBe("Alice");
    });

    it("should update a contact", async () => {
        const updatedContact = { fname: "Updated Name" };

        const response = await axios.put(`${baseURL}/1`, updatedContact);
        expect(response.status).toBe(200);
        expect(response.data.data.fname).toBe("Updated Name");
    });

    it("should delete a contact", async () => {
        const response = await axios.delete(`${baseURL}/1`);
        expect(response.status).toBe(200);
        expect(response.data.message).toBe("Contact deleted successfully");
    });
});

