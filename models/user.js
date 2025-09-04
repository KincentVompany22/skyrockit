const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({ // properties of applications
  company: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  postingLink: {
    type: String,
  },
  status: {
    type: String,
    enum: ['interested', 'applied', 'interviewing', 'rejected', 'accepted'], // enum (enumerate) is a validator on Strings or Numbers, has to be specific
  },
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  applications: [applicationSchema], // embed applicationSchema here
  // we defined applicationSchema before using it in userSchema. This order is important — the structure of the nested data must be created first.
})


const User = mongoose.model('User', userSchema) 

module.exports = User // we dont need to specifically export the applicationSchema because it is a part of userSchema