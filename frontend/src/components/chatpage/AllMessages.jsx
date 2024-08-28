import React, {useEffect} from 'react'

const AllMessages = ({currentChatId,currentChatMessages, setCurrentChatMessages,socket}) => {

    useEffect(() => {
        socket.on("mesrec", (newMsgData) => {
            console.log("msg chatid", newMsgData)
            console.log("curr chatid", currentChatId)
            if (currentChatId === newMsgData.chatid) {
                setCurrentChatMessages([...currentChatMessages, newMsgData]);
            }
        })
    },[])

  return (
    <>
        {currentChatMessages?.map( (singleMessage) => {
            const sender = singleMessage.sender;
            const text = singleMessage.text;
            const id = singleMessage._id
            return (
                <div key={id}>
                    <div className='sender'>{sender}</div>
                    <div className='text'>{text}</div>
                </div>
            )
        }) || null}
    </>
  )
}

export default AllMessages
