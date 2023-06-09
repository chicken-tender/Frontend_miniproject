import React, { useState, useEffect, useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context/UserInfo';
import { Route, Routes } from "react-router-dom";
import styled from 'styled-components';
import MemberInformation from "./MemberInformation";
import MemberLatestPost from "./MemberLatestPost";
import MemberLatestReply from "./MemberLatestReply";
import MemberTotalPost from "./MemberTotalPost"
import MemberTotalReply from './MemberTotalReply';
import MemberEditInformation from './MemberEditInformation';


const ParentContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 5%;
  margin: 120px auto;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
    margin: 100px 0;
    align-items: center;
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 90%;
  gap: 30px;
  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;
const MemberInfoContainer = styled.div`
  width: 300px;
  @media screen and (max-width: 768px) {
  width: 90%;
}
  `;

const MyPage = () => {
  const navigate = useNavigate();
  const { userNum, isWithdrawn, isLogin, isLoading } = useContext(UserContext);
  const userMemberNum = userNum;

  // 회원정보 변경될 때마다 memberInfo 렌더링
  const [updateCounter, setUpdateCounter] = useState(0); 
  

  useEffect(() => {
    if (!isLoading && (!isLogin || !userNum || isWithdrawn ==='Y')) {
      navigate('/login', {replace: true});
    }
  }, [isLoading, isLogin, userNum, isWithdrawn, navigate]);

  return (
    <>
        <ParentContainer>
          <MemberInfoContainer>
            <MemberInformation userMemberNum={userMemberNum} updateCounter={updateCounter} />
          </MemberInfoContainer>
          <ColumnContainer>
            <Routes>
              <Route path="/" element={
                <>
                  <MemberLatestPost userMemberNum={userMemberNum} />
                  <MemberLatestReply userMemberNum={userMemberNum} />
                </>
              } />
              <Route path="mypost" element={<MemberTotalPost userMemberNum={userMemberNum} />} />
              <Route path="myreply" element={<MemberTotalReply userMemberNum={userMemberNum} />} />
              <Route path="edit" 
                element={<MemberEditInformation 
                userMemberNum={userMemberNum} 
                setUpdateCounter={setUpdateCounter} />} 
              />
            </Routes>
          </ColumnContainer>
        </ParentContainer>
    </>
  );
}

export default MyPage;
