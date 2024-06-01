const router = require("express").Router();
const passport = require("passport");

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
router.get("/google/callback",passport.authenticate('google', { session: false, failureRedirect: `/login` }),
(req, res) => {


  res.redirect(`${process.env.CLIENT_URL}?userdata=66667909656056945`);
});
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
