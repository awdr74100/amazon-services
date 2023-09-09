import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

export default eventHandler(async (event) => {
  const {
    AWS_S3_BUCKET,
    AWS_S3_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
  } = useRuntimeConfig();

  const s3Client = new S3Client({
    region: AWS_S3_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const multipartFormData = await readMultipartFormData(event);

    const urls = [];

    const result = await Promise.all(
      multipartFormData.map(({ name, filename, data, type }) => {
        const folder = name;
        const fileName = `${Date.now()}-${nanoid()}.${filename.split(".")[1]}`;
        const fileBuffer = data;
        const fileContentType = type;

        const url = `https://${AWS_S3_BUCKET}.s3.${AWS_S3_REGION}.amazonaws.com/${folder}/${fileName}`;
        urls.push(url);

        const command = new PutObjectCommand({
          Bucket: AWS_S3_BUCKET,
          Key: `${folder}/${fileName}`,
          Body: fileBuffer,
          ContentType: fileContentType,
          ACL: "public-read",
        });

        return s3Client.send(command);
      })
    );

    console.log(result);

    return { success: true, urls };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
});
