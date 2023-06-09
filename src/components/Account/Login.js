import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PopUp from "../../util/PopUp";
import { UserContext } from "../../context/UserInfo";
import Logo from "../Logo";
import TokenAxiosApi from "../../api/TokenAxiosApi";
import AccountPopUp from "../../util/AccountPopUp";

const StyledLoginField = styled.div`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0 auto;
    font-family: "Spoqa Han Sans Neo", "sans-serif";
  }
  a {
    color: #3b74ec;
  }
  a:hover {
    font-weight: bold;
  }
  .welcome_message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
    margin: 30px auto;
  }
  .welcome_message h1 {
    color: #191f28;
    font-size: 2rem;
    margin-top: -20px;
  }
  .welcome_message p {
    color: #4e5968;
    margin-top: -20px;
  }
  .input_container {
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
  }
  .input_field {
    width: 400px;
    border-radius: 10px;
  }
  .find_account {
    font-size: 0.9rem;
    position: relative;
    left: 140px;
    top: -40px;
  }
  .disable_button {
    width: 300px;
    border-radius: 20px;
    background-color: #eee;
  }
  .enable_button {
    width: 300px;
    border-radius: 20px;
    background-color: #3b74ec;
  }
  .disable_button {
    width: 300px;
    border-radius: 20px;
    background-color: #eee;
  }
  .join {
    display: flex;
    font-size: 0.9rem;
    margin-top: -50px;
  }
  @media screen and (max-width: 768px) {
    .input_field {
      width: 95%;
    }
    .find_account {
      font-size: 0.9rem;
      position: fixed;
      left: 290px;
      top: 490px;
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  // 🔥 Context API에 값을 저장
  const context = useContext(UserContext);
  const {setUserEmail, setUserPwd, setUserPfImgUrl, setUserNum, setUserNickname, setIsWithdrawn, isWithdrawn, setIsActive} = context;

  // 키보드 입력 받기
  const [inputEmail, setInputEmail] = useState("");
  const [inputPwd, setInputPwd] = useState("");

  // 유효성 검사
  const [isEmail, setIsEmail] = useState(false);
  const [isPwd, setIsPwd] = useState(false);

  // 로그인 실패시 팝업창
  const [PopUpOpen, setPopUpOpen] = useState(false);
  const closePopUp = () => {
    setPopUpOpen(false);
  };

  const [showPopup, setShowPopup] = useState(false);
  const [popUpMessage] = useState(false);

  const onClickLogin = async () => {
    try {
    const response = await TokenAxiosApi.getToken(inputEmail, inputPwd);
    if (response.status === 200) {
      localStorage.setItem('token', response.data);
      const token = localStorage.getItem('token');
      console.log("토큰 : " + token);

      const userInfoResponse = await TokenAxiosApi.userInfo(token);
      const userData = JSON.stringify(userInfoResponse, null, 2);
      const userDataObject = JSON.parse(userData);
      
      setUserEmail(userDataObject.data[0].email);
      setUserPwd(inputPwd);
      setUserPfImgUrl(userDataObject.data[0].pfImg);
      setUserNum(userDataObject.data[0].memberNum);
      setUserNickname(userDataObject.data[0].nickname);
      setIsWithdrawn(userDataObject.data[0].isWithdrawn);
      setIsActive(userDataObject.data[0].isActive);

      if (userDataObject.data[0].isWithdrawn === "Y") {
        localStorage.clear();
        setUserEmail(null);
        setUserPwd(null);
        setUserPfImgUrl(null);
        setUserNum(null);
        setUserNickname(null);
        setIsWithdrawn(null);
        setIsActive(null);
        navigate('/');
        return;
      } else if (userDataObject.data[0].isActive === "N") {
          localStorage.clear();
          setUserEmail(null);
          setUserPwd(null);
          setUserPfImgUrl(null);
          setUserNum(null);
          setUserNickname(null);
          setIsWithdrawn(null);
          setIsActive(null);
          navigate('/');
          return;
      }

      navigate("/");
    } else {
      console.log("로그인 에러");
      setPopUpOpen(true);
    }
  } catch (error) {
    console.error("요청은 했으나.. 오류 발생 😰", error);
    setPopUpOpen(true);
  }
};

  const onChangeEmail = (e) => {
    setInputEmail(e.target.value);
    setIsEmail(true);
  };

  const onChangePwd = (e) => {
    setInputPwd(e.target.value);
    setIsPwd(true);
  };

  return (
    <StyledLoginField>
      <div className="welcome_message">
        <Logo size="20rem"/>
        <h1>개발러스에 오신것을 환영합니다!</h1>
        <p>개발러스는 개발자들을 위한 정보공유 커뮤니티 입니다.</p>
      </div>
      <Box
        className="input_container"
        component="form"
        noValidate
        autoComplete="off"
      >
        <TextField
          className="input_field"
          name="email"
          type="text"
          label="이메일주소"
          value={inputEmail}
          onChange={onChangeEmail}
          placeholder="@를 포함한 이메일주소 입력"
          InputProps={{ sx: { borderRadius: 10 } }}
        />
        <TextField
          className="input_field"
          name="password"
          type="password"
          label="비밀번호"
          value={inputPwd}
          onChange={onChangePwd}
          placeholder="비밀번호 입력"
          InputProps={{ sx: { borderRadius: 10 } }}
        />
        <div className="find_account">
          <Link to="/findaccount">
            <p>계정 찾기</p>
          </Link>
        </div>
        <div>
          {isEmail && isPwd ? (
            <Button
              className={isEmail && isPwd ? "enable_button" : "disable_button"}
              type="button"
              onClick={onClickLogin}
              variant="contained"
              size="large"
            >
              로 그 인
            </Button>
          ) : (
            <Button
              className="disable_button"
              type="button"
              onClick={onClickLogin}
              variant="contained"
              size="large"
            >
              로 그 인
            </Button>
          )}
        </div>
        <PopUp open={PopUpOpen} close={closePopUp} type={false} header="오류">
          이메일과 비밀번호를 다시 확인해주세요. 🥹
        </PopUp>
        <div className="join">
          <p>계정이 없으신가요? </p>
          <Link to="/join">
            <p>회원가입</p>
          </Link>
        </div>
      </Box>
      <AccountPopUp
        open={showPopup}
        close={() => setShowPopup(false)}
        header="❗️오류"
        closeText="돌아가기"
      >
        {popUpMessage}
      </AccountPopUp>
    </StyledLoginField>
  );
};

export default Login;
