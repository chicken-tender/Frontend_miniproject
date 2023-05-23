import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import styled from "styled-components";
import { Link } from "react-router-dom";
import EditPopUp from "../../util/EditPopUp";
import boardAxiosApi from "../../api/BoardAxiosApi";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right : 210px;
  padding: 30px;

  @media (max-width: 400px) {
    justify-content: center;
    margin-right: auto;
  }
`;

const EditButton = ({postNum}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popUpOpen, setPopUpOpen] = useState(false);

  const handleDeletePost = async () => {
    try {
      await boardAxiosApi.deletePost(postNum);
      setIsModalOpen(false);
      setPopUpOpen(true);
    } catch (error) {
      console.error("게시글 삭제 실패", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const closePopUp = () => {
    setPopUpOpen(false);
    navigate("/");
  }


  return (
    <>
    <Wrapper>
      <Stack spacing={3} direction="row">
        <Button variant="outlined" sx={{ width: '80px',  borderColor: "rgb(50, 70, 120)", color: "rgb(24, 31, 54)", "&:hover": {  borderColor: "rgb(70, 90, 140)",},}} component={Link} to={`/edit/${postNum}`}>수정</Button>
        <Button variant="contained" sx={{ width: '80px', backgroundColor: "rgb(40, 51, 90)","&:hover": {backgroundColor: "rgb(24, 31, 54)",}, }} onClick={() => setIsModalOpen(true)}>삭제</Button>
      </Stack>
    </Wrapper>
     <EditPopUp open={isModalOpen} confirm={handleDeletePost}close={handleCloseModal}type="confirm" header="알림">
          삭제된 게시글은 복구가 <span style={{color:"red", fontWeight:"bold"}}>불가능</span>합니다.<br /> 게시글을 삭제하시겠습니까?
     </EditPopUp>
     <EditPopUp open={popUpOpen} close={closePopUp} type="exit" header="삭제 완료">
          게시글이 삭제되었습니다! 😁
     </EditPopUp>
   </>
  );
};

export default EditButton;