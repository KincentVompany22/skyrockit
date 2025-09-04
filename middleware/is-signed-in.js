// custom middleware
// When writing a custom middleware function, recall that we want three parameters
//  instead of the usual two parameters our route handlers have been using:
    // "req" is the request object.
    // "res" is the response object.
    // "next" is the third parameter, representing the next function in the long line of middleware and route handlers 
        // that a request is processed through.

const isSignedIn = (req, res, next) => {
  if (req.session.user) return next() // if user is logged in, next() is called, allowing the request to proceed to the next middleware or route handler. 
  res.redirect('/auth/sign-in') // if NOT, moves to redirect the user to the sign-in page,
}

module.exports = isSignedIn