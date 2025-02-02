if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const Campground = require('./models/campground');
const Review = require('./models/review.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js')

const MongoDBStore = require("connect-mongo");


const dbUrl = 'mongodb+srv://arpitamisc123:Mm7XWDZOJizcFCd5@yelp-camp.pc1bx.mongodb.net/?retryWrites=true&w=majority&appName=yelp-camp';
//mongodb://127.0.0.1:27017/yelp-camp

mongoose.connect(dbUrl, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    ssl: true 
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",() => {
    console.log("Database connected");
});

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views' , path.join(__dirname,'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const store = MongoDBStore.create({
    mongoUrl: "mongodb+srv://arpitamisc123:Mm7XWDZOJizcFCd5@yelp-camp.pc1bx.mongodb.net/?retryWrites=true&w=majority&appName=yelp-camp",  // Use correct MongoDB URI
    collectionName: "sessions",
    touchAfter: 24 * 3600,  // Reduce write frequency (optional)
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/' , (req,res) => {
    res.render('home')
})

app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'something went wrong';
    res.status(statusCode).render('error',{err});
    
})
app.listen(3000, () => {
    console.log("Serving on port 3000")
})
