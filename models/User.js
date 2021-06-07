const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  // Add these four attributes to your schema: username, password, email, userCreated
  // YOUR CODE HERE
  //
  username: {
    type: String,
    trim: true,
    
  },
  password: {
    type: String,
    trim: true,
    required: true,
    validate: [({ length}) => length >= 6, "password should be longer."]
  },
  email: {
    type: String,
    unique: true,
    match: [/.+@.+\..+/, "please enter valid email"]
  },

thoughts: [
  {
  type: Schema.Types.ObjectId,
  ref: 'Thought'
  
},
],


friend: [{
  type: Schema.Types.ObjectId,
  
  ref: 'User'
  
}],




  userCreated: {
    type:Date,
    default: Date.now
  }
 
});


const User = model('User', UserSchema);

module.exports = User;



