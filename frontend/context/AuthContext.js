import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    const loginContext = () => setUserLoggedIn(true);
    const logoutContext = () => setUserLoggedIn(false);

    return (
        <AuthContext.Provider value={{ userLoggedIn, loginContext, logoutContext }}>
            {children}
        </AuthContext.Provider>
    );
};
