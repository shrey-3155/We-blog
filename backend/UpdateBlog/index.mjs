 // Import required AWS SDK clients and commands for Node.js using CommonJS syntax
 const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
 const { DynamoDBClient, GetItemCommand, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

 // Initialize S3 and DynamoDB Document Client
 const s3Client = new S3Client({ region: 'us-east-1' });
 const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

 const handler = async (event) => {
   try {
     // Destructure the event to get necessary fields
     const { PostID, UserID, Title, Content, ImageBase64, PDFBase64 } = event;
     console.log("PostID:", PostID);

     // Define S3 bucket name and keys for images and PDFs
     const bucketName = 'weblogtermassignmentbucket';
     const imageKey = `images/${PostID}.jpg`;
     const pdfKey = `pdfs/${PostID}.pdf`;

     // Check if PostID exists in DynamoDB
     const checkParams = {
       TableName: 'blogPostsTable',
       Key: {
         postID: { S: PostID },
       },
     };
     const { Item } = await dynamoDBClient.send(new GetItemCommand(checkParams));

     if (!Item) {
       return {
         statusCode: 404,
         body: JSON.stringify({ message: 'Post not found' }),
       };
     }

     // Initialize URLs with existing values or empty strings
     let imageURL = Item.imageURL?.S || '';
     let PDFURL = Item.PDFURL?.S || '';

     // Upload image to S3 if a new image is provided
     if (ImageBase64) {
       const imageBuffer = Buffer.from(ImageBase64, 'base64');
       const imageParams = {
         Bucket: bucketName,
         Key: imageKey,
         Body: imageBuffer,
         ContentType: 'image/jpeg',
       };
       await s3Client.send(new PutObjectCommand(imageParams));
       imageURL = `https://${bucketName}.s3.amazonaws.com/${imageKey}`;
     }

     // Upload PDF to S3 if a new PDF is provided
     if (PDFBase64) {
       const pdfBuffer = Buffer.from(PDFBase64, 'base64');
       const pdfParams = {
         Bucket: bucketName,
         Key: pdfKey,
         Body: pdfBuffer,
         ContentType: 'application/pdf',
       };
       await s3Client.send(new PutObjectCommand(pdfParams));
       PDFURL = `https://${bucketName}.s3.amazonaws.com/${pdfKey}`;
     }

     // Define DynamoDB params for updating the item
     const dynamoParams = {
       TableName: 'blogPostsTable',
       Key: {
         postID: { S: PostID.toString() },
       },
       UpdateExpression: 'SET userID = :userID, title = :title, content = :content, imageURL = :imageURL, PDFURL = :PDFURL, updatedAt = :updatedAt, sentiment = :sentiment',
       ExpressionAttributeValues: {
         ':userID': { S: UserID },
         ':title': { S: Title },
         ':content': { S: Content },
         ':imageURL': { S: imageURL },
         ':PDFURL': { S: PDFURL },
         ':updatedAt': { S: new Date().toISOString() },
         ':sentiment': { S: '' }, // Assuming sentiment is not provided in this context
       },
     };

     // Update the item in DynamoDB
     const res = await dynamoDBClient.send(new UpdateItemCommand(dynamoParams));
     console.log('Update response:', res);

     // Return success response
     return {
       statusCode: 200,
       body: JSON.stringify({ message: 'Post updated', PostID }),
     };
   } catch (error) {
     console.error('Error updating post:', error);
     return {
       statusCode: 500,
       body: JSON.stringify({ message: 'Error updating post', error: error.message }),
     };
   }
 };

 // Export the handler function using CommonJS syntax
 module.exports = { handler };