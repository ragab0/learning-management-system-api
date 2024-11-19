// a util helps me to gather together the all ids of a comment of its replies to delete all,
// since the root one (parent) has been deleted;

export function flatStructuredomment(comment, result = []) {
  // add current's id
  result.push(comment._id);

  // iterate through its replies;
  if (comment.replies && comment.replies.length > 0) {
    comment.replies.forEach((reply) => flatStructuredomment(reply, result));
  }

  return result.slice(1);
}
