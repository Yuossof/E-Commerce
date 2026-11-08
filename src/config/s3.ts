import { S3Client } from "@aws-sdk/client-s3";
import config from "./env";

export const s3 = new S3Client({
    region: "auto",
    endpoint: config.s3Endpoint,
    credentials: {
        accessKeyId: config.r2_accessKeyId,
        secretAccessKey: config.r2_secretAccessKey
    }
})
