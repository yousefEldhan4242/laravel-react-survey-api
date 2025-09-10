import { createContext, useContext, useState } from "react";

const stateContext = createContext({
    currentUser:{},
    userToken:null,
    surveys: [],
    toast:{
      message:null,
      show:false,
    },
    isErrorToast:false,
    questionTypes: [],
    showToast : () => {},
    setCurrentUser : () => {},
    setUserToken: () => {},
    showErrorToast : () => {},
})



export const ContextProvider = ({children}) => {

    const [currentUser , setCurrentUser] = useState({})
    const [userToken , _setUserToken] = useState(localStorage.getItem("TOKEN") || '')

    const [questionTypes] = useState(['text', "select", "radio", "checkbox", "textarea"])
    const [toast ,setToast] = useState({message:"",show:false})
    const [isErrorToast,setIsErrorToast] = useState(false)


    const setUserToken = (token) => {
      if (token){
        localStorage.setItem("TOKEN",token)
      }else{
        localStorage.removeItem("TOKEN")
      }
      _setUserToken(token)
    }

    const showToast = (message) => {
      setToast({message,show:true})
      setTimeout(() => {
        setToast({message:"",show:false})
      },5000)
    }

    const showErrorToast = (message) => {
      setToast({message,show:true})
      setIsErrorToast(true)
      setTimeout(() => {
        setIsErrorToast(false)
        setToast({message:"",show:false})
      },5000)
    }


    return (
        <stateContext.Provider value={{ 
            currentUser,
            setCurrentUser,
            userToken,
            setUserToken,
            questionTypes,
            toast,
            showToast,
            isErrorToast,
            showErrorToast
         }}>
            {children}
        </stateContext.Provider>
    )
}


export const useStateContext = () => useContext(stateContext)