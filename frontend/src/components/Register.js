import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useContext(UserContext)


  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await (await fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })).json();

    if (result.accesstoken) {
      localStorage.setItem('accesstoken', result.accesstoken);
      setUser({
        accesstoken: result.accesstoken
      })

      navigate('/');


    } else {
      alert('Check the console')
      console.log('access token not found in expected format');
    }

  }


  useEffect(() => {
  }, [user]);

  const handleChange = e => {
    if (e.currentTarget.name === 'email') {
      setEmail(e.currentTarget.value);
    } else {
      setPassword(e.currentTarget.value);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit}>
        <div>Register</div>
        <div className="login-input">
          <input
            value={email}
            onChange={handleChange}
            type="text"
            name="email"
            placeholder="Email"
            autoComplete="email"
          />
          <input
            value={password}
            onChange={handleChange}
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
          />
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;