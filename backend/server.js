import express from "express";
import mysql from "mysql";
import cors from "cors";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "kimLrLr",
  password: "1180",
  database: "kimlrlr_test_db",
});

app.use(express.json());
app.use(cors());

let emailVerificationCode = {};

// Nodemailer 설정 (Gmail SMTP 사용)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kimlrlr9708@gmail.com", // 발신자 이메일 (Gmail 계정)
    pass: "tpew bkdy uqcb aeno", // Gmail 앱 비밀번호 또는 Gmail 계정 비밀번호
  },
});

// 인증번호 생성 함수
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 랜덤 숫자 생성
};

app.get("/", (req, res) => {
  res.json("여기는 백엔드입니당");
});

// 이메일 인증번호 전송 API
app.post("/send-email", (req, res) => {
  const { email } = req.body;
  console.log(`인증 요청한 이메일: ${email}`);

  if (!email) return res.status(400).json("이메일 필요함!");

  const verificationCode = generateCode();
  emailVerificationCode[email] = {
    code: verificationCode,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5분 후 만료
  };

  // 이메일 전송 설정
  const mailOptions = {
    from: "kimlrlr9708@gmail.com", // 발신자 이메일
    to: email, // 수신자 이메일
    subject: "메일 인증 코드",
    text: `인증 코드는 ${verificationCode} 입니다. 이 코드는 5분 동안 유효합니다.`,
  };

  // 이메일 전송
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json("이메일 발송 실패");
    } else {
      res.status(200).json("성공적으로 인증 코드를 발송했습니다.");
    }
  });
});

// 이메일 인증번호 검증 API
app.post("/verify-code", (req, res) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res.status(400).json("이메일 및 코드가 필요합니다.");

  const storedCode = emailVerificationCode[email];

  if (!storedCode) {
    return res.status(400).json("인증 코드를 찾을 수 없음");
  }

  if (storedCode.expiresAt < Date.now()) {
    return res.status(400).json("인증코드 만료");
  }

  if (storedCode.code !== code) {
    return res.status(400).json("유효하지 않은 인증 코드");
  }

  res.status(200).json("이메일이 성공적으로 인증되었습니다.");
});

// 회원가입 API
app.post("/register", async (req, res) => {
  const { email, name, affiliation, password } = req.body;

  // 입력된 정보가 유효한지 확인
  if (!email || !name || !affiliation || !password) {
    return res.status(400).json("모든 필드값 필수!!!");
  }

  try {
    // 비밀번호 암호화 처리
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 유저 정보 삽입 쿼리
    const q =
      "INSERT INTO usertb (email, name, affiliation, password) VALUES (?)";
    const values = [email, name, affiliation, hashedPassword];

    // MySQL에 유저 데이터 저장
    db.query(q, [values], (err, data) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json("이미 사용 중인 이메일입니다.");
        }
        return res.status(500).json(err);
      }
      return res.status(201).json("유저를 성공적으로 등록하였습니다.");
    });
  } catch (error) {
    return res.status(500).json("사용자 등록 오류");
  }
});

app.listen(8800, () => {
  console.log("8800으로 연결했음!!");
});
