import { createContext, useContext, useState } from "react";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("sweets");

  return (
    <UIContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
