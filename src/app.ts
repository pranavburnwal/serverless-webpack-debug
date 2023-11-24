import * as aws from "@aws-sdk/client-secrets-manager";
import * as awsPresigner from "@aws-sdk/s3-request-presigner";
import * as awss3 from '@aws-sdk/client-s3';
import * as awsses from '@aws-sdk/client-ses';
import serverless from "serverless-http";
import express, { Request, Response } from "express";

const secretsManager = new aws.SecretsManagerClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "ACCESS_KEY",
        secretAccessKey: "SECRET_ACCESS_KEY",
    },
});
const secretCommand = new aws.CreateSecretCommand({
    Name: "TestSecretName",
    SecretString: "TestSecretString",
    Description: "This is a test secret",
});
const getCommand = new awss3.GetObjectCommand({
    Bucket: "BUCKET_NAME",
    Key: "key",
});
const s3Client = new awss3.S3Client({
    region: "REGION",
    credentials: {
        accessKeyId: "IAM_USER_KEY",
        secretAccessKey: "IAM_USER_SECRET"
    }
});
const signedUrl =  awsPresigner.getSignedUrl(
    s3Client,
    getCommand,
    { expiresIn: 100000 });
    
console.log(aws)
console.log(awsPresigner)
console.log(awss3)
console.log(awsses)

const app = express();


app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World!" });
});

export default app;

// app.listen(3000, () => {
//     console.log('Server started on http://localhost:3000');
// });
export const handler = serverless(app);