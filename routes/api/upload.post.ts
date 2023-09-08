import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export default eventHandler(async (event) => {
  const config = useRuntimeConfig();

  const s3Client = new S3Client({
    region: config.AWS_S3_REGION,
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Bucket: config.AWS_S3_BUCKET, // The name of the bucket. For example, 'sample-bucket-101'.
    Key: "KEY", // The name of the object. For example, 'sample_upload.txt'.
    Body: "BODY", // The content of the object. For example, 'Hello world!".
  };

  try {
    const body = await readMultipartFormData(event);

    const folder = "images";
    const ext = body[0].filename.split(".")[1];
    const buffer = body[0].data;
    const name = `${Date.now()}-endgame.${ext}`;
    console.log(ext);

    const data = await s3Client.send(
      new PutObjectCommand({
        ACL: "public-read",
        Bucket: config.AWS_S3_BUCKET,
        Body: buffer,
        Key: `${folder}/${name}`,
      })
    );

    console.log(data);
    // console.log(body);
    const url = `https://${config.AWS_S3_BUCKET}.s3.${config.AWS_S3_REGION}.amazonaws.com/${folder}/${name}`;

    // https://ucct.s3.ap-east-1.amazonaws.com/images/1694201541436-endgame.jpg

    return { success: true, urls: [url] };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
});
