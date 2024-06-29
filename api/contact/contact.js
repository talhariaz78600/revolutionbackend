const express = require('express');
const router = express.Router();
const Contact = require("../../models/contactModel")

router.post("/createContact", async (req, res) => {
    const { Name, lastname, email, message } = req.body;
    try {
        const data = new Contact({
            Name, lastname, email, message
        })
        await data.save();
        res.status(200).json({ message: "Contact data add successfully", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", errors: error.message })
    }

})
router.get('/getcontactdata', async (req, res) => {
    try {
        const finddata = await Contact.find()  
        res.status(200).json({ finddata, message: "Contact data fetch successfully" })
    } catch (error) {
        res.status(500).json({ errors: error.message, message: "Internal server error" })
    }
})
router.delete('/deleteContact/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let data = await Contact.findOne({ _id: id });
        if (!data) {
            return res.status(400).json({ message: "Contact not found" })
        }
        data = await Contact.findByIdandDelete(id)
        res.status(200).json({ message: "Contact successfully deleted", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

module.exports = router;
