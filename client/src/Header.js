import { useContext, useEffect , useState} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import logo from "./logo.png";

export default function Header(){
  const {setUserInfo , userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile' , {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      })
    })
  },[]);

    function logout() {
      fetch('http://localhost:4000/logout' , {
        credentials: 'include',
        method: 'POST',
      })
      setUserInfo(null);
    }

    const username  = userInfo?.username;

    
    return(
        <header>
        <div className="logo">
          <Link to="/" className="logo-pic">
          <img src={logo} alt="Logo" className="logo-image" />
          </Link>
          <Link to = "/" className="logo">SwimCoach</Link>
        </div>
        <nav>
          {username && (
            <>
            <span>Hi, <b>{username}</b></span>
              <Link to ="/create">Create new post</Link>
              <a onClick={logout}>Logout</a>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
    )
}