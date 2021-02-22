import axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function EditUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { getLoggedIn } = useContext(AuthContext);
  const history = useHistory();

  async function register(e) {
    e.preventDefault();

    try {
      const registerData = {
        name,
        email
      };

      await axios.post("http://localhost:5000/auth/", registerData);
      // await axios.post(
      //   "https://mern-auth-template-tutorial.herokuapp.com/auth/",
      //   registerData
      // );
      await getLoggedIn();
      history.push("/");
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
