//https://nitro.unjs.io/config
export default defineNitroConfig({
  runtimeConfig: {
    AWS_S3_BUCKET: "...",
    AWS_S3_REGION: "...",
    AWS_ACCESS_KEY_ID: "...",
    AWS_SECRET_ACCESS_KEY: "...",
  },
  preset: "aws-lambda",
});
