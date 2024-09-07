const { DynamoDBClient, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { SNSClient, PublishCommand, SubscribeCommand } = require('@aws-sdk/client-sns');
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
const snsClient = new SNSClient({ region: 'us-east-1' });

exports.handler = async (event) => {
  try {
    console.log("Event:", JSON.stringify(event)); // Log the event for debugging

    // Parse and validate input
    const { firstName, lastName, emailId, password, mobile } = event;
    console.log("test" + emailId);

    if (!firstName || !lastName || !emailId || !password || !mobile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'All fields are required' }),
      };
    }

    const topicArn = process.env.BLOG_NOTIFICATION_TOPIC_ARN;

    // Check if user already exists
    const getItemParams = {
      TableName: 'blogSignupTable',
      Key: {
        userID: { S: emailId }
      }
    };

    const existingUser = await dynamoDBClient.send(new GetItemCommand(getItemParams));

    if (existingUser.Item) {
      return {
        statusCode: 409,  // Conflict status code
        body: JSON.stringify({ message: 'User with this email already exists' }),
      };
    }

    // Subscribe user to SNS topic
    const subscribeParams = {
      Protocol: 'EMAIL',
      Endpoint: emailId,
      TopicArn: topicArn,
    };

    // Subscribe user to the SNS topic
    const subscribeResponse = await snsClient.send(new SubscribeCommand(subscribeParams));
    console.log("sss" + subscribeResponse);

    // Define DynamoDB params
    const dynamoParams = {
      TableName: 'blogSignupTable',
      Item: {
        userID: { S: emailId },  // Treat email as userID
        firstName: { S: firstName },
        lastName: { S: lastName },
        password: { S: password },  // Note: Store passwords securely (e.g., hashed)
        mobile: { S: mobile },
        createdAt: { S: new Date().toISOString() },
      },
    };

    // Store user data in DynamoDB
    await dynamoDBClient.send(new PutItemCommand(dynamoParams));

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User signup successful', userID: emailId }),
    };
  } catch (error) {
    console.error('Error signing up user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error signing up user', error: error.message }),
    };
  }
};