import GoogleStrategy from "passport-google-oauth20";
import TwitterStrategy from "passport-twitter";
import passport from "passport";

import { keys } from "./env.js";
import { User } from "./models/index.js";

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: keys.GOOGLE_CLIENT_ID,
      clientSecret: keys.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      
      const newUser = await User.findOrCreate({
        where: { email: profile._json.email },
        defaults: {
          profileImg: profile.photos[0].value,
          firstName: profile._json.given_name,
          lastName: profile._json.family_name,
          email: profile._json.email,
          profUpdated: true,
          gender: profile._json.gender || "male",
          withSocials: true,
          password: "_",
          role:"user",
         
        },
      });
      cb(null, newUser);
    }
  )
);

passport.use(new TwitterStrategy.Strategy({
  consumerKey:keys.TWITTER_CLIENT_ID,
  consumerSecret:keys.TWITTER_CLIENT_SECRET,
  callbackURL:"/auth/twitter/callback",
  includeEmail:true
},
async(accessToken,refreshToken,profile,cb)=>{

  const user=await User.findOrCreate({where:{email:profile._json.email},defaults:{
    firstName:profile._json.name.split(" ")[0],
    lastName:profile._json.name.split(" ")[1],
    profileImg:profile._json.profile_image_url,
    gender:profile.gender||"male",
    email:profile._json.email,
    role:"user",
    profUpdated:true,
    password:"_",
    withSocials:true
  }})
  
      
  cb(null,user);
      
    },
    
    

    

))

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});
