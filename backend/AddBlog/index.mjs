// Import required AWS SDK clients and commands for Node.js
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient, PutItemCommand,UpdateItemCommand,GetItemCommand,ScanCommand  } = require('@aws-sdk/client-dynamodb');
const { EventBridgeClient, PutEventsCommand } =require('@aws-sdk/client-eventbridge');

// Initialize S3 and DynamoDB Document Client
const s3Client = new S3Client({ region: 'us-east-1' });
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
const eventBridgeClient = new EventBridgeClient({ region: 'us-east-1' });

exports.handler = async (event) => {
  try {
    // Destructure the event to get necessary fields
    const { UserID, Title, Content, ImageBase64, PDFBase64 } = event;
    

    // Function to get the current maximum PostID
    const getMaxPostID = async () => {
      const params = {
        TableName: 'blogPostsTable',
        ProjectionExpression: 'postID',
      };

      const data = await dynamoDBClient.send(new ScanCommand(params));
      const postIDs = data.Items.map(item => parseInt(item.postID.S, 10));
      return postIDs.length ? Math.max(...postIDs) + 1 : 1;
    };

    // Get the next PostID by incrementing the current maximum
    const currentMaxPostID = await getMaxPostID();
    const PostID = currentMaxPostID + 1;

    console.log("Next PostID: ", PostID);

    // Define S3 bucket name and keys for images and PDFs
    const bucketName = 'weblogtermassignmentbucket';
    const imageKey = `images/${PostID}.jpg`;
    const pdfKey = `pdfs/${PostID}.pdf`;

    // Upload image to S3
    if (ImageBase64) {
      const imageBuffer = Buffer.from(ImageBase64, 'base64');
      const imageParams = {
        Bucket: bucketName,
        Key: imageKey,
        Body: imageBuffer,
        ContentType: 'image/jpeg',
      };
      await s3Client.send(new PutObjectCommand(imageParams));
    }

    // Upload PDF to S3
    if (PDFBase64) {
      const pdfBuffer = Buffer.from(PDFBase64, 'base64');
      const pdfParams = {
        Bucket: bucketName,
        Key: pdfKey,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
      };
      await s3Client.send(new PutObjectCommand(pdfParams));
    }

    // Define DynamoDB params
    const dynamoParams = {
      TableName: 'blogPostsTable',
      Item: {
        postID: { S: PostID.toString() }, 
        userID: { S: UserID },
        title: { S: Title },
        content: { S: Content },
        imageURL: { S: `https://${bucketName}.s3.amazonaws.com/${imageKey}` },
        PDFURL: { S: `https://${bucketName}.s3.amazonaws.com/${pdfKey}` },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() },
        sentiment: { S: '' },
      },
    };
    

    // Store metadata in DynamoDB
    const res = await dynamoDBClient.send(new PutItemCommand(dynamoParams));
    // Publish an event to EventBridge
    const eventBridgeParams = {
      Entries: [
        {
          Source: 'blogAppTest',
          DetailType: 'BlogPostCreatedTest',
          Detail: JSON.stringify({
            status: 'success',
            PostID,
            Title,
            UserID
          }),
          EventBusName: 'default',
        },
      ],
    };

    await eventBridgeClient.send(new PutEventsCommand(eventBridgeParams));

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Post created', PostID }),
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating post', error: error.message }),
    };
  }
};