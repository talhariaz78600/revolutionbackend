const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
dotenv.config();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 2200;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const adminRouter = require('./api/admin/admin');
const userRouter = require('./api/users/user');
const authRouter = require('./api/users/auth');
const blogRouter = require('./api/blog/blog');
const mediaRouter = require('./api/socail/socail');
const suscribeRouter = require('./api/suscriber/suscriber');
const productRouter = require('./api/Equipment/equipment');
const orders = require('./api/foodorder/foodorder')
const authRoute = require("./routes/googleAuth");
const passportStrategy = require("./passport");
const transporter = require("./transpoter/transpoter")


const session = require('express-session');
const uri = process.env.Mongoo_URI;

const cookieParser = require('cookie-parser');

app.use(cookieParser());


app.use(cors({
  origin: '*', // Allow all origins
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));

app.use(session({
  secret: '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',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true }
}));


app.use(passport.initialize());
app.use(passport.session());




const connectDB = async () => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("Successfully connected to MongoDB")

    }).catch((error) => {
      console.error("Unable to connect to MongoDB", error);
    })
}


app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/media', mediaRouter);
app.use('/api/order', orders);
app.use('/api/suscriber', suscribeRouter);
app.use("/auth", authRoute);

app.get('/', async (req, res) => {
  res.json({ message: `server is running at ${PORT}` })
})

app.post('/sendemail', async (req, res) => {
  try {
    const mailOptions = {
      from: '"Revolution Website" <trdeveloper105@gmail.com>',
      to: "muhammadtalha1005@gmail.com",
      subject: 'Login successfully',
      html: ` <!DOCTYPE html>
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
              <p>Dear User,</p>
              <p>We are pleased to inform you that your login was successful!</p>
              <p>Welcome back to Revolution Website. If you have any questions or need support, feel free to contact us.</p>
              <a class="contact-button" href="https://revolutionmining.vercel.app/contact">Contact us<a>
            </div>
            <div class="footer">
              <p>&copy; 2024 Revolution Website. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>`
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully", info });
  } catch (error) {
    res.status(500).json({ message: "internel server error", errors: error });
  }

})

connectDB().then(() => {

  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
})

