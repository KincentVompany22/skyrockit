const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const session = require('express-session')

// importing our custom middleware
const isSignedIn = require('./middleware/is-signed-in.js')
// For this application, users must be signed in to view any of the routes associated with their applications.
//  Therefore, isSignedIn should be placed above the applications controller, but not before auth.

const passUserToView = require('./middleware/pass-user-to-view.js')
// The passUserToView middleware should be included before all our routes, including our homepage, 
// just in case we want to include conditional rendering with a user’s details.

const authController = require('./controllers/auth.js')
const applicationsController = require('./controllers/applications.js')

const port = process.env.PORT ? process.env.PORT : '3000'

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
// app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)

app.use(passUserToView) // use new passUserToView middleware here


app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/applications`)
  } else {
    res.render("index.ejs")
  }
})


app.use('/auth', authController) // handle the prefix "/auth" in our auth controller file
app.use(isSignedIn); // use new isSignedIn middleware here
app.use("/users/:userId/applications", applicationsController) // handle the prefix "/users/:userId/applications" in our applications controller file



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`)
})
