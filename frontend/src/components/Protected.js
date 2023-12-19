import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../App'
const Protected = () => {
  const [user] = useContext(UserContext)
  const [content, setContent] = useState('you need to login')

  useEffect(() => {
    async function fetchProtected() {
      const accessToken = localStorage.getItem('accesstoken');
      const result = await (await fetch('http://localhost:4000/protected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`
        }
      })).json()
      if (result.data) {
        localStorage.setItem('Protectedaccesstoken', accessToken);
        setContent(result.data)
      }
    }
    fetchProtected()
  }, [user])
  return (
    <div>
      {content}
    </div>
  )
}

export default Protected
