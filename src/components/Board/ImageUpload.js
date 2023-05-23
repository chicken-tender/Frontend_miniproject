import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styled from 'styled-components';

const StyledFileInput = styled.div`
  display: inline-block;
  text-align: left;
  background: #fff;
  padding: 16px;
  width: 50%;
  position: relative;
  border-radius: 3px;
  margin-left: 245px;

  > input[type='file'] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 10;
    cursor: pointer;
  }

  > .button {
    display: inline-block;
    cursor: pointer;
    background: #eee;
    padding: 8px 16px;
    border-radius: 2px;
    margin-right: 8px;
  }

  &:hover > .button {
    background: dodgerblue;
    color: white;
  }

  > .label {
    color: #333;
    white-space: nowrap;
    opacity: .3;
  }

  &.chosen > .label {
    opacity: 1;
  }

  @media (max-width: 400px) {
    align-items: center;
    padding-left: 60px;
    margin-left: 0;
  }
`;

const ImageUpload = ({ onImageUpload }) => {
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState([]);

  const handleSelect = async (event) => {
    const imgUrl = event.target.files;
    setFileList(imgUrl);
    setFileName(Array.from(imgUrl).map((file) => file.name));

    const storage = getStorage();
    let urls = [];

    for (let i = 0; i < imgUrl.length; i++) {
      const imgRef = ref(storage, `gallery/${imgUrl[i].name}`);
      try {
        await uploadBytes(imgRef, imgUrl[i]);
        const url = await getDownloadURL(imgRef);
        urls.push(url); //업로드된 이미지의 URL을 urls 배열에 저장
      } catch (error) {
        console.error(`이미지 업로드 에러 :`, error);
      }
    }
    
    onImageUpload(urls.join(',')); // urls 배열을 문자열 형태로 전달
  };

  return (
    <StyledFileInput className={fileList.length > 0 ? 'chosen' : ''}>
      <input type='file' multiple onChange={handleSelect} />
      <span className='button'>Upload</span>
      <span className='label' data-js-label>
        {fileList.length > 0 ? fileName.join(', ') : 'No file selected'}
      </span>
    </StyledFileInput>
  );
};

export default ImageUpload;
