 // Import required AWS SDK clients and commands for Node.js using CommonJS syntax
 const { DynamoDBClient, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

 // Initialize DynamoDB Document Client
 const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

 const handler = async (event) => {
   try {
     console.log("Event:", JSON.stringify(event)); // Log the entire event

     // Extract PostID from query string parameters
     const postId = event.postId;

     if (!postId) {
       return {
         statusCode: 400,
         body: JSON.stringify({ message: 'PostID is required' }),
       };
     }

     // Define DynamoDB params to delete the item by PostID
     const dynamoParams = {
       TableName: 'blogPostsTable',
       Key: {
         postID: { S: postId },
       },
     };

     // Delete the item from DynamoDB
     await dynamoDBClient.send(new DeleteItemCommand(dynamoParams));

     // Return success response
     return {
       statusCode: 200,
       body: JSON.stringify({ message: 'Post deleted successfully', postId }),
     };
   } catch (error) {
     console.error('Error deleting post:', error);
     return {
       statusCode: 500,
       body: JSON.stringify({ message: 'Error deleting post', error: error.message }),
     };
   }
 };

 // Export the handler function using CommonJS syntax
 module.exports = { handler };