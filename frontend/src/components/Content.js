import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../App'

const Content = () => {
  const [user, setUser] = useContext(UserContext)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      // Check if the access token exists in local storage
      const storedToken = localStorage.getItem('accesstoken');
      if (storedToken) {
        // If the user context doesn't have an access token, set it
        setUser({ accesstoken: storedToken });
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) {
    // Display a loading spinner or message while fetching user data
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, navigate to the login page
  if (!user.accesstoken) {
    return <Navigate from="" to='/login' noThrow />;
  }

  return (
    <div>
      this is the content
    </div>
  )
}

export default Content
