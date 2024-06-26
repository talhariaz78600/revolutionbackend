const express = require('express');
const router = express.Router();
const Suscribe = require("../../models/suscriberModel")

router.post("/createSuscribe", async (req, res) => {
    const { email } = req.body;
    try {

        const checkemail= await Suscribe.findOne({email})
        if(checkemail){
            return res.json({message:"you have already suscribed this website"})
        }
        const data = new Suscribe({
           email
        })
        await data.save();
        res.status(200).json({ message: "Contact data add successfully", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", errors: error.message })
    }

})
router.get('/getSuscribedata', async (req, res) => {
    try {
        const finddata = await Suscribe.find()  
        res.status(200).json({ finddata, message: "Suscribe data fetch successfully" })
    } catch (error) {
        res.status(500).json({ errors: error.message, message: "Internal server error" })
    }
})


module.exports = router;