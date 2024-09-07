// Import required AWS SDK clients and commands for Node.js
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const snsClient = new SNSClient({ region: 'us-east-1' });
const snsTopicArn = process.env.BLOG_NOTIFICATION_TOPIC_ARN; // Replace with your SNS topic ARN

module.exports.handler = async (event) => {
  try {
    // Extract post details from the event
    const { PostID, Title, UserID } = event.detail;

    // Construct the message
    const message = `A new blog post titled "${Title}" has been published by ${UserID}. Check it out!`;

    // Prepare SNS message parameters
    const snsParams = {
      TopicArn: snsTopicArn,
      Message: message,
      Subject: 'New Blog Post Alert!',
    };

    // Publish message to SNS
    await snsClient.send(new PublishCommand(snsParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending notification', error: error.message }),
    };
  }
};