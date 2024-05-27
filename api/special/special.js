const express = require('express');
const router = express.Router();
const Special = require("../../models/special")

router.post("/createSpecial", async (req, res) => {
    const { title, price,hostingfee ,condition,imageUrl,power,machines} = req.body;
    try {
        const data = new Special({
            title,
            price,
            hostingfee,
            condition,
            imageUrl,
            power,
            machines
        })
        await data.save();
        res.status(200).json({ message: "item add successfully", data })
    } catch (error) {
        res.status(500).json({message:"Internal server error", errors:error.message})
    }

})

router.get('/getspecial', async (req, res) => {
    try {
        const finddata = await Special.find()
        res.status(200).json({ finddata,message:"data fetch successfully" })

    } catch (error) {
        res.status(500).json({ errors:error.message, message:"Internal server error"})
    }
})

router.put("/updatespecial/id", async (req, res) => {
    const { id } = req.params;
    const { title, price,hostingfee ,condition,power,machines} = req.body;
    try {
        const data = await Special.findOne({ _id: id });
        if (!data) {
          return  res.status(400).json({ message: 'item not found' })
        }
        if (title) {
            data.title = title;
        }
        if (price) {
            data.price = price;
        }
        if(hostingfee){
            data.hostingfee=hostingfee;
        }
        if(condition){
            data.condition=condition;
        }
        if(power){
            data.power=power;
        }
        if(machines){
            data.machiens=machiens;
        }
        await data.save();
        res.status(200).json({ message: "special successfully updated", data })


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

router.delete('/deleteSpecial/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let data = await Special.findOne({ _id: id });
        if (!data) {
          return res.status(400).json({ message: " noitem found" })
        }
        data = await Special.findByIdandDelete(id)
        res.status(200).json({ message: "item successfully deleted", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})


module.exports = router;
