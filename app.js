const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");
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



// app.use(
//   cors({
//     origin: ['https://omd-admin-panel.netlify.app', 'http://localhost:3000',],
//     origin: true,
//   })
// );


const uri = process.env.Mongoo_URI;
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

app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);

app.get('/', async (req, res) => {
  res.json({ message: `server is running at ${PORT}` })
})


connectDB().then(() => {

  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
})