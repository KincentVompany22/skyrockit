const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

// "/users/:userId/applications" is the prefix for all routes
    // established in server.js

// GET ROUTES

// Display All Applications
router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)
    res.render('applications/index.ejs', { applications: currentUser.applications, })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

// Display New Application Form
router.get("/new", async (req, res) => {
    res.render("applications/new.ejs")
})

// Display Application Details
router.get("/:applicationId", async (req, res) => {
    // res.send(`here is your request param: ${req.params.applicationId}`) // to test we are getting correct ApplicationId
    try {
        const currentUser = await User.findById(req.session.user._id) // Look up the user from req.session
        const application = currentUser.applications.id(req.params.applicationId) // Find the application by the applicationId supplied from req.params
        res.render("applications/show.ejs", { application: application, }) // Render the show view, passing the application data in the context object
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

// Display Edit Application Form

router.get("/:applicationId/edit", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id) // Look up the user from req.session
        const application = currentUser.applications.id(req.params.applicationId) // Find the application by the applicationId supplied from req.params
        res.render("applications/edit.ejs", { application: application, }) // Render the edit view, passing the application data in the context object
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})



// POST ROUTES

// Creating a New Application
router.post("/", async (req, res) => {
    try {
        console.log(req.body)
        const currentUser = await User.findById(req.session.user._id) // look up the user from req.session to get current user
        currentUser.applications.push(req.body) // push req.body to the applications array
        await currentUser.save() // Save changes to the user. Need to save becauses we are pushing and changing 
        res.redirect(`/users/${currentUser._id}/applications`) // redirect back to the application index view

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

// PUT ROUTES

// Editing an Application

router.put("/:applicationId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id) // Find the user from req.session
        const application = currentUser.applications.id(req.params.applicationId) // Find the current application from the id supplied by req.params
        application.set(req.body) // Use the Mongoose .set() method
        // this method updates the current application to reflect the new form data on `req.body`
        await currentUser.save() // Save the current user
        res.redirect(`/users/${currentUser._id}/applications/${req.params.applicationId}`) // Redirect back to the show view of the current application
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

// DELETE ROUTES

// Deleting an Application

router.delete("/:applicationId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id) // Look up the user from req.session
        currentUser.applications.id(req.params.applicationId).deleteOne() // Use the Mongoose .deleteOne() method to delete an application using the id supplied from req.params
        await currentUser.save() // Save changes to the user
        res.redirect(`/users/${currentUser._id}/applications`)// Redirect back to the applications index view
    } catch (error) {
        console.log(error) // If any errors, log them 
        res.redirect("/") // and redirect back home
    }
})


module.exports = router