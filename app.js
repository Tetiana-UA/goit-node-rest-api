import "dotenv/config";

import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouters.js";
import authRouter from "./routes/authRouters.js";

import "./server.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

//слухаємо порт 3000 або зі змінної з сервера render, куди ми задеплоїдили
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running. Use our API on port: 3000");
});
