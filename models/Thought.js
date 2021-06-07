const { Schema, model } = require('mongoose');
//const //thoughtController = require('../controllers/thought-controller');
const dateFormat = require('../util/dateformat.js')
const ReactionSchema = require('./Reaction.js')


const ThoughtSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
    },
    username: {
      type: String,
      required: true,
      trim: true,
     
    },
    thoughtText: {
      type: String,
      trim: true,
      required: true,
      minlength: 6,
      maxlength: 200
    },
    reactions: [ReactionSchema],
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    },
   // toJSON: {
 //     getters: true
  //  },
 //   id: false
  }
);

// reaction: [{
//   type: Schema.Types.ObjectId,
//   ref: 'User'

// }],

ThoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
