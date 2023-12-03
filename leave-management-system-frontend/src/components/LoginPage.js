import React, { useState } from "react";
import axios from "axios";
import { SnackbarProvider, useSnackbar } from "notistack";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AdminPage from "./AdminPage";
import "../styles/LoginPage.css";
import UserPage from "./Userpage";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isUserCreated, setIsUserCreated] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // New state to store user information

  const [createUsername, setCreateUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/user/login", {
        username,
        password,
      });

      if (response.data.status === "Login success") {
        // Redirect or perform actions upon successful login

        console.log("Login successful");
        setUserInfo(response.data.user);
        console.log("User infor after login: " + userInfo.user_name);
        setLoggedIn(true);
      } else {
        enqueueSnackbar(response.data.message, {
          variant: "error",
        });
      }
    } catch (error) {
      setError("An error occurred during authentication." + error);
    }
  };

  const handleCreateUser = async () => {
    if (
      createName == "" ||
      createUsername == "" ||
      createPassword == "" ||
      createEmail == ""
    ) {
      enqueueSnackbar("Fill all the fields");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/user/createUser",
          {
            createName,
            createUsername,
            createPassword,
            createEmail,
          }
        );

        if (response.data === "User Created") {
          setIsUserCreated(true);
          setCreateUsername("");
          setCreatePassword("");
          setCreateName("");
          setCreateEmail("");

          enqueueSnackbar("User created successfully! You can now login", {
            variant: "success",
          });
        } else {
          enqueueSnackbar(response.data, {
            variant: "success",
          });
        }
      } catch (error) {
        setError("An error occurred during authentication.");
      }
    }
  };

  return (
    <Router>
      {!isLoggedIn && (
        <div className="LoginPage">
          <div className="login-container">
            <h1>Login</h1>
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="action-button">
              <button onClick={handleLogin}>Login</button>
            </div>
          </div>
          <div className="login-container">
            <h1>Sign up</h1>
            <h3>New User? Create a new account by filling the details below</h3>
            <div>
              <label htmlFor="createName">Full Name</label>
              <input
                type="text"
                id="name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="createEmail">Email</label>
              <input
                type="text"
                id="createEmail"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="createUsername">Create Username</label>
              <input
                type="text"
                id="createUsername"
                value={createUsername}
                onChange={(e) => setCreateUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="createPassword">Create Password</label>
              <input
                type="password"
                id="createPassword"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
              />
            </div>
            <div className="action-button">
              <button onClick={handleCreateUser}>Create Account</button>
            </div>
          </div>
        </div>
      )}
      <div>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          {/* <Route path="/user" element={<UserPage props={userInfo} />} /> */}
          {/* Redirects based on the username */}
          {isLoggedIn && username === "admin" && (
            <Route path="/*" element={<Navigate to="/admin" />} />
          )}
          {/* {isLoggedIn && username && (
            <Route path="/*" element={<Navigate to="/user" />} />
          )} */}
        </Routes>
      </div>
    </Router>
  );
};

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      style={{ fontSize: "20px", fontFamily: "Arial" }}
    >
      <LoginPage />
    </SnackbarProvider>
  );
}
