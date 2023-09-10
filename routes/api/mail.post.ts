import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export default eventHandler(async (event) => {
  const {
    AWS_SES_REGION,
    AWS_SES_SOURCE,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
  } = useRuntimeConfig();

  const sesClient = new SESClient({
    region: AWS_SES_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const body = await readBody<{
      email: string;
      title: string;
      content: string;
    }>(event);

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [body.email],
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: body.content,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: body.title,
        },
      },
      Source: AWS_SES_SOURCE, // Sandbox mode only allows emails to be sent from verified source
    });

    const result = await sesClient.send(command);

    console.log(result);

    return { success: true };
  } catch (error) {
    console.log(error);

    return { success: false };
  }
});
