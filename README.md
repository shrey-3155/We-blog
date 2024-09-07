# We Blog - Blogging Website

## 1. What Did I Build?

I have built a comprehensive blogging website named **We Blog**. The platform allows users to create, edit, delete, and view blog posts, including posts made by other users. Users can enhance their posts by uploading images and PDFs for a more engaging reading experience. The application is built using a modern technology stack and is cloud-deployed for scalability, reliability, and efficiency. The key technologies used include:
- **Frontend**: Angular (TypeScript)
- **Backend**: Node.js (Lambda Functions)
- **Database**: DynamoDB (NoSQL)

### Key Features

#### 1. User Authentication and Authorization
- **Sign-Up**: Users can register by providing a username, email, and password.
- **Login**: Registered users can log in to create and manage their blog posts.
- **Secure Access**: Only verified users can access the website. Routes in the frontend are protected, and secure API Gateway endpoints ensure only verified users can invoke Lambda functions.

#### 2. Blog Management
- **Create Blog Posts**: Users can create new blog posts, including titles, content, and uploading images/PDFs.
- **Edit Blog Posts**: Users can edit their blog posts to update or correct content.
- **Delete Blog Posts**: Users can delete their posts.
- **View Blog Posts**: All users can browse and read blog posts made by others.

---

## 2. Services Used

A range of AWS services were selected for development and deployment based on scalability, cost, and integration capabilities:

### **Compute: Amazon EC2 and AWS Lambda**
- **EC2**: Hosts the Angular frontend. Offers a scalable environment for delivering the user interface.
- **Lambda**: Used for serverless backend logic and API endpoints, reducing operational overhead with automatic scaling.

### **Storage: Amazon S3 and DynamoDB**
- **S3**: Stores images, PDFs, and Node.js modules for Lambda functions.
- **DynamoDB**: NoSQL database storing user and blog details.

### **Network: API Gateway**
- Serves as a middleware to manage and route requests between the frontend and backend, ensuring secure and efficient communication.

### **Messaging: SNS and EventBridge**
- **SNS**: Sends email notifications to users for blog posts and user sign-ups.
- **EventBridge**: Triggers Lambda functions for actions like notifying users when new blogs are posted.

---

## 3. Deployment Model

### **Hybrid Cloud**
This project follows a Hybrid Cloud deployment model, using both public and private cloud resources:
- **EC2**: Hosts the frontend and integrates with both public and private cloud services.
- **Lambda**: Handles backend logic and scales based on demand.
- **S3 and DynamoDB**: Store content and user data with flexible access.

---

## 4. Delivery Model

### **Software as a Service (SaaS)**
This application is delivered as a SaaS platform, allowing users to access the blog from any device via web browsers. All maintenance, updates, and scalability are centrally managed.

---

## 5. System Architecture

### **Cloud Architecture Overview**
1. **User Access**: Users access the Angular frontend hosted on EC2.
2. **API Gateway**: Routes requests to Lambda functions handling blog management and user authentication.
3. **Lambda Functions**: Handle various backend tasks such as user signup/login, blog CRUD operations, and triggering notifications.
4. **DynamoDB**: Stores user credentials, blog posts, and other metadata.
5. **S3**: Stores blog-related media (images/PDFs) and Node.js modules for Lambda functions.
6. **SNS and EventBridge**: Manage and send notifications for user activities like new blogs or user registrations.

---

## 6. Security

### **Data Security In Transit**
- **API Gateway**: Uses HTTPS and integrates with IAM and Cognito for secure authentication.
- **Lambda**: Uses encrypted environment variables for sensitive data like API keys.
- **Frontend**: Ensures HTTPS for secure communication between users and the server.

### **Data Security At Rest**
- **S3**: Implements server-side encryption and access control policies for bucket security.
- **DynamoDB**: Encrypts data at rest with AWS-managed keys and uses fine-grained access control.

---

## 7. Cost Metrics

Operating costs for the project have been carefully managed, with the following estimates:

### **Upfront Costs**
- **EC2**: Approx. $0.023 per hour for t3.small instances.
- **S3**: $0.023 per GB per month for storage.
- **DynamoDB**: Costs for read/write requests and storage are minimal.

### **Ongoing Costs**
- **Lambda**: Charged per request and compute time.
- **API Gateway**: Based on API calls and data transfer.
- **S3 and DynamoDB**: Charged for storage and data retrieval.

---

## 8. Conclusion

The **We Blog** platform is a modern, cloud-based blogging solution that leverages the power of AWS services for scalability, security, and efficiency. From user authentication to blog management, every aspect of the application is designed for a seamless user experience with secure data handling and optimal performance.

## 9. Architecture Diagram
- [We-Blog Cloud Architecture Diagram](Cloud-Architecture-Diagram.png)
