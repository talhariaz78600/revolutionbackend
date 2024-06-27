const express = require('express');
const router = express.Router();
const Blog = require("../../models/blogModel")
const Suscribe=require("../../models/suscriberModel")
const transporter = require("../../transpoter/transpoter")
router.post("/createBlog", async (req, res) => {
    const { title, description, imageUrl } = req.body;
    try {
        const data = new Blog({
            title: title,
            description: description,
            imageUrl: imageUrl
        })
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
            subject: 'Blog Added',
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
                    <p>Check it out <a href="${process.env.CLIENT_URL}/blogs/the-revolution-blog/1" class="view-button">here</a>.</p>
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
        console.log(error);
    }

})

router.get('/getblogdata', async (req, res) => {
   
    const pageNumber = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 1;

    const skip = (pageNumber - 1) * pageSize;

    let stop;
    try {
        stop = await Blog.countDocuments();

        const finddata = await Blog.find()
            .sort({ _id: -1 })
            .skip(skip)
            .limit(pageSize)
        res.status(200).json({ finddata,skip, stop,message:"data fetch successfully" })


    } catch (error) {
        res.status(500).json({ errors:error.message, message:"Internal server error"})
    }
})

router.get('/getallblog', async (req, res) => {
    try {
        
        const finddata = await Blog.find()
        res.status(200).json({ finddata,message:"data fetch successfully" })


    } catch (error) {
        res.status(500).json({ errors:error.message, message:"Internal server error"})
    }
})
router.get("/getsingleblog/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Blog.findOne({ _id: id });
        if (!data) {
          return  res.status(400).json({ message: 'blog not found' })
        }
  
        res.status(200).json({ message: "blog fetch successfully", data })


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})


router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description} = req.body;
    try {
        let data = await Blog.findOne({ _id: id });
        if (!data) {
          return  res.status(400).json({ message: 'blog not found' })
        }
        if (title) {
            data.title = title;
        }
        if (description) {
            data.description = description;
        }
        await data.save();
        res.status(200).json({ message: "blog successfully updated", data })


    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})


router.delete('/deleteBlog/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let data = await Blog.findOne({ _id: id });
        if (!data) {
          return res.status(400).json({ message: "Blog not found" })
        }
        data = await Blog.findByIdAndDelete(id)
        res.status(200).json({ message: "blog successfully deleted", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

router.put('/createComment/:blogId', async (req, res) => {
    const { blogId } = req.params;
    const { name, comment, email } = req.body;
    try {
        const data = await Blog.findOne({ _id: blogId });
        if (!data) {
          return  res.status(400).json({ message: "blog not found" })
        }
        data.comments.push({
            name: name,
            comment: comment,
            email: email
        })
        await data.save();
        res.status(200).json({ message: "comment successfully added", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

router.put('/deleteComment/:blogId', async (req, res) => {
    const { blogId } = req.params;
    try {
        let data = await Blog.findOne({ _id: blogId });
        if (!data) {
            return res.status(400).json({ message: "blog not found" })
        }
        data.comments= data.comments.filter((item) => item._id.toString() != blogId);
        await data.save();
        res.status(200).json({ message: "comment successfully deleted", data })
    } catch (error) {
        res.status(500).json({ message: "Internal server error",errors:error.message});
    }
})
module.exports = router;
