const router = require("express").Router();
const passport = require("passport");
const User=require("../models/Mongoousers")
const secretID = process.env.secret_ID_JWT
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
router.get('/login/success', async (req, res) => {
	try {
	//   if (!req.user) {
		return res.status(200).json({ message: 'getsuccessfully',user:req.user});
	//   }
  
	//   const userEmail = req.user.emails.value; // Correctly accessing the email value
	//   let existingUser = await User.findOne({ email: userEmail });
  
	//   if (!existingUser) {
	// 	console.log(req.user);
  
	// 	const newUser = new User({
	// 	  firstname: req.user.name.givenName,
	// 	  lastname: req.user.name.familyName,
	// 	  email: userEmail,
	// 	  status: true,
	// 	});
  
	// 	jwt.sign({ id: newUser._id }, secretID, { expiresIn: '30d' }, async (err, UserToken) => {
	// 	  if (err) {
	// 		return res.status(500).json({ message: 'Token generation failed', errors: err.message });
	// 	  }
  
	// 	  newUser.sessionExpiration = new Date().getTime() + (1000 * 60 * 60 * 24 * 30); // 30 days in milliseconds
	// 	  newUser.jwttoken = UserToken;
	// 	  await newUser.save();
  
	// 	  return res.status(200).json({ message: 'Successfully signed in', newuser: newUser });
	// 	});
	//   } else {
	// 	return res.status(200).json({ newuser: existingUser });
	//   }
	} catch (error) {
	  return res.status(500).json({ message: 'Internal server error', errors: error.message });
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
