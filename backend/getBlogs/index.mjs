 // Import required AWS SDK clients and commands for Node.js using CommonJS syntax
 const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');

 // Initialize DynamoDB Document Client
 const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

 const handler = async (event) => {
   try {
     // Extract UserID from query string parameters
     const userId = event.userID;
     if (!userId) {
       return {
         statusCode: 400,
         body: JSON.stringify({ message: 'UserID is required' }),
       };
     }

     // Define DynamoDB params to scan for items by UserID
     const dynamoParams = {
       TableName: 'blogPostsTable',
       FilterExpression: 'userID = :userId',
       ExpressionAttributeValues: {
         ':userId': { S: userId },
       },
     };

     // Scan the DynamoDB table to retrieve items by UserID
     const { Items } = await dynamoDBClient.send(new ScanCommand(dynamoParams));

     // If no items are found, return a 404 response
     if (!Items || Items.length === 0) {
       return {
         statusCode: 404,
         body: JSON.stringify({ message: 'No posts found for this user' }),
       };
     }

     // Format the retrieved items into a more usable format
     const blogPosts = Items.map((Item) => ({
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

     // Return the blog posts data
     return {
       statusCode: 200,
       body: JSON.stringify(blogPosts),
     };
   } catch (error) {
     console.error('Error retrieving posts:', error);
     return {
       statusCode: 500,
       body: JSON.stringify({ message: 'Error retrieving posts', error: error.message }),
     };
   }
 };

 // Export the handler function using CommonJS syntax
 module.exports = { handler };
