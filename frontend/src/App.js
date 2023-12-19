import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Register from "./components/Register";
import Protected from "./components/Protected";
import Content from "./components/Content";


export const UserContext = React.createContext([])
function App() {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const logOutCallback = async () => {
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('Protectedaccesstoken')
    await fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include'
    })
    // clear user from Context
    setUser({})
    // navigate back to startpage
    navigate('/');
  }

  // first thing, get a new accesstoken if a refreshtoken exist
  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (await fetch('http://localhost:4000/refresh_token', {
        method: 'POST',
        credentials: 'include', // Needed to include the cookie
        headers: {
          'Content-Type': 'application/json',
        }
      })).json()
      setUser({
        accesstoken: result.accesstoken
      })
      setLoading(false)
    }
    checkRefreshToken()
  }, [])

  if (loading) return <div>Loading....</div>

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="app">
        <Navigation logOutCallback={logOutCallback} />

        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="protected" element={<Protected />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Routes>

      </div>
    </UserContext.Provider>
  );
}

export default App;
