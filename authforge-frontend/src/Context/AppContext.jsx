import {createContext, useEffect, useState} from "react";
import {AppConstants} from "../Utils/constant.js";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export const AppContext = createContext();

axios.defaults.withCredentials = true; // global fix

export const AppContextProvider = (props) => {
    const backendUrl = AppConstants.BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const getUserData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/profile`);
            if (response.status === 200) {
                setUserData(response.data);
            } else {
                toast.error("Unable To Retrieve The Profile");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const sendVerificationOtp = async () => {
        try {
            const response = await axios.post(`${backendUrl}/send-otp`);
            if (response.status === 200) {
                navigate("/email-verify");
                toast.success("Verification OTP Sent To Your Email");
            } else {
                toast.error("Unable To Send OTP. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    const getAuthState = async () => {
        try {
            const response = await axios.get(`${backendUrl}/is-authenticated`);
            if (response.status === 200 && response.data === true) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const contextValue = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
        sendVerificationOtp,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};