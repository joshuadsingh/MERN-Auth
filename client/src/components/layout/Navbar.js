import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import LogOutBtn from "../auth/LogOutBtn";

function Navbar() {
  const { loggedIn, username, _id } = useContext(AuthContext);

  return (
    <div>
      <Link to="/">Home {loggedIn}</Link>
      {loggedIn === false && (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Log in</Link>
        </>
      )}
      {loggedIn === true && (
        <>
          <Link to="/customer">Customers</Link>
          <LogOutBtn />
          <Link to="/edit-user">{username}</Link>
        </>
      )}
    </div>
  );
}

export default Navbar;
