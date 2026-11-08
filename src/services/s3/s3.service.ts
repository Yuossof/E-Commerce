import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "../../config/s3"
import config from "../../config/env";


export class S3StorageService {
    async uploadImage(file: Express.Multer.File) {
        const key = `products/${crypto.randomUUID()}`

        await s3.send(
            new PutObjectCommand({
                Bucket: config.r2_bucket_name,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype
            })
        );

        return `${config.r2_public_url}/${key}`;

    }
}