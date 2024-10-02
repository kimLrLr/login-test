import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const Join = () => {
  // State 설정
  const [email, setEmail] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formValid, setFormValid] = useState(false);

  const navigate = useNavigate();

  // 인증버튼 클릭 시 이메일로 인증번호 전송
  const sendEmailHandler = async () => {
    try {
      const response = await fetch("http://localhost:8800/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setTimer(300); // 5분 타이머 시작
        setEmailVerified(false); // 이메일 인증 초기화
        console.log("인증번호가 전송되었습니다.");
      } else {
        console.error("인증번호 전송 실패");
      }
    } catch (error) {
      console.error("서버 오류:", error);
    }
  };

  // 이메일 인증 코드 검증
  const verifyEmailHandler = async () => {
    try {
      const response = await fetch("http://localhost:8800/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: inputCode }),
      });
      if (response.ok) {
        setEmailVerified(true);
        console.log("이메일 인증 성공");
      } else {
        console.error("인증 실패");
      }
    } catch (error) {
      console.error("서버 오류:", error);
    }
  };

  // 타이머 설정
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  // 필드 값 검증 및 회원가입 버튼 활성화 조건
  useEffect(() => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (
      emailVerified &&
      name.trim() !== "" &&
      affiliation.trim() !== "" &&
      passwordRegex.test(password) &&
      password === confirmPassword
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [emailVerified, name, affiliation, password, confirmPassword]);

  // 회원가입 처리
  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8800/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, affiliation, password }),
      });
      if (response.ok) {
        console.log("회원가입 성공");
        navigate("/login");
      } else {
        const result = await response.json();
        console.error("회원가입 실패:", result);
      }
    } catch (error) {
      console.error("서버 오류:", error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center">회원가입</h2>
          <Form onSubmit={registerHandler}>
            {/* 이메일 입력 및 인증 */}
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>이메일</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="email"
                  placeholder="이메일 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={emailVerified}
                />
                <Button
                  variant="outline-primary"
                  onClick={sendEmailHandler}
                  disabled={emailVerified || !email}
                >
                  {emailVerified ? "확인됨" : "인증"}
                </Button>
              </div>
              {timer > 0 && (
                <small className="text-muted">
                  {Math.floor(timer / 60)}:{timer % 60}
                </small>
              )}
            </Form.Group>

            {/* 이메일 인증 코드 입력 */}
            <Form.Group controlId="formBasicEmailCode" className="mb-3">
              <Form.Label>이메일 인증 번호</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="인증번호 입력"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  disabled={emailVerified || timer <= 0}
                />
                <Button
                  variant={emailVerified ? "success" : "outline-primary"}
                  onClick={verifyEmailHandler}
                  disabled={emailVerified || timer <= 0}
                >
                  {emailVerified ? "인증됨" : "확인"}
                </Button>
              </div>
              {emailVerified && (
                <Alert variant="success">이메일이 인증되었습니다.</Alert>
              )}
            </Form.Group>

            {/* 이름 입력 */}
            <Form.Group controlId="formBasicName" className="mb-3">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                placeholder="이름을 입력하세요."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            {/* 소속 입력 */}
            <Form.Group controlId="formBasicAffiliation" className="mb-3">
              <Form.Label>소속</Form.Label>
              <Form.Control
                type="text"
                placeholder="소속을 입력하세요."
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
              />
            </Form.Group>

            {/* 비밀번호 입력 */}
            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Text className="text-muted">
                특수문자, 영문자를 포함하여 8자 이상의 비밀번호를 작성해주세요.
              </Form.Text>
            </Form.Group>

            {/* 비밀번호 확인 */}
            <Form.Group controlId="formBasicConfirmPassword" className="mb-3">
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호 재입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {password !== confirmPassword && confirmPassword.length > 0 && (
                <Alert variant="danger">비밀번호가 일치하지 않습니다.</Alert>
              )}
            </Form.Group>

            {/* 회원가입 버튼 */}
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={!formValid}
            >
              회원가입
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
