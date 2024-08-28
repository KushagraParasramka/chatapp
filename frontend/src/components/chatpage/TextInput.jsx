import React, { useState,useEffect } from 'react';

const TextInput = ({ chatId, socket }) => {
    // Initialize the state with the chatId directly
    const [newText, setNewText] = useState("");



    const handleChange = (e) => {
        const { value } = e.target;
        setNewText(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            body: JSON.stringify({
                text: newText,
                chatid: chatId
            })
        };

        const response = await fetch('http://localhost:8000/api/v1/message/sendmessage', config);
        const result = await response.json();
        console.log(result.data);
        socket.emit("new message", result.data)
        setNewText("")
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    name='text'
                    value={newText}
                    onChange={handleChange}
                    required
                    placeholder='...'
                    className='search-box'
                />
                <button type='submit'>send</button>
            </form>
        </div>
    );
};

export default TextInput;
