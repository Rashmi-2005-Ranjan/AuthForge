import {assets} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../Context/AppContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";
import {ChevronDown, LogOut, Shield} from "lucide-react";

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
        <nav
            className="navbar px-6 py-4 d-flex justify-content-between align-items-center shadow-sm"
            style={{
                background: "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
            }}
        >
            {/* Logo Section */}
            <div className="d-flex align-items-center gap-3" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                <div
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "12px",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft:"10px"
                    }}
                >
                    <Shield size={28} color="white" />
                </div>
                <span
                    className="fw-bold"
                    style={{
                        fontSize: "20px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    AuthForge
                </span>
            </div>

            {/* User Section */}
            {
                userData ? (
                    <div className="position-relative" ref={dropDownRef}>
                        <div
                            className="d-flex align-items-center gap-2"
                            style={{
                                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)",
                                border: "1px solid rgba(102, 126, 234, 0.3)",
                                borderRadius: "50px",
                                padding: "6px 12px 6px 6px",
                                cursor: "pointer",
                                userSelect: "none",
                                transition: "all 0.3s ease"
                            }}
                            onClick={() => setDropDownOpen((prev) => !prev)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)";
                            }}
                            onMouseLeave={(e) => {
                                if (!dropDownOpen) {
                                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)";
                                }
                            }}
                        >
                            <div
                                style={{
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                {userData.name[0].toUpperCase()}
                            </div>
                            <span style={{ color: "#e0e7ff", fontSize: "14px", fontWeight: "500" }}>
                                {userData.name}
                            </span>
                            <ChevronDown
                                size={18}
                                color="#667eea"
                                style={{
                                    transition: "transform 0.3s ease",
                                    transform: dropDownOpen ? "rotate(180deg)" : "rotate(0deg)"
                                }}
                            />
                        </div>
                        {
                            dropDownOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "50px",
                                        right: 0,
                                        zIndex: 100,
                                        background: "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)",
                                        border: "1px solid rgba(102, 126, 234, 0.3)",
                                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                                        minWidth: "200px",
                                        borderRadius: "12px",
                                        overflow: "hidden"
                                    }}
                                >
                                    {!userData.isAccountVerified && (
                                        <div
                                            style={{
                                                cursor: "pointer",
                                                padding: "10px 12px",
                                                color: "#fbbf24",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                transition: "all 0.2s ease",
                                                borderBottom: "1px solid rgba(102, 126, 234, 0.2)"
                                            }}
                                            onClick={sendVerificationOtp}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "rgba(251, 191, 36, 0.1)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "transparent";
                                            }}
                                        >
                                            <Shield size={16} />
                                            Verify Email
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            cursor: "pointer",
                                            padding: "10px 12px",
                                            color: "#ef4444",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            transition: "all 0.2s ease"
                                        }}
                                        onClick={handleLogout}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "transparent";
                                        }}
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </div>
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <button
                        style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "50px",
                            padding: "10px 24px",
                            fontWeight: "600",
                            fontSize: "14px",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                            cursor: "pointer",
                            marginRight: "10px"
                        }}
                        onClick={() => navigate('/login')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        Login →
                    </button>
                )
            }

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </nav>
    )
}
export default Menubar;