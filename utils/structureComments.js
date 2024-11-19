// structure the comments hierarchically ...
// instead of the aggreagtions AS the $function (to recursive our idea) method is not free;

export function structureComments(coms) {
  // saving in it the all root elements those his parent is null;
  // saving the REFERENCE of each comment into the map .. O(1);
  const tree = [];
  const mapComments = new Map();
  const deletedNestedComments = [];
  let count = 0;

  coms.forEach((c) => {
    mapComments.set(c._id.toString(), c);
  });

  mapComments.forEach((comment) => {
    // as parent is optional
    if (comment.parent?.toString()) {
      if (mapComments.get(comment.parent.toString())) {
        mapComments.get(comment.parent.toString()).replies.push(comment);
        count++;
      } else {
        // the comments those parent have been deleted BUT STILL EXIST
        // we'll delete them here to re-calcualte the structure there;
        // xD;
        console.log(
          "my parent has been deleted please don't delete me #_#",
          comment
        );
        deletedNestedComments.push(comment._id);
      }
    } else {
      tree.push(comment);
      count++;
    }
  });

  return [tree, count, deletedNestedComments];
}
