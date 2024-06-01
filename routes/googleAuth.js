const router = require("express").Router();
const passport = require("passport");
const User=require("../models/Mongoousers")
const secretID = process.env.secret_ID_JWT
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
router.get("/login/success", async(req, res) => {
	try {
		if (!req.user) {
			res.status(400).json({message:"Invalid request"})
		}

		const newUser=await User.findOne({email:req.user.emails.value})
		if(!newUser){
			console.log(req.user);
			const newuser = new User({firstname:req.user.name.givenName,lastname:req.user.name.familyName,email:req.user.emails.value})
			newuser.status = true;
			jwt.sign({ id: newuser._id }, secretID, { expiresIn: '30d' }, async (err, UserToken) => {
				newuser.sessionExpiration = new Date().getTime() + (1000 * 60 * 60 * 24 * 30); // 30 days in milliseconds
				newuser.jwttoken = UserToken;
				await newuser.save();
				res.status(200).json({ message: 'Successfully Sign In', newuser });
			});

		}
		res.status(200).json({newuser:newUser})
	} catch (error) {
		res.status(500).json({message:"internel server error",errors:error.message})
	}
	
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate('google', { scope: 
	[ 'email', 'profile' ] 
}));

router.get("/google/callback",passport.authenticate("google", {
		successRedirect: `${process.env.CLIENT_URL}`,
		failureRedirect: "/login/failed",
	})
	
);

router.get("/logout", (req, res) => {
	try {
		req.logout((err) => {
			if (err) {
			  return next(err);
			}
			
			res.status(200).json({message:"user successfully logout"})
		  });
	} catch (error) {
		res.status(500).json({message:"internal server error",errors:error.message})
	}
	// res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
