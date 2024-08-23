const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item" }, // ID of the item the comment is associated with
    comment_text: String, // The actual text content of the comment
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID of the user who posted the comment
    //created_at: Date,        // Timestamp indicating when the comment was posted
    repliedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    likedBy:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
