const router = require("express").Router();
const passport = require("passport");
const User = require('../models/Mongoousers')
const secretID = process.env.secret_ID_JWT
const jwt = require('jsonwebtoken');
// Login Success Route
router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Logged In",
			user: req.user,
		});
	} else {
		res.status(403).json({
			error: true,
			message: "Not Authenticated",
		});
	}
});

// Login Failure Route
router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

// Google Authentication Route
router.get("/google", passport.authenticate('google', { scope: ['email', 'profile'] }));

// Google Authentication Callback Route
router.get(
	"/google/callback",
	passport.authenticate('google', { session: false, failureRedirect: '/login' }),
	async (req, res) => {
		// User data is now available in req.user
		const userData = req.user;
		console.log('User Data:', userData);
		const data = await User.findOne({ email: userData.emails[0].value })

		if (data) {
			res.redirect(`${process.env.CLIENT_URL}?userdata=${encodeURIComponent(JSON.stringify(data))}`);
		} else {
			const newuser = new User({ firstname: userData.name.givenName, lastname: userData.name.familyName, email: userData.emails[0].value })
			newuser.status = true;
			jwt.sign({ id: newuser._id }, secretID, { expiresIn: '30d' }, async (err, UserToken) => {
				newuser.sessionExpiration = new Date().getTime() + (1000 * 60 * 60 * 24 * 30); // 30 days in milliseconds
				newuser.jwttoken = UserToken;
				await newuser.save();
			});

			res.redirect(`${process.env.CLIENT_URL}?userdata=${encodeURIComponent(JSON.stringify(newuser))}`);

		}
	}
);
// Logout Route
router.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.status(200).json({ message: "User successfully logged out" });
	});
});

module.exports = router;
