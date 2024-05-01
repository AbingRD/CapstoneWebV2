import React, { createContext, useState } from 'react';
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState('');
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [applications, setApplications] = useState([]);
    const [notifications, setNotifications] = useState([]);

    return (
        <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, userData, setUserData, listings, setListings, isLoading, setIsLoading, applications, setApplications, notifications, setNotifications }}>
            {children}
        </AppContext.Provider>
    );
};