import React from 'react';
import styled from 'styled-components';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TextsmsIcon from '@mui/icons-material/Textsms';
import { Link } from 'react-router-dom';

const BoardItemContainer = styled(Link)`
  text-decoration: none;
  color : black;
  padding: 0 10px;
  &:hover {
    background-color: #eee;
    border-radius: 10px;
    cursor: pointer;
  }
`;

const BoardItem1 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8em;
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #696969;
  font-size: 0.8em;
`;

const ViewCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ReplyCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Title = styled.p`
  padding: 5px 0;
  margin: 0;
  font-weight: bolder;
`;

const WriteDate = styled.div`
  margin-left: 10px;
`;

const BoardItem = ({post}) => {
  const formatter = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });

  const getRelativeTime = () => {
    const currentDate = new Date();
    const postDate = new Date(post.writeDate);

    const seconds = Math.floor((currentDate - postDate) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return formatter.format(-days, "day");
    } else if (hours > 0) {
      return formatter.format(-hours, "hour");
    } else if (minutes > 0) {
      return formatter.format(-minutes, "minute");
    } else {
      return formatter.format(-seconds, "second");
    }
  };

  return (
    <BoardItemContainer to={`/post/${post.postNum}`}>
      <BoardItem1>
        <UserInfo>
          <img
            src={post.pfImg}
            alt='profileImage'
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              border: '1px solid #eeeeee'
            }}
          />
          {post.nickname}
          <WriteDate>‣ {getRelativeTime()}</WriteDate>
        </UserInfo>
        <PostInfo>
          <ViewCount>
            <VisibilityIcon sx={{ fontSize: "1rem" }} />
            <p>{post.viewCount}</p>
          </ViewCount>
          <ReplyCount>
            <TextsmsIcon sx={{ fontSize: "1rem" }} />
            <p>{post.commentCount}</p>
          </ReplyCount>
        </PostInfo>
      </BoardItem1>
      <Title>{post.title}</Title>
    </BoardItemContainer>
  );
};

export default BoardItem;