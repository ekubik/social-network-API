const { Thought, User } = require("../models");

module.exports = {
  //Get all users
  getAllUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  //Get one user by id
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  //create a new user
  createNewUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  //update existing user, by id
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, {
      runValidators: true,
      new: true,
    })
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "This user does not exist. Please try again" })
          : res.json(user)
      )
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  //delete a user, and all their associated thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() =>
        res.json({
          message: "User and all associated thoughts have been deleted",
        })
      )
      .catch((err) => res.status(500).json(err));
  },
};
