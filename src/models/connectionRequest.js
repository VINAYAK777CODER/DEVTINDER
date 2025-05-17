const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "rejected", "accepted", "ignore"],
        message: "{VALUE} IS INCORRECT STATUS",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    return next(new Error("Cannot send connection request to yourself!"));
  }

  next();
});


const connectionRequestModel=mongoose.model("connectionRequestSchema",connectionRequestSchema);
module.exports=connectionRequestModel; 