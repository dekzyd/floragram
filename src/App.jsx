import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import { Amplify, Auth } from "aws-amplify";
import awsExports from "./aws-exports";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@aws-amplify/ui-react/styles.css";

import SiteNav from "./components/common/SiteNav";
import SiteFooter from "./components/common/SiteFooter";
import HomePage from "./components/home/HomePage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ValidatePage from "./components/auth/ValidatePage";
import Contacts from "./components/contacts/Contacts";
import ProfilePage from "./pages/ProfilePage";

Amplify.configure(awsExports);

// set and get values from local storage
const isLoggedIn = localStorage.getItem("loggedIn") || false;

const setLocalStorage = (items) => {
  localStorage.setItem("loggedIn", items);
};

const removeLocalStorage = () => {
  localStorage.removeItem("loggedIn");
};

// check if someone is logged in using Auth
// const checkUser = async () => {
//   try {
//     const user = await Auth.currentUserInfo();
//     console.log(user);
//   } catch (error) {
//     console.log(error);
//   }
// };
// checkUser();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn);

  function updateAuthStatus(authStatus) {
    setIsAuthenticated(authStatus);
    setLocalStorage(authStatus);
  }

  console.log(isLoggedIn);

  return (
    <div>
      <SiteNav
        removeLocalStorage={removeLocalStorage}
        isAuthenticated={isAuthenticated}
        updateAuthStatus={updateAuthStatus}
      />
      <Routes>
        <Route
          path="*"
          element={<HomePage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/"
          exact={true}
          element={<HomePage isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/login"
          element={
            <LoginPage
              updateAuthStatus={updateAuthStatus}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/validate" element={<ValidatePage />} />
        <Route
          path="/contacts"
          element={<Contacts isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/profile"
          element={<ProfilePage isAuthenticated={isAuthenticated} />}
        />
      </Routes>
      <SiteFooter />
    </div>
  );
}

export default App;
