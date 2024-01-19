import React, { createContext, useContext, useState, useEffect } from 'react';

const Context = createContext();

export const StateContext = ({ children }) => {

    const [ pickedBot, setPickedBot ] = useState(undefined);
    const [ showInvestModal, setShowInvestModal ] = useState(false)
    const [ showWithdrawModal, setShowWithdrawModal ] = useState(false)
    const [ showBotStatsModal, setShowBotStatsModal ] = useState(false)

return(
    <Context.Provider
    value={{
        pickedBot, 
        setPickedBot,
        showInvestModal, 
        setShowInvestModal,
        showWithdrawModal, 
        setShowWithdrawModal,
        showBotStatsModal,
        setShowBotStatsModal
    }}
    >
      {children}
    </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);