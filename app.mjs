import express from "express";
import connectionPool from "./utils/db.mjs";
import questionsRouter from "./routers/questionsRouter.mjs";

const app = express();
const port = 4000;

app.use(express.json());
app.use("/questions", questionsRouter);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀 checkpoint");
});




app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
