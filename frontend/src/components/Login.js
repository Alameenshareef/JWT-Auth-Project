import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../App'


const Login = () => {
    const [user, setUser] = useContext(UserContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await (await fetch('http://localhost:4000/login', {
            method: 'POST',
            credentials: 'include', // needed to include cookie
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })).json()

        if (result.accesstoken) {
            localStorage.setItem('accesstoken', result.accesstoken);
            setUser({
                accesstoken: result.accesstoken
            })
            setTimeout(() => {
                navigate('/');
            }, 100);


        } else {
            alert('Check the console')
            console.log(result.message);
        }

    }

    useEffect(() => {
        console.log(user);
    }, [user]);

    const handleChange = (e) => {
        if (e.currentTarget.name === 'email') {
            setEmail(e.currentTarget.value)
        } else {
            setPassword(e.currentTarget.value)
        }
    }
    return (
        <div className='login-wrapper'>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className='login-input'>
                    <input
                        value={email}
                        onChange={handleChange}
                        type='text'
                        name='email'
                        placeholder='Email'
                        autoComplete='email'
                    />
                    <input
                        value={password}
                        onChange={handleChange}
                        type='text'
                        name='password'
                        placeholder='Password'
                        autoComplete='current-password'
                    />
                    <button type='submit'>Login</button>
                </div>
            </form>

        </div>
    )
}

export default Login
