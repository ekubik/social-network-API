const { Thought, User } = require("../models");

module.exports = {
  //Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  //Get one thought, by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No Thoughts with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  //Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "" })
          : res.json({ message: "Thought has been successfully created" })
      )
      .catch((err) => res.status(500).json(err));
  },
  //Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "Thought not found" })
          : User.deleteMany({ _id: { $in: thought.users } })
      )
      .then(() => res.json({ message: "Thought has been deleted" }))
      .catch((err) => res.status(500).json(err));
  },

  // ((thought) =>
  // !thought
  // ? res.status(404).json({ message: "No thoughts with that ID exist." })
  //: res.json({ message: "Thought has been deleted" })).catch((err) =>
  //  res.status(500).json(err)
  // )
  // );
  //},

  //update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID" })
          : res.json(thought)
      )
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //add reaction to thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  //remove a reaction by its reaction id
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.body.reactionId } } },
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
