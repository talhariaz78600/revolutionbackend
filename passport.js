const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { response } = require("express");
const passport = require("passport");
const User=require("./models/Mongoousers")
passport.use(
	new GoogleStrategy(
	  {
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		callbackURL: 'https://revolutionbackend.vercel.app/auth/google/callback',
		scope: ['profile', 'email'],
	  },
	  async (accessToken, refreshToken, profile, callback) => {
		try {
		  const existingUser = await User.findOne({ email: profile.emails[0].value });
  
		  if (existingUser) {
			// User already exists in the database
			return callback(null, existingUser,`https://revolutionbackend.vercel.app/auth/google/callback?userId=${newUser._id}`);
			
		  }
  
		  // User does not exist, create a new user
		  const newUser = new User({
			
			firstname: profile.name.givenName,
			lastname: profile.name.familyName,
			email: profile.emails[0].value,
		  });
  
		  await newUser.save();
		  return callback(null, newUser,`https://revolutionbackend.vercel.app/auth/google/callback?userId=${newUser._id}`);
		} catch (error) {
		  return callback(error, null);
		}
	  }
	)
  );
  
  passport.serializeUser((user, done) => {
	done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
	try {
	  const user = await User.findById(id);
	  done(null, user);
	} catch (error) {
	  done(error, null);
	}
  });

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
