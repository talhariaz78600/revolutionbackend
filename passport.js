const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
    new GoogleStrategy(
        {
            clientID: `${process.env.CLIENT_ID}`,
            clientSecret: `${process.env.CLIENT_SECRET}`,
            callbackURL: "https://revolutionbackend.vercel.app/auth/google/callback",
            scope: ["profile", "email"],
        },
        function (accessToken, refreshToken, profile, done) {
            console.log('Profile Data');
            console.log(profile);
            // Assuming you save the user to your database here and retrieve a user object
            // For example, you can use profile.id to find or create a user in your database
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
	
