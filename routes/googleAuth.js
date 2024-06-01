const router = require("express").Router();
const passport = require("passport");
// const User=require("../models/")
router.get("/login/success", (req, res) => {
	try {
		if (req.user) {
			console.log(req.user);
			res.status(200).json({
				error: false,
				message: "Successfully Loged In",
				user: req.user,
			});
		} 
	} catch (error) {
		res.status(500).json({message:"internel server error ",errors:error})
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
