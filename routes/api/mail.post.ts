export default eventHandler(async (event) => {
  try {
    const body = await readBody<{ title: string; content: string }>(event);
    console.log(useRuntimeConfig());
    console.log(body);

    return { success: true };
  } catch (error) {
    return { success: false };
  }
});
