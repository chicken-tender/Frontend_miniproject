import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import AccountAxiosApi from "../../api/AccountAxiosApi";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PopUp from "../../util/PopUp";
import { UserContext } from "../../context/UserInfo";
import Logo from "../Logo";
import MainAxiosApi from "../../api/MainAxiosApi";
import boardAxiosApi from "../../api/BoardAxiosApi";
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
  const {setUserEmail, setUserPwd, setUserPfImgUrl, setUserNum, setUserNickname, setIsWithdrawn} = context;

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
  const [popUpMessage, setPopUpMessage] = useState(false);

  const onClickLogin = async () => {
    try {
    const response = await AccountAxiosApi.loginMember(inputEmail, inputPwd);
    if (response.data === true) {
      // 🔥context에 저장
      setUserEmail(inputEmail);
      setUserPwd(inputPwd);

      // ❗️탈퇴 여부 가져오기
      const isWithdrawnResponse  = await AccountAxiosApi.isMemberWithdrawn(inputEmail);
      console.log("탈퇴 여부: "+ isWithdrawnResponse.data);
      if(isWithdrawnResponse.data === "Y") {
        setPopUpMessage("탈퇴한 회원입니다.");
        setShowPopup(true);
        return;
      }else {
        setIsWithdrawn(isWithdrawnResponse.data)
        console.log("탈퇴여부 컨텍스트: ", isWithdrawnResponse.data)
      }

      // ❗️활성화 여부 가져오기
      const isActiveResponse  = await AccountAxiosApi.isMemberActive(inputEmail);
      console.log("활성화 여부: "+ isActiveResponse.data);
      if(isActiveResponse.data === "N") {
        setPopUpMessage("이메일인증을 완료하세요.");
        setShowPopup(true);
        return;
      } 

      // 🐢 프로필 이미지 URL 가져오기
      const pfImgResponse = await MainAxiosApi.userPfImg(inputEmail);
      if (pfImgResponse.data) {
        setUserPfImgUrl(pfImgResponse.data);
      }

      // 🔥 회원번호 가져오기
      const numResponse = await boardAxiosApi.userNum(inputEmail);
      if (numResponse.data) {
        console.log(numResponse.data);
        setUserNum(numResponse.data);
      }

      // 🔥 닉네임 가져오기
      const nicknameResponse = await boardAxiosApi.userNickname(inputEmail);
      console.log(nicknameResponse.data);
      setUserNickname(nicknameResponse);


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
