const express=require('express');
const cookieParser=require('cookie-parser')
const app=express();

const port=8000;
const expressLayouts=require('express-ejs-layouts');
//const mongoose=require('./config/mongoose');

//used for session cookie
const db=require('./config/mongoose');      
const session =require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');

const MongoStore=require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');

app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));
app.use(expressLayouts);



app.set('layout extractStyles',true);

app.set('layout extractScripts',true);




app.set('view engine','ejs');   
app.set('views','./views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name:'codeial',
   //TODO change the secret before deployment in production mode
    secret:"blahsomething",
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100) //done the spelling of connection was wrong where?
    },
    store:new MongoStore(
        {
       
           mongooseConnection:db, //here sahi to hai I have done it now oka'yc' sorry thank you Pleae come to chat 
           autoRemove:'disabled'
        },
         function(err){
             console.log(err || 'connect-mongodb setup ok');
         }
        )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


    //use express louder
app.use('/',require('./routes'));

app.listen(port,function(err){
   if(err){
       console.log(`Error in runnig the server:${err}`);

   }

   console.log(`Server is running on port:${port}`);
});