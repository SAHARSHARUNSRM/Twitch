import React, { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => { 
    const [userToken, setUserToken] = useState(false); 
    const[AccessToken,setAccessToken]=useState("");
    return (
        <UserContext.Provider value={{ userToken, setUserToken,setAccessToken,AccessToken}}> 
            {children}
        </UserContext.Provider>
    );
};


export { UserProvider, UserContext };
