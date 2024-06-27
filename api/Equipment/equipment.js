const express = require('express');
const router = express.Router();
const Equipment = require("../../models/equipment")
const Suscribe=require("../../models/suscriberModel")
const transporter = require("../../transpoter/transpoter")
router.post("/createProduct", async (req, res) => {
    const { title, price,hostingfee ,condition,imageUrl,power,machines,producttype,monthlysupport,installation,deposit} = req.body;
    try {
        const data = new Equipment({
            title,
            price,
            hostingfee,
            condition,
            imageUrl,
            power,
            machines,
            producttype,
            monthlysupport,
            installation,
            deposit
        })
        await data.save();
        let allemail= await Suscribe.find();
        allemail=allemail.map((item)=>{
            return item.email
        })
        allemail=allemail.join(',')
        console.log(allemail)
        await data.save();
        const mailOptions = {
            from: '"Revolution Website" <trdeveloper105@gmail.com>',
            to: allemail, // use a distribution list or BCC multiple recipients
            subject: 'Product Added',
            html: `<!DOCTYPE html>
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                  }
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                    text-align: center;
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                  }
                  .header h1 {
                    margin: 0;
                    font-size: 24px;
                  }
                  .body {
                    padding: 20px;
                    text-align: center;
                  }
                  .body p {
                    font-size: 18px;
                    margin: 10px 0;
                  }
                  .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 14px;
                    color: #777777;
                    border-top: 1px solid #eeeeee;
                    margin-top: 20px;
                  }
                  .view-button {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 10px 20px;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 5px;
                    display: inline-block;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Revolution Website</h1>
                  </div>
                  <div class="body">
                    <p>Dear Subscriber,</p>
                    <p>We're excited to announce that a new product/blog has been added to our website!</p>
                    <p>Check it out <a href="${process.env.CLIENT_URL}/collections/${data.producttype==="special"?"specials":"asics"}" class="view-button">here</a>.</p>
                  </div>
                  <div class="footer">
                    <p>&copy; 2024 Revolution Website. All rights reserved.</p>
                  </div>
                </div>
              </body>
            </html>`
          };
          
         await transporter.sendMail(mailOptions);
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
    const {title, price,hostingfee,condition,power,machines,producttype, monthlysupport,installation,deposit} = req.body;
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
            data.machines=machines;
        }
        if(producttype){
            data.producttype=producttype;
        }
        if(installation){
            data.installation=installation;
        }
        if(monthlysupport){
            data.monthlysupport=monthlysupport;
        }
        if(deposit){
            data.deposit=deposit
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
          return res.status(400).json({ message: " no item found" })
        }
        data = await Equipment.findByIdAndDelete(id)
        res.status(200).json({ message: "item successfully deleted", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

router.put("/updateStatus/:id", async (req, res) => {
    const { id } = req.params;
    const { status} = req.body;
    try {
        const data = await Equipment.findOne({ _id: id });
        if (!data) {
          return  res.status(400).json({ message: 'item not found' })
        }
        data.status = status;
        await data.save();
        res.status(200).json({ message: "Product status successfully updated", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

module.exports = router;