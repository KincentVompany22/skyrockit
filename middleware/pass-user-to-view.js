// custom middleware

const passUserToView = (req, res, next) => {
  res.locals.user = req.session.user ? req.session.user : null // ternary operator
  // if a user exists (in req.session.user) then set the value of res.locals.user to that user.
  // Otherwise, we will set the value of res.locals.user to null. 
  next() // then call the next function in our route handling sequence.
}

module.exports = passUserToView