import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const Board = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px 30px;
  min-height: 390px;
  max-height: 800px;
  overflow-y: auto; 
`;

const StyledImg = styled.img`
  max-width: 45%;
  height: auto;
  margin-top: 1.5rem;
  border-radius: 5px;

  @media (max-width: 480px) {
    min-width: 100%;
  }
`;


const Content = ({ content, imgUrl }) => {
  const urls = imgUrl ? imgUrl.split(',') : [];

  return content && (
    <Wrapper>
      <Board>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {urls.length > 0 && urls.map((url, index) => (
          <StyledImg key={index} src={url} alt={`첨부 이미지 ${index + 1}`} />
        ))}
      </Board>
    </Wrapper>
  );
};

export default Content;
