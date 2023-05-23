import React, { useState, useEffect, useContext } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import styled from "styled-components";
import InfoIcon from "@mui/icons-material/Info";
import CodeIcon from "@mui/icons-material/Code";
import SendIcon from "@mui/icons-material/Send";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ChatAxiosApi from "../../api/ChatAxiosApi";
import { ChatContext } from "../../context/ChatInfo";
import { UserContext } from "../../context/UserInfo";
import MainAxiosApi from "../../api/MainAxiosApi";
import ChatDrawer from "./ChatDrawer";
import CodeBlockItem from "./CodeBlockItem";
import CodeBlockInput from "./CodeBlockInput";
import ImageInput from "./ImageInput";
import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from "date-fns-tz";

const ChatRoomContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 600px;
  height: 80vh;
  background-color: #fff;
  border: 1px solid #eee;
  padding: 20px 20px 20px 20px;
  border-radius: 30px;
  margin-top: 30px;
  @media screen and (max-width: 768px) {
    width: 90%;
    margin-bottom: 25px;
  }
`;

const ChatUserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 0 10px 15px 10px;
  border-bottom: 1px solid #eee;
`;

const Nickname = styled.div`
  font-weight: bolder;
  font-size: 1.2em;
`;

const ChatViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  width: 100%;
  margin: 0 auto;
  padding: 10px;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  gap: 10px;
`;

const Message = styled.div`
  display: inline-block;
  max-width: 70%;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1em;
  line-height: 1.4;
  word-wrap: break-word;
`;

const OtherUserMessage = styled(Message)`
  align-self: flex-start;
  background-color: #e5e7ea;
  color: #000;
`;

const MeMessage = styled(Message)`
  align-self: flex-end;
  background-color: #3b74ec;
  color: #fff;
`;

const MessageInfoContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
  margin-left: 10px;
  margin-right: 10px;
`;

const SenderMessageInfoContainer = styled(MessageInfoContainer)`
  justify-content: flex-end;
`;

const IsRead = styled.div`
  font-size: 0.8em;
`;

const CreatedAt = styled.div`
  font-size: 0.8em;
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  gap: 3px;
`;

const MsgInput = styled.input`
  flex-grow: 1;
  border-radius: 15px;
  border: 1px solid #eee;
  padding: 0 10px;
  height: 50px;
`;

const CodeBlock = styled(CodeIcon)`
  cursor: pointer;
  color: #1e2b4d;
`;

const SendButton = styled(SendIcon)`
  cursor: pointer;
  color: #1e2b4d;
`;

