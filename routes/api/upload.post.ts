export default eventHandler(async (event) => {
  const body = await readMultipartFormData(event);

  console.log(body);

  return { message: "Hello World" };
});
