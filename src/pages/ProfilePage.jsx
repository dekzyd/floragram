import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// import { Auth } from "aws-amplify";

const ProfilePage = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    {
      // redirect to homepage if user isn't logged in
      !props.isAuthenticated && navigate("/");
    }
  }, []);

  return <div>Profile_page</div>;
};

export default ProfilePage;
