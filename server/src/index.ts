import { app } from "./start.js";

const PORT: number = 8080;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
