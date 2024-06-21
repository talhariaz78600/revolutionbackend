const express = require('express');
const router = express.Router();
const Media = require("../../models/socialModel")

router.post("/createMedia", async (req, res) => {
    const { facebookUrl,instagramUrl,telegramUrl,twitterUrl } = req.body;
    try {
        const data = new Media({
            facebookUrl: facebookUrl,
            instagramUrl: instagramUrl,
            telegramUrl: telegramUrl,
            twitterUrl :twitterUrl 
        })
        await data.save();
        res.status(200).json({ message: "Media add successfully", data })
    } catch (error) {
        res.status(500).json({message:"Internal server error", errors:error.message})
    }

})



router.get("/getsinglemedia/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Media.findOne({ _id: id });
        if (!data) {
          return  res.status(400).json({ message: 'Media not found' })
        }
  
        res.status(200).json({ message: "Media fetch successfully", data })


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})


router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { facebookUrl,instagramUrl,telegramUrl,twitterUrl } = req.body;
    try {
        let data = await Media.findOne({ _id: id });
        if (!data) {
          return  res.status(400).json({ message: 'Media not found' })
        }
        if (facebookUrl) {
            data.facebookUrl = facebookUrl;
        }
        if (instagramUrl) {
            data.instagramUrl = instagramUrl;
        }
        if (telegramUrl) {
            data.telegramUrl = telegramUrl;
        }
        if (twitterUrl) {
            data.twitterUrl = twitterUrl;
        }
        await data.save();
        res.status(200).json({ message: "Media successfully updated", data })


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})



module.exports = router;
