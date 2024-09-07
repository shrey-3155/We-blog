 // Import required AWS SDK clients and commands for Node.js using CommonJS syntax
 const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');

 // Initialize DynamoDB Document Client
 const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

 const handler = async (event) => {
   try {
     // Extract postID from query string parameters
     const postId = event.postId;
     if (!postId) {
       return {
         statusCode: 400,
         body: JSON.stringify({ message: 'postId is required' }),
       };
     }

     // Define DynamoDB params to scan for items by postID
     const dynamoParams = {
       TableName: 'blogPostsTable',
       FilterExpression: 'postID = :postId',
       ExpressionAttributeValues: {
         ':postId': { S: postId },
       },
     };

     // Scan the DynamoDB table to retrieve items by postID
     const { Items } = await dynamoDBClient.send(new ScanCommand(dynamoParams));

     // If no items are found, return a 404 response
     if (!Items || Items.length === 0) {
       return {
         statusCode: 404,
         body: JSON.stringify({ message: 'No post found with this postID' }),
       };
     }

     // Format the retrieved item into a more usable format
     const blogPost = Items.map((Item) => ({
       postID: Item.postID.S,
       userID: Item.userID.S,
       title: Item.title.S,
       content: Item.content.S,
       imageURL: Item.imageURL.S,
       PDFURL: Item.PDFURL.S,
       createdAt: Item.createdAt.S,
       updatedAt: Item.updatedAt.S,
       sentiment: Item.sentiment.S,
     }));

     // Return the blog post data
     return {
       statusCode: 200,
       body: JSON.stringify(blogPost[0]),
     };
   } catch (error) {
     console.error('Error retrieving post:', error);
     return {
       statusCode: 500,
       body: JSON.stringify({ message: 'Error retrieving post', error: error.message }),
     };
   }
 };

 // Export the handler function using CommonJS syntax
 module.exports = { handler };