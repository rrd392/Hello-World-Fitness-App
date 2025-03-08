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
    dob: new Date(),
    gender: "",
    height:"",
    weight:"",
    goal:"",
    membershipPlan:null
  });

  return (
    <SignupContext.Provider value={{ signupData, setSignupData }}>
      {children}
    </SignupContext.Provider>
  );
};
