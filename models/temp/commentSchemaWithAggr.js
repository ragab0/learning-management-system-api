// BAD solution as it handle only the first and second level (NOT recursive handler) !!!;

// commentSchema.statics.getCommentsPopulated = async function (lessonId) {
//   try {
//     const comments = await Comment.aggregate([
//       {
//         $match: {
//           lesson: new mongoose.Types.ObjectId(lessonId),
//         },
//       },

//       // Lookup author details
//       {
//         $lookup: {
//           from: "users",
//           localField: "author",
//           foreignField: "_id",
//           as: "authorDetails",
//         },
//       },
//       {
//         $unwind: "$authorDetails",
//       },

//       //  recursively find all replies for each comment instead of our solution of using the util/ map data structurel
//       {
//         $graphLookup: {
//           from: "comments", // Collection to search recursively
//           startWith: "$_id", // Start from the current comment ID
//           connectFromField: "_id", // Field to follow (current comment ID)
//           connectToField: "parent", // Field to match (parent comment ID)
//           as: "allReplies", // Output field for nested replies
//         },
//       },

//       // Lookup author details for all nested replies
//       {
//         $lookup: {
//           from: "users",
//           localField: "allReplies.author",
//           foreignField: "_id",
//           as: "nestedAuthorDetails",
//         },
//       },

//       // Map the `allReplies` with populated author details
//       {
//         $addFields: {
//           allReplies: {
//             $map: {
//               input: "$allReplies",
//               as: "reply",
//               in: {
//                 // _id: 1,
//                 // content: 1,
//                 // course: 1,
//                 // lesson: 1,
//                 // parent: 1,
//                 // upvotes: 1,
//                 // downvotes: 1,
//                 // createdAt: 1,
//                 // updatedAt: 1,
//                 // replies: 1,
//                 // "authorDetails._id": 1,
//                 // "authorDetails.fname": 1,
//                 // "authorDetails.lname": 1,
//                 // "authorDetails.photo": 1,

//                 _id: "$$reply._id",
//                 content: "$$reply.content",
//                 course: "$$reply.course",
//                 lesson: "$$reply.lesson",
//                 parent: "$$reply.parent",
//                 upvotes: "$$reply.upvotes",
//                 downvotes: "$$reply.downvotes",
//                 createdAt: "$$reply.createdAt",
//                 updatedAt: "$$reply.updatedAt",
//                 replies: "$$reply.replies",
//                 authorDetails: {
//                   $arrayElemAt: [
//                     {
//                       $map: {
//                         input: {
//                           $filter: {
//                             input: "$nestedAuthorDetails",
//                             as: "author",
//                             cond: { $eq: ["$$author._id", "$$reply.author"] },
//                           },
//                         },
//                         as: "filteredAuthor",
//                         in: {
//                           _id: "$$filteredAuthor._id",
//                           fname: "$$filteredAuthor.fname",
//                           lname: "$$filteredAuthor.lname",
//                           photo: "$$filteredAuthor.photo",
//                         },
//                       },
//                     },
//                     0,
//                   ],
//                 },
//               },
//             },
//           },
//         },
//       },

//       // Filter and include only direct replies
//       {
//         $addFields: {
//           replies: {
//             $filter: {
//               input: "$allReplies",
//               as: "reply",
//               cond: { $eq: ["$$reply.parent", "$_id"] },
//             },
//           },
//         },
//       },

//       // select the needed fields
//       {
//         $project: {
//           _id: 1,
//           content: 1,
//           course: 1,
//           lesson: 1,
//           parent: 1,
//           upvotes: 1,
//           downvotes: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           replies: 1,
//           "authorDetails._id": 1,
//           "authorDetails.fname": 1,
//           "authorDetails.lname": 1,
//           "authorDetails.photo": 1,
//         },
//       },

//       // Filter root comments (parent: null)
//       {
//         $match: {
//           parent: null,
//         },
//       },

//       // creation date
//       {
//         $sort: {
//           createdAt: 1,
//         },
//       },
//     ]);

//     console.log(comments);

//     return comments;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
