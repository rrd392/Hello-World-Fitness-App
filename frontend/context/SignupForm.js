import React, { createContext, useState, useContext } from "react";

const SignupContext = createContext();

export const useSignup = () => useContext(SignupContext);

// Provider Component
export const SignupForm = ({ children }) => {
  const [signupData, setSignupData] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
    contact: "",
    address: "", 
    dob: "",
    gender: "",
  });

  return (
    <SignupContext.Provider value={{ signupData, setSignupData }}>
      {children}
    </SignupContext.Provider>
  );
};
