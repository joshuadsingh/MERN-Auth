import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function EditUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { getLoggedIn, _id } = useContext(AuthContext);
  // const history = useHistory();

  useEffect(() => {
    async function getUserData(){
      const userData = await axios.get(`http://localhost:5000/auth/user/${_id}`);
      setName(userData.data.name);
      setEmail(userData.data.email);
    }
    getUserData();
  }, [_id]);

  async function register(e) {
    e.preventDefault();

    try {
      const editData = {
        name, 
        email,
        _id
      };

      await axios.put(`http://localhost:5000/auth/user/${_id}`, editData);
      // await axios.post(
      //   "https://mern-auth-template-tutorial.herokuapp.com/auth/",
      //   registerData
      // );
      await getLoggedIn();
      // history.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Update existing account</h1>
      <form onSubmit={register}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditUser;
