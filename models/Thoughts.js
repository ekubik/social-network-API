const { Schema, model, Types } = require("mongoose");
const moment= require("moment");

//Define Reaction schema
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      default: moment(new Date()).format("DD MMM YYYY hh:mm a"),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: String,
      default: moment(new Date()).format('DD MMM YYYY hh:mm a'),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

//Create reactionCount virtual
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

//Initialise Thought model
const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
