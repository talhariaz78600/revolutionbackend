const express = require('express');
const router = express.Router();
const Suscribe = require("../../models/suscriberModel")
const transporter = require("../../transpoter/transpoter")
router.post("/createSuscribe", async (req, res) => {
    const { email } = req.body;
    try {

        const checkemail= await Suscribe.findOne({email})
        if(checkemail){
            return res.status(400).json({message:"you have already suscribed this website"})
        }
        const data = new Suscribe({
           email
        })

        await data.save();
        const mailOptions = {
            from: '"Revolution Website" <trdeveloper105@gmail.com>',
            to: email,
            subject: 'Subscription Confirmation',
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
                  .contact-button {
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
                    <p>Thank you for subscribing to Revolution Website!</p>
                    <p>We're excited to have you on board. Stay tuned for updates, news, and special offers.</p>
                    <p>If you have any questions or need support, feel free to contact us.</p>
                    <a class="contact-button" href="https://revolutionmining.vercel.app/contact">Contact us</a>
                  </div>
                  <div class="footer">
                    <p>&copy; 2024 Revolution Website. All rights reserved.</p>
                  </div>
                </div>
              </body>
            </html>`
          };
          
          const info = await transporter.sendMail(mailOptions);
          
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