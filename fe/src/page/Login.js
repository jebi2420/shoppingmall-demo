import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../action/userAction";
import { GoogleLogin } from '@react-oauth/google';

import "../style/login.style.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const error = useSelector((state) => state.user.error);

  // 에러 메시지 초기화
  useEffect(() => {
    // 컴포넌트가 언마운트될 때 에러 메시지 초기화
    return () => {
      dispatch(userActions.clearError());
    };
  }, [dispatch]);

  const handleChange = (event) => {
    event.preventDefault();
    // form 창에 변화 있을 시 에러메시지 초기화
    dispatch(userActions.clearError());
    // 값을 읽어서 FormData에 넣어주기
    const { id, value } = event.target;
    if(id === "email"){
      setEmail(value);
    }else{
      setPassword(value);
    }
  };

  const loginWithEmail = (event) => {
    event.preventDefault();
    //이메일,패스워드를 가지고 백엔드로 보내기
    dispatch(userActions.loginWithEmail({ email, password }));
  };

  const handleGoogleLogin = async (googleData) => {
    // 구글로 로그인 하기
    console.log("googleLogin:", googleData)
    dispatch(userActions.loginWithGoogle(googleData.credential));
  };

// user가 있으면 메인페이지로 돌아가기(이미 로그인한 유저는 로그인 페이지 못들어오게)
  if (user) {
    navigate("/");
  }
  return (
    <>
      <Container className="login-area">
        {error && (
          <div className="error-message">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}
        <Form className="login-form" onSubmit={loginWithEmail}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              id="email"
              required
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              id="password"
              required
              onChange={handleChange}
            />
          </Form.Group>
          <div className="display-space-between login-button-area">
            <Button variant="danger" type="submit">
              Login
            </Button>
            <div>
              아직 계정이 없으세요?<Link to="/register">회원가입 하기</Link>{" "}
            </div>
          </div>

          <div className="text-align-center mt-2">
            <p>-외부 계정으로 로그인하기-</p>
            <div className="display-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log('Login Failed');
              }}
            />
            </div>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Login;