const ImageButton = styled(PhotoCameraIcon)`
  cursor: pointer;
  color: #1e2b4d;
`;

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  // 🧡 이미지 첨부 관련 상태 정의
  const [showImageInput, setShowImageInput] = useState(false);
  // 🧡 PhotoCameraButton 버튼 클릭 -> 첨부창
  const handleImageButtonClick = () => {
    setShowImageInput(!showImageInput);
  };

  
  // 💙 코드 블럭 관련 상태 정의
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeBlockInput, setCodeBlockInput] = useState("");
  const [selectLanguage, setSelectLanguage] = useState("javascript");
  // 💙 CodeBlock 버튼 클릭 -> 입력창
  const handleCodeBlockButtonClick = () => {
    setShowCodeInput(!showCodeInput);
  };

  // ✅ Drawer 테스트
  const [drawerState, setDrawerState] = useState({ right: false });
  const toggleDrawer = (anchor, open) => e => {
    if(e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }
    setDrawerState({ ...drawerState, [anchor]: open});
  };

  const { chatRoom, chatMessages, setOtherUserPfImg, setOtherUserNickname, otherUserNickname, otherUserPfImg, setOtherUserNumber, otherUserNumber } = useContext(ChatContext);
  const { userNum } = useContext(UserContext);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const sock = new SockJS("http://localhost:8111/chat", null, {
      transports: ["websocket"],
      headers: {
        Origin: "http://localhost:3000",
      },
    });
    const newClient = new Client({
      webSocketFactory: () => sock,
      debug: (str) => {
        console.log(str);
      },
    });
    setClient(newClient);
  }, []);

  useEffect(() => {
    if (client) {
      const onConnect = () => {
        console.log("웹소켓..연결????");
      };
      const onError = (error) => {
        console.error("웹소켓 연결 실패.......하...");
      };

      client.onConnect = onConnect;
      client.onStompError = onError;

      client.activate();
    }
    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [client]);

  // ✅ 채팅방 회원 정보 가져오기
  useEffect(() => {
    const chatInfo = async (chatRoomNum) => {
      const response = await ChatAxiosApi.chatRoomInfo(chatRoomNum);
      setOtherUserNumber(response.data[0].mentor === userNum ? response.data[0].mentee : response.data[0].mentor);
    };
    chatInfo(chatRoom);
  }, [chatRoom, userNum, setOtherUserNumber]);

  // ✅ 채팅 메시지 정보 가져오기
  useEffect(() => {
    const chatMessages = async (chatRoomNum) => {
      const response = await ChatAxiosApi.chatMessages(chatRoomNum);
      const koreaTimeZone = 'Asia/Seoul';

      const messages = response.data.map(message => {
        const utcDate = parseISO(message.createdAt);
        const kstDate = utcToZonedTime(utcDate, koreaTimeZone);

        return {...message, createdAt: format(kstDate, 'HH:mm', { timeZone: koreaTimeZone })};
      });
      setMessages(messages);
      console.log("⏰ : " + messages[0].createdAt);
    };
    chatMessages(chatRoom);
  }, [chatRoom]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  // ✅ 채팅 상대 회원 번호
  const otherUserId = chatMessages.find(
    (message) => message.senderId !== userNum
  )?.senderId || chatMessages.find(
    (message) => message.receiverId !== userNum
  )?.receiverId;

  console.log("상대방 회원 번호 : " + otherUserId);
  
  // ✅ 채팅 상대 프로필 사진
  useEffect(() => {
    const userPfImgNum = async (memberNum) => {
      const response = await MainAxiosApi.userPfImgByNum(memberNum);
      setOtherUserPfImg(response.data);
    };
    userPfImgNum(otherUserNumber);
  },[setOtherUserPfImg, otherUserNumber]);

  // ✅ 채팅 상대 닉네임
  useEffect(() => {
    const userNicknameNum = async (memberNum) => {
      const response = await MainAxiosApi.userNicknameByNum(memberNum);
      setOtherUserNickname(response.data);
    };
    userNicknameNum(otherUserNumber);
  }, [setOtherUserNickname, otherUserNumber]);

  const handleSendMessage = async () => {
    if (inputMessage === "") {
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
      message: inputMessage,
      isRead: 'N',
      createdAt: createdAt
    };
  
    try {
      await ChatAxiosApi.sendChatMessage(
        chatRoom,
        userNum,
        otherUserNumber,
        inputMessage,
        "",
        0,
        utcNow.toISOString(),
        'Y',
        ""
      );
      setMessages([...messages, newMessage]);
      setInputMessage("");
    } catch (error) {
      console.log(error);
    }
  };  

  // 💙 코드 블럭 전송
  const handleSendCodeBlock = async () => {
    if (codeBlockInput === "") {
      return;
    }
    const codeBlockMessage = `\`\`\`${selectLanguage}\n${codeBlockInput}\n\`\`\``;

    const koreaTimeZone = 'Asia/Seoul';
    const utcNow = new Date();
    const kstNow = utcToZonedTime(utcNow, koreaTimeZone);
    const createdAt = format(kstNow, 'HH:mm', { timeZone: koreaTimeZone });

    const newMessage = {
      chatNumber: chatRoom,
      senderId: userNum,
      receiverId: otherUserNumber,
      codeBlock: codeBlockMessage,
      isRead: 'N',
      createdAt: createdAt
    };

    try {
      await ChatAxiosApi.sendChatMessage(
        chatRoom,
        userNum,
        otherUserNumber,
        "",
        codeBlockMessage,
        1,
        utcNow.toISOString(),
        'Y',
        ""
      );
      setMessages([...messages, newMessage]);
      setCodeBlockInput("");
    } catch (error) {
      console.log("코드 블럭 에러" + error);
    }

    setShowCodeInput(false);
  };

  // 💙 코드 메시지 렌더링
  const renderMessage = (msgType, message, codeMessage, imgMessage) => {
    if (codeMessage != null && message == null) { // 코드 블럭
      const codeBlockRegex = /^```(\w+)\n([\s\S]*)```$/;
      const parsedCodeBlock = codeMessage.match(codeBlockRegex);
      const language = parsedCodeBlock[1];
      const code = parsedCodeBlock[2];
      return <CodeBlockItem code={code} language={language} />;
    } else if (codeMessage == null && message == null && imgMessage != null) {
      return <img src={imgMessage} alt="imageUpload" style={{width:150, height:'auto'}} />
    }
    // 일반 메시지
    return message;
};

  return (
    <ChatRoomContainer>
      <ChatUserContainer>
        <img
          src={otherUserPfImg}
          alt="Profile"
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            border: "2px solid #c6def7",
          }}
        />
        <Nickname>{otherUserNickname}</Nickname>
        <InfoIcon 
          style={{ color: "4E5968" }}
          onClick={toggleDrawer("right", true)}
        />
      </ChatUserContainer>
      <ChatViewContainer>
        {messages && messages.map((m, index) => (
          <MessageContainer key={index}>
            {m.senderId === userNum ? (
              <>
                <MeMessage>{renderMessage(m.messageType, m.message, m.codeBlock, m.imgUrl)}</MeMessage>
                <SenderMessageInfoContainer>
                  <CreatedAt>{m.createdAt}</CreatedAt>
                  <IsRead>{m.isRead === "Y" ? "읽음" : "안읽음"}</IsRead>
                </SenderMessageInfoContainer>
              </>
            ) : (
              <>
                <OtherUserMessage>{renderMessage(m.messageType, m.message, m.codeBlock, m.imgUrl)}</OtherUserMessage>
                <MessageInfoContainer>
                  <CreatedAt>{m.createdAt}</CreatedAt>
                  <IsRead>{m.isRead ? "읽음" : "안읽음"}</IsRead>
                </MessageInfoContainer>
              </>
            )}
          </MessageContainer>
        ))}
      </ChatViewContainer>
      {showCodeInput && (
        <CodeBlockInput
          selectLanguage={selectLanguage}
          setSelectLanguage={setSelectLanguage}
          codeBlockInput={codeBlockInput}
          setCodeBlockInput={setCodeBlockInput}
          handleSendCodeBlock={handleSendCodeBlock}
          />
            )}
      {showImageInput && (
        <ImageInput
          setShowImageInput={setShowImageInput}
          chatRoom={chatRoom}
          userNum={userNum}
          otherUserNumber={otherUserNumber}
          setMessages={setMessages}
          messages={messages}  />
      )}
      <ChatInputContainer>
        <ImageButton
          sx={{ fontSize: "1.8rem" }}
          onClick={handleImageButtonClick} />
        <MsgInput
          type="search"
          placeholder="메시지를 입력하세요."
          value={inputMessage}
          onChange={handleInputChange}
        />
        <CodeBlock 
          sx={{ fontSize: "2rem" }}
          onClick={handleCodeBlockButtonClick}  />
        <SendButton 
          sx={{ fontSize: "1.5rem" }} 
          onClick={handleSendMessage} />
      </ChatInputContainer>
      <ChatDrawer drawerState={drawerState} toggleDrawer={toggleDrawer} />
    </ChatRoomContainer>
  );
};

export default ChatRoom;