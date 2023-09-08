export default eventHandler(async (event) => {
  const body = await readBody<{ title: string; content: string }>(event);

  console.log(body);

  return { message: "Hello World" };
});
