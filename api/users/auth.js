const express = require('express');
const router = express.Router();
const User = require("../../models/Mongoousers")
const secretID = process.env.secret_ID_JWT
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//User login 

router.post('/login', async (req, res) => {
    try {
        const { email, password, } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Invalid Feilds" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No User Found" });
        }
        if (!user.status) {
            return res.status(404).json({ message: "User is Suspended" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect Password" });
        }
        
        jwt.sign({ id: user._id }, secretID, { expiresIn: '30d' }, async (err, UserToken) => {
            user.sessionExpiration = new Date().getTime() + (1000 * 60 * 60 * 24 * 30); // 30 days in milliseconds
            user.jwttoken = UserToken;
            

            user.lastLogin = new Date();
            await user.save();
            res.status(200).json({ message: 'Successfully Sign In', user });
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to login User", error: error.message });
    }

});


// user singup
router.post('/sing-up', async (req, res) => {

    try {
        const {userName,email, password,mobileNumber} = req.body;

        if (!email || !password || !mobileNumber || !userName) {
            return res.status(400).json({ message: "Invalid Feilds" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findOne({ email });

        if (user) {
            return res.status(404).json({ message: "User Already Exist" });
        }

        const newuser = new User({userName,email, password: hashedPassword, mobileNumber})
        newuser.status = true;
        jwt.sign({ id: newuser._id }, secretID, { expiresIn: '30d' }, async (err, UserToken) => {
            newuser.sessionExpiration = new Date().getTime() + (1000 * 60 * 60 * 24 * 30); // 30 days in milliseconds
            newuser.jwttoken = UserToken;
            await newuser.save();
            res.status(200).json({ message: 'Successfully Sign In', newuser });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Sign Up, try Again Later', error: error.message });
    }
});

// forgot password route  after email verfication use this route 
router.post('/forgot-password/:id/set_new_password', async (req, res) => {

    try {
        const { id } = req.params
        const { password } = req.body

        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' });
        }       
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword
        await user.save()
        res.status(200).json({ message: 'Password Set Successfully', user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to Set password" });
    }
});


router.post('/:userId/update_token', async (req, res) => {
    try {
        const { userId } = req.params;
        const { updateToken } = req.body;

        const existingUser = await User.findOne({ _id: userId });
        if (!existingUser) {
            return res.status(404).json({ message: "No User Found" });
        }
        if (!existingUser.status) {
            return res.status(404).json({ message: "User is Suspended" });
        }
        if (!updateToken) {
            return res.status(400).json({ message: "Empty Update Token" });
        }
        existingUser.token = updateToken;
        await existingUser.save();
        res.status(200).json({ message: 'Token Updated Successfully', existingUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Update Token, try Again Later', error: error.message });
    }
});



module.exports = router;
