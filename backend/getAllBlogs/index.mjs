// Import required AWS SDK clients and commands for Node.js using CommonJS syntax
const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');

// Initialize DynamoDB Document Client
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

const handler = async (event) => {
  try {
    // Define DynamoDB params to scan the entire table
    const dynamoParams = {
      TableName: 'blogPostsTable',
    };

    // Scan the DynamoDB table to retrieve all items
    const { Items } = await dynamoDBClient.send(new ScanCommand(dynamoParams));

    // If no items are found, return a 404 response
    if (!Items || Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No posts found' }),
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