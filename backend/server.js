import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "kimLrLr",
  password: "비밀번호",
  database: "kimlrlr_test_db",
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("여기는 백엔드입니당");
});

app.listen(8800, () => {
  console.log("8800으로 연결했음!!");
});
