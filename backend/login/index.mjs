 // Import required AWS SDK clients and commands for Node.js using CommonJS syntax
 const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');

 // Initialize DynamoDB Document Client
 const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

 const handler = async (event) => {
   try {
     // Parse and validate input
     const { userID, password } = event;

     if (!userID || !password) {
       return {
         statusCode: 400,
         body: JSON.stringify({ message: 'UserID and password are required' }),
       };
     }

     // Define DynamoDB params to get the user by userID
     const dynamoParams = {
       TableName: 'blogSignupTable',
       Key: {
         userID: { S: userID }, // Treat email as userID
       },
     };

     // Retrieve the item from DynamoDB
     const { Item } = await dynamoDBClient.send(new GetItemCommand(dynamoParams));

     // If the user is not found, return a 404 response
     if (!Item) {
       return {
         statusCode: 404,
         body: JSON.stringify({ message: 'User not found' }),
       };
     }

     // Verify password (ensure this matches how passwords are stored)
     if (Item.password.S !== password) {
       return {
         statusCode: 401,
         body: JSON.stringify({ message: 'Invalid credentials' }),
       };
     }

     // Return success response
     return {
       statusCode: 200,
       body: JSON.stringify({ message: 'Login successful', userID: userID }),
     };
   } catch (error) {
     console.error('Error during login:', error);
     return {
       statusCode: 500,
       body: JSON.stringify({ message: 'Error during login', error: error.message }),
     };
   }
 };

 // Export the handler function using CommonJS syntax
 module.exports = { handler };