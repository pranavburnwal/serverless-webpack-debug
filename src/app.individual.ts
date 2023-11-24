import { SecretsManagerClient, CreateSecretCommand} from "@aws-sdk/client-secrets-manager";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {GetObjectCommand,S3Client} from '@aws-sdk/client-s3';
// import * as awsses from '@aws-sdk/client-ses';
import serverless from "serverless-http";
import express, { Request, Response } from "express";

const secretsManager = new SecretsManagerClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "ACCESS_KEY",
        secretAccessKey: "SECRET_ACCESS_KEY",
    },
});
const secretCommand = new CreateSecretCommand({
    Name: "TestSecretName",
    SecretString: "TestSecretString",
    Description: "This is a test secret",
});
const getCommand = new GetObjectCommand({
    Bucket: "BUCKET_NAME",
    Key: "key",
});
const s3Client = new S3Client({
    region: "REGION",
    credentials: {
        accessKeyId: "IAM_USER_KEY",
        secretAccessKey: "IAM_USER_SECRET"
    }
});
const signedUrl =  getSignedUrl(
    s3Client,
    getCommand,
    { expiresIn: 100000 });
    
// console.log(aws)
// console.log(awsPresigner)
// console.log(awss3)
// console.log(awsses)

const app = express();


app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World!" });
});

export default app;

// app.listen(3000, () => {
//     console.log('Server started on http://localhost:3000');
// });
export const handler = serverless(app);