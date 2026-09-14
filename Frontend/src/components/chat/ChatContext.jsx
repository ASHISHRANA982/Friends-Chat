import {  createContext, useContext, useState } from "react";

const ChatContext=createContext(null);

export const ChatProvider=({children})=>{

  const[selectedContact,setSelectedContact]=useState(null)

return(
  <ChatContext.Provider
  
  value={{
    selectedContact,
    setSelectedContact
  }}

  >
  {children}
</ChatContext.Provider>
)

}

export const useChat = () => {
  return useContext(ChatContext);
};