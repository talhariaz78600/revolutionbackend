const router = require("express").Router();
const passport = require("passport");
const User = require('../models/Mongoousers')
const secretID = process.env.secret_ID_JWT
const jwt = require('jsonwebtoken');
const transporter = require("../transpoter/transpoter")
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
			const mailOptions = {
				from: '"Revolution Website" <trdeveloper105@gmail.com>',
				to: data.email,
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
						<p>Dear User, ${data.firstname}</p>
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

			await transporter.sendMail(mailOptions);
		} else {
			const newuser = new User({ firstname: userData.name.givenName, lastname: userData.name.familyName, email: userData.emails[0].value })
			newuser.status = true;
			jwt.sign({ id: newuser._id }, secretID, { expiresIn: '30d' }, async (err, UserToken) => {
				newuser.sessionExpiration = new Date().getTime() + (1000 * 60 * 60 * 24 * 30); // 30 days in milliseconds
				newuser.jwttoken = UserToken;
			});

			await newuser.save();
			const mailOptions = {
				from: '"Revolution Website" <trdeveloper105@gmail.com>',
				to: newuser.email,
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
						<p>Dear User, ${newuser.firstname}</p>
						<p>We are pleased to inform you that your login was successful!</p>
						<p>Welcome back to Revolution Website. If you have any questions or need support, feel free to contact us.</p>
						<a class="contact-button" href=${`https://revolutionmining.vercel.app/contact`}>Contact us<a>
					  </div>
					  <div class="footer">
						<p>&copy; 2024 Revolution Website. All rights reserved.</p>
					  </div>
					</div>
				  </body>
				</html>`
			};

			await transporter.sendMail(mailOptions);

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
