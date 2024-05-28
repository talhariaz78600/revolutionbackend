const express = require('express');
const router = express.Router();
const Equipment = require("../../models/equipment")

router.post("/createProduct", async (req, res) => {
    const { title, price,hostingfee ,condition,imageUrl,power,machines,producttype} = req.body;
    try {
        const data = new Equipment({
            title,
            price,
            hostingfee,
            condition,
            imageUrl,
            power,
            machines,
            producttype
        })
        await data.save();
        res.status(200).json({ message: "item add successfully", data })
    } catch (error) {
        res.status(500).json({message:"Internal server error", errors:error.message})
    }

})

router.get('/getProducts', async (req, res) => {
    try {
        const finddata = await Equipment.find()
        res.status(200).json({ finddata,message:"data fetch successfully" })

    } catch (error) {
        res.status(500).json({ errors:error.message, message:"Internal server error"})
    }
})

router.get('/getsingleProduct/:id', async (req, res) => {
    const {id}=req.params;
    try {
        let finddata=await Equipment.findById(id);
        if(!finddata){
            return res.status(400).json({message:"product not found"})
        }
    
        res.status(200).json({ finddata,message:"data fetch successfully" })

    } catch (error) {
        res.status(500).json({ errors:error.message, message:"Internal server error"})
    }
})
router.put("/updateProduct/:id", async (req, res) => {
    const { id } = req.params;
    const { title, price,hostingfee ,condition,power,machines,producttype} = req.body;
    try {
        const data = await Equipment.findOne({ _id: id });
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
            data.machiens=machines;
        }
        if(producttype){
            data.producttype=producttype;
        }
        await data.save();
        res.status(200).json({ message: "Product successfully updated", data })


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

router.delete('/deleteProduct/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let data = await Equipment.findOne({ _id: id });
        if (!data) {
          return res.status(400).json({ message: " noitem found" })
        }
        data = await Equipment.findByIdAndDelete(id)
        res.status(200).json({ message: "item successfully deleted", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})


module.exports = router;