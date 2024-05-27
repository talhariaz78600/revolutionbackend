const express = require('express');
const router = express.Router();
const User = require("../../models/Mongoousers")
const jwt = require('jsonwebtoken');
const secretID = process.env.secret_ID_JWT
router.get('/get_all_users', async (req, res) => {

    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'users  not found' });
        }
        res.status(200).json({ message: 'User Fetched Successfully', users });

    } catch (error) {
        res.status(500).json({ message: 'Failed to Fetch Users' });
    }

});
router.post('/:userId/update-profile', async (req, res) => {
    try {
        const { userId } = req.params
        const { email, mobileNumber,userName} = req.body
        
        if (!userId) {
            return res.status(400).json({ message: 'Invalid User Id' });
        }


        const currentUser = await User.findOne({ _id: userId });

        if (!currentUser) {
            return res.status(404).json({ message: 'user  not found' });
        }
        if (email) {
            currentUser.email = email
        }
        if (userName) {
            currentUser.userName = userName
        }
        if (mobileNumber) {
            currentUser.mobileNumber = mobileNumber
        }
      
        await currentUser.save()
        res.status(200).json({ message: 'User profile Updated Successfully', currentUser });

    } catch (error) {
        res.status(500).json({ message: 'Failed to Update  User Profile', error: error.message });
    }

});

router.get('/:id/get_user', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.status) {
            return res.status(404).json({ message: "User is Suspended" });
        }

        res.status(200).json({ message: 'User Data fetched', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch User Data, try Again Later', error: error.message });
    }
});


router.get('/:id/verfiy_user_token', async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;

    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (!user.status) {
            return res.status(404).json({ message: "User is Suspended" });
        }

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(400).json({ message: 'Invalid or missing token' });
        }

        const token = authorization.split(' ')[1];

        jwt.verify(token, secretID, (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid Token or Token Expired' });
            }
            // Token is valid, you can use the decoded information if needed
            res.status(200).json({ message: 'User Data fetched', user });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch User Data, try Again Later', error: error.message });
    }
});


//  used by both admin and user,  delte user and also delete user collection
router.delete('/:id/delete_user', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.status) {
            return res.status(404).json({ message: "User is Suspended" });
        }
        // if (user.awsbucketObjectkey) {
        //     await mediaDeleteS3(user.awsbucketObjectkey)
        // }
        await User.findByIdAndDelete(id);



        res.status(200).json({ message: 'Account deleted' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Delete Account, try Again Later', error: error.message });
    }
});


// change user status , suspend or active
router.post('/:id/update_user_status', async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (status) {
            user.status = true;
        } else {
            user.status = false;
        }
        await user.save();

        res.status(200).json({ message: 'User Status Update Successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to Update User, try Again Later', error: error.message });
    }
});

module.exports = router;
