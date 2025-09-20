import {assets} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../Context/AppContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";

const Menubar = () => {
    const navigate = useNavigate();
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const dropDownRef = useRef(null);
    const {userData, backendUrl, setIsLoggedIn, setUserData, sendVerificationOtp} = useContext(AppContext);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setDropDownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${backendUrl}/logout`)
            if (response.status === 200) {
                setIsLoggedIn(false);
                setUserData(null);
                navigate("/");
                toast.warn("Logged Out Successfully");
            }
        } catch (e) {
            toast.error(e.response.data.message);
        }
    }
    return (
        <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
                <img src={assets.logo_home} alt="logo" width={52} height={52}/>
                <span className="fw-bold fs-4 text-dark">AuthForge</span>
            </div>
            {
                userData ? (
                    <div className="position-relative" ref={dropDownRef}>
                        <div
                            className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
                            style={{
                                width: "40px",
                                height: "40px",
                                cursor: "pointer",
                                userSelect: "none",
                            }}
                            onClick={() => setDropDownOpen((prev) => !prev)}
                        >
                            {userData.name[0].toUpperCase()}
                        </div>
                        {
                            dropDownOpen && (
                                <div className="position-absolute bg-white rounded p-2"
                                     style={{
                                         top: "50px",
                                         right: 0,
                                         zIndex: 100,
                                     }}
                                >
                                    {!userData.isAccountVerified && (
                                        <div className="dropdown-item py-1 px-2" style={{cursor: "pointer"}} onClick={sendVerificationOtp}>
                                            Verify Email
                                        </div>
                                    )}
                                    <div className="dropdown-item py-1 px-2 text-danger" style={{cursor: "pointer"}}
                                         onClick={handleLogout}>
                                        Logout
                                    </div>
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <div className="btn btn-outline-dark rounded-pill px-3" onClick={() => navigate('/login')}>
                        Login <i className="bi bi-arrow-right ms-2"/>
                    </div>
                )
            }
        </nav>
    )
}
export default Menubar;