const { Schema, model } = require("mongoose");

const connectionSchema = new Schema(
  {
    flwId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    flngId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Connection = model("connection", connectionSchema);

module.exports = Connection;
