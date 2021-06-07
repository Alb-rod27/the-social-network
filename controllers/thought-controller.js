const { Thought, User } = require("../models");

// the functions will go in here as methods

const thoughtController = {
 // get all thoughts
 getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },
  // add comment to User??
  addThought( req, res ) {
    
    Thought.create(req.body)
      .then( (dbThoughtData) => {
        return User.findOneAndUpdate(
          { _id: req.body.id },
          { $push: { thoughts: dbThoughtData._id} },
          { new: true }
        );
      })
      .then((dbThoughtData) => {
        
        if (!dbThoughtData) {
          return res.status(404).json({ message: "Thought was created but no user with this id" });
          
        }
        res.json({message:"thought created"});
      })
      .catch((err) => res.json(err));
  },

  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // remove comment
  removeThought({ params }, res) {
    console.log({params});
    Thought.remove({ _id: params.id })
      .then((deletedThought) => {
        console.log(deletedThought);
        if (!deletedThought) {
          return res.status(404).json({ message: "Thought Deleted!" });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "Thought Deleted!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  updateThoughtById({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
  // You’re going to need a new route and another method in your controller (edited) 

  //add reply to thought
  addReply({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // remove reply
  removeReplyById({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { replyId: params.replyId } } },
      { new: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
