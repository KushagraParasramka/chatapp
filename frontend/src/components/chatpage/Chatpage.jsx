import React, {useState, useEffect, useRef} from 'react'
import "./Chatpage.css"
import Chatlist from './Chatlist.jsx';
import AllMessages from './AllMessages.jsx';
import TextInput from './TextInput.jsx';
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function Chatpage() {

    // all my variables
    const [chatData, setChatData] = useState([]);
    const [searchVal, setSearchVal] = useState("")
    const [searchResult, setSearchResult] = useState(null)
    const searchHandler = useRef(null);
    const userData = useRef(null);
    const [myid, setMyid] = useState(null);
    const [myusername, setMyusername] = useState(null);
    const [myemail, setMyemail] = useState(null);
    const [myfullname, setMyfullname] = useState(null);
    const [requestList, setRequestList] = useState([]);
    const [requestedbyList, setRequestedbyList] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [currentChatId, setCurrentChatId] = useState("")
    const [currentChatName, setCurrentChatName] = useState("")
    const [currentChatMessages, setCurrentChatMessages] = useState([])


    // functions to fetch data from server
    const getUserData = async () => {
        let accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No access token found. Please log in.');
        }
        const config = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        const response = await fetch('http://localhost:8000/api/v1/chats/allchats', config);
        const result = await response.json();
        console.log(result.data)
        setChatData(result.data)
    }

    const getSearchData = async () => {
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
            body: JSON.stringify({ val: searchVal })
        };
        const response = await fetch('http://localhost:8000/api/v1/chats/search', config);
        const result = await response.json();
        setSearchResult(result.data)
    }

    // functions to update the dom
    const handleChange = (e) => {
        const {name, value} = e.target
        if (name === "search") {
            clearTimeout(searchHandler.current);
            setSearchVal(value);
            searchHandler.current = setTimeout(() => {
                getSearchData();
            }, 1000);
        }


    }

    useEffect(() => {
        userData.current = JSON.parse(localStorage.getItem('data'));
        getUserData() // get the user's chat data for the user
        setMyid(userData.current._id)
        setMyusername(userData.current.username)
        setMyemail(userData.current.email)
        setMyfullname(userData.current.fullname)
        setRequestList(userData.current.requested)
        console.log(userData.current.requestedby)
        setRequestedbyList(userData.current.requestedby)
        setFriendList(userData.current.friends)

        socket.emit("join room", userData.current.username)

        return (
            () => {
                socket.emit("leave room", myusername)
            }
        )


    },[])

  return (
    <div className='chat-page'>
        <div className='first-col'>
            <div className='menu-box'></div>
            <div className='search-box'>
                <input
                    type='text'
                    name='search'
                    value={searchVal}
                    onChange={handleChange}
                    required
                    placeholder='search'
                    className='search-box'
                />
            </div>
            {myusername ? <Chatlist
            searchVal={searchVal}
            chatData={chatData}
            setChatData={setChatData}
            searchResult={searchResult}
            myusername={myusername}
            requestList={requestList}
            setRequestList={setRequestList}
            requestedbyList={requestedbyList}
            setRequestedbyList={setRequestedbyList}
            friendList={friendList}
            setFriendList={setFriendList}
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
            currentChatName={currentChatName}
            setCurrentChatName={setCurrentChatName}
            currentChatMessages={currentChatMessages}
            setCurrentChatMessages={setCurrentChatMessages}
            socket={socket}
            /> : null}
        </div>
        <div className='second-col'>
            <div className='chat-header-box'>{currentChatName}</div>
            <div className='allmessages-box'>
            {currentChatId ? <AllMessages
                    currentChatMessages={currentChatMessages}
                    setCurrentChatMessages={setCurrentChatMessages}
                    socket={socket}
                    currentChatId={currentChatId}
                /> : null }
            </div>
            {currentChatId ? <div className='message-typing-box'>
                <TextInput
                chatId={currentChatId}
                socket={socket}
                />
            </div> : null }
        </div>
    </div>
  )
}

export default Chatpage
