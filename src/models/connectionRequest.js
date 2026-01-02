const mongoose = require("mongoose");
const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",//reference to the user collection(connected to populate)
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    statusOf: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{values} is not a valid status`}
    }
},
    {
        timestamps:true,
    }

);
//compound indexing to fast the query of searching user in database
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

//Creating module of the schema
const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel", connectionRequestSchema);
module.exports = ConnectionRequestModel;