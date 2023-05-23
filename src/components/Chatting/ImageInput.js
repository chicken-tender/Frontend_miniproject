import React, { useState, useRef } from "react";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import ChatAxiosApi from "../../api/ChatAxiosApi";
import { format } from 'date-fns';
import { utcToZonedTime } from "date-fns-tz";

const ImageInput = ({ setShowImageInput, chatRoom, userNum, otherUserNumber, setMessages, messages }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef();

  const handleUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      console.log("파일이 없습니다.");
      return;
    }

    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setImageUrl(url);
  };

  const handleSendImage = async () => {
    if (imageUrl === null) {
      return;
    }

    const koreaTimeZone = 'Asia/Seoul';
    const utcNow = new Date();
    const kstNow = utcToZonedTime(utcNow, koreaTimeZone);
    const createdAt = format(kstNow, 'HH:mm', { timeZone: koreaTimeZone });

    const newMessage = {
      chatNumber: chatRoom,
      senderId: userNum,
      receiverId: otherUserNumber,
      imgUrl: imageUrl,
      isRead: 'N',
      createdAt: createdAt
    };

    try {
      await ChatAxiosApi.sendChatMessage(
        chatRoom,
        userNum,
        otherUserNumber,
        "",
        "",
        2,
        utcNow.toISOString(),
        'Y',
        imageUrl
      );
      setMessages([...messages, newMessage]);
    } catch (error) {
      console.log("이미지 전송 에러 : " + error);
    }
    setShowImageInput(false);
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} />
      <button onClick={handleUpload}>미리보기</button>
      {imageUrl && <img src={imageUrl} alt="imageUpload" style={{ width: '100%', height: 'auto' }} />}
      <button onClick={handleSendImage}>전송</button>
    </div>
  );
}

export default ImageInput;

// {imageUrl && <img src={imageUrl} alt="imageUpload" />}