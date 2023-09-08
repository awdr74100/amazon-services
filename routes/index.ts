export default eventHandler(async (event) => {
  return await useStorage("assets:server").getItem("index.html");
});
