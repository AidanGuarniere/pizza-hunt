// requirements
const { Comment, Pizza } = require("../models");

const commentController = {
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    // create comment
    Comment.create(body)
      .then(({ _id }) => {
        // add comment to the appropriate Pizza subdocument
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        );
      })
      // if Pizza not found
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  // remove comment
  removeComment({ params }, res) {
    // find comment by id and delete
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        // if no comment
        if (!deletedComment) {
          return res.status(404).json({ message: "No comment with this id!" });
        }
        // return updated Pizza
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        // if no pizza
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
