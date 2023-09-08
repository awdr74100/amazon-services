export default eventHandler(async (event) => {
  try {
    const body = await readMultipartFormData(event);

    console.log(body);

    return { success: true };
  } catch (error) {
    return { success: false };
  }
});
