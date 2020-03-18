const passport=require('passport');

const LocalStrategy=require('passport-local').Strategy;
 
const User=require('../models/users');
//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    },
    function(email,password,done){
      // find a user  establish the identity
      User.findOne({email:email}, function(err,user){
          if(err){
              console.log('Error in finding user--> Passport');
              return done(err);
          }

          if(!user || user.password!=password){
              console.log('Invalid Username/Password');
              return done(null,false);
          }

          return done(null,user);
      })
    }
    ));

//serializing the user  to decide which key is to be kept in the  cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});
//deserialize the user from the key in the cookies
passport.deserializeUser(function(id,done){
   User.findById(id,function(err,user){
          if(err){
            console.log('Error in finding user--> Passport');
            return done(err);
          }

          return done(null,user);
   });
});
//check if the user is Authenticated

passport.checkAuthentication=function(req,res,next){
    //if the user is signed in, then pass on the request to the next function(contoller's action)
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');
}   
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req user contains the current signed in user from the session cookieand we just sending this to the locals for the 
        //views
        res.locals.user=req.user;

    }
    next();
}

module.exports=passport;