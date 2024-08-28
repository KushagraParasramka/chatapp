import React, { useEffect } from 'react';
import ChatBox from '../../utils/ChatBox.jsx';

const Chatlist = ({
  searchVal,
  chatData,
  setChatData,
  searchResult,
  myusername,
  requestList,
  setRequestList,
  requestedbyList,
  setRequestedbyList,
  friendList,
  setFriendList,
  currentChatId,
  setCurrentChatId,
  currentChatName,
  setCurrentChatName,
  currentChatMessages,
  setCurrentChatMessages,
  socket
}) => {

  const getSingleChat = async (chatId) => {
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found. Please log in.');
    }
    const config = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatId: chatId })
    };
    const response = await fetch('http://localhost:8000/api/v1/chats/chataccess', config);
    const result = await response.json();
    setCurrentChatId(result.data._id);
    setCurrentChatName(result.data.chatname);
    setCurrentChatMessages(result.data.messageids);
  };

  const handleClick = (id) => (e) => {
    console.log(id)
    getSingleChat(id);
  };

  const AcceptRequest = async (username) => {
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found. Please log in.');
    }
    const config = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accept: true, username: username })
    };
    const response = await fetch('http://localhost:8000/api/v1/chats/addfriend', config);
    const result = await response.json();
    console.log(result);
    socket.emit("sent friend", result.data);
  };

  const SendRequest = async (username) => {
    let accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found. Please log in.');
    }
    const config = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username })
    };
    const response = await fetch('http://localhost:8000/api/v1/chats/requestfriend', config);
    const result = await response.json();
    console.log(result);
    socket.emit("sent request", result.data);
  };

  const handleRequest = (username) => (e) => {
    e.preventDefault();
    SendRequest(username);
  };

  const handleAccept = (username) => (e) => {
    e.preventDefault();
    AcceptRequest(username);
  };

  useEffect(() => {
    socket.on("new req", (req) => {
      console.log(req.user);
      console.log(myusername);
      if (req.user === myusername) {
        setRequestList(prevRequestList => [...prevRequestList, req.otheruser]);
      } else {
        setRequestedbyList(prevRequestedbyList => [...prevRequestedbyList, req.user]);
      }
    });

    socket.on("new friend", (req) => {
        console.log(req)
      if (req.user === myusername) {
        setRequestedbyList(prevRequestedbyList => prevRequestedbyList.filter(data => data !== req.otheruser));
        setFriendList(prevFriendList => [...prevFriendList, req.otheruser]);
        req.newChat.chatname = req.otheruser
      } else {
        setRequestList(prevRequestList => prevRequestList.filter(data => data !== req.user));
        setFriendList(prevFriendList => [...prevFriendList, req.user]);
        req.newChat.chatname = req.user
      }
      setChatData(prevChatData => [...prevChatData, req.newChat]);
    });

    return () => {
      socket.off("new req");
      socket.off("new friend");
    };
  }, [myusername, socket, setChatData, setFriendList, setRequestList, setRequestedbyList]);

  return (
    <div className='chat-list'>
      {searchVal === "" ? (
        chatData?.map((singleChat) => {
          const chatName = singleChat.chatname;
          const messageCount = singleChat.messageCount;
          const id = singleChat._id;
          console.log(id)
          return (
            <ChatBox
              chatName={chatName}
              messageCount={messageCount}
              key={id}
              id={id}
              handleClick={handleClick}
            />
          );
        }) || null
      ) : (
        searchResult?.map((singleUser) => {
          const userName = singleUser.username;
          if (userName === myusername) {
            return null;
          }
          if (requestList.includes(userName)) {
            return (
              <div key={userName}>
                <div className='af-s-username'>{userName}</div>
                already requested
              </div>
            );
          }
          if (requestedbyList.includes(userName)) {
            return (
              <div key={userName}>
                <div className='af-s-username'>{userName}</div>
                <div className='request-btn' onClick={handleAccept(userName)}>Accept</div>
              </div>
            );
          }
          if (friendList.includes(userName)) {
            return (
              <div key={userName}>
                <div className='af-s-username'>{userName}</div>
              </div>
            );
          }
          return (
            <div key={userName}>
              <div className='af-s-username'>{userName}</div>
              <div className='request-btn' onClick={handleRequest(userName)}>Request</div>
            </div>
          );
        }) || null
      )}
    </div>
  );
};

export default Chatlist;
