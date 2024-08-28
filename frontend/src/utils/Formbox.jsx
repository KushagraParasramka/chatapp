import React from 'react'
import "./Formbox.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Formbox = ({usernameBoxB = false, emailBoxB = false, fullnameBoxB = false, passwordBoxB = false, signup}) => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let response;
            if(signup){
                response = await fetch('http://localhost:8000/api/v1/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            }
            else {
                response = await fetch('http://localhost:8000/api/v1/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            }
            if (!response.ok) {
                throw new Error('failed');
            }
            if(!signup){
                const result = await response.json()
                const { accessToken, refreshToken } = result.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                console.log(result.data);
                localStorage.setItem('data',JSON.stringify(result.data.user));
                    navigate("/chat")
                }
            setFormData({
                username: '',
                email: '',
                fullName: '',
                password: ''
            })
        } catch (error) {
            setError(error.message);
            console.error(error)
        }
    }

    const usernameBox = (
        <input
        type='text'
        name='username'
        value={formData.username}
        onChange={handleChange}
        required
        placeholder='username'
        className='input-box'
        />
      );
      const fullnameBox = (
        <input
        type='text'
        name='fullName'
        value={formData.fullName}
        onChange={handleChange}
        required
        placeholder='fullname'
        className='input-box'
        />
      );
      const emailBox = (
        <input
        type='email'
        name='email'
        value={formData.email}
        onChange={handleChange}
        required
        placeholder='email'
        className='input-box'
        />
      );
      const passwordBox = (
        <input
        type='password'
        name='password'
        value={formData.password}
        onChange={handleChange}
        required
        placeholder='password'
        className='input-box'
        />
      );


  return (
    <div className="form-box">
        <form onSubmit={handleSubmit}>
        {usernameBoxB && usernameBox}
        {fullnameBoxB && fullnameBox}
        {emailBoxB && emailBox}
        {passwordBoxB && passwordBox}
        <button type='submit'> {signup ? "Signup" : "Login"} </button>
        </form>
    </div>
  )
}

export default Formbox
