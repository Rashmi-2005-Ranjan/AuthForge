import {Link, useNavigate} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../Context/AppContext.jsx";
import {toast} from "react-toastify";
import axios from "axios";
import {Lock, ArrowRight, Mail} from "lucide-react";

const EmailVerify = () => {
    const inputRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const {backendUrl, userData, isLoggedIn, getUserData, sendVerificationOtp} = useContext(AppContext)
    const navigate = useNavigate();


    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/, ""); // Allow only digits
        e.target.value = value;
        if (value && index < 5) {
            inputRef.current[index + 1].focus();
        }
    }
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputRef.current[index - 1].focus();
        }
    }

    const handleVerify = async () => {
        const otp = inputRef.current.map(input => input.value)
            .join("");
        setLoading(true);
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
        }
        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/verify-otp`, {otp});
            if (response.status === 200) {
                toast.success("Email Verified Successfully");
                getUserData();
                navigate("/");
            } else {
                toast.error("Invalid OTP. Please try again.");
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
        pasteData.forEach((char, index) => {
            if (inputRef.current[index]) {
                inputRef.current[index].value = char;
            }
        });
        const next = pasteData.length < 6 ? pasteData.length : 5;
        inputRef.current[next].focus();
    }

    useEffect(() => {
        isLoggedIn && userData && userData.isAccountVerified && navigate("/");
    }, [isLoggedIn, userData]);

    return (
        <div
            className="d-flex align-items-center justify-content-center min-vh-100 position-relative"
            style={{
                background: "linear-gradient(135deg, #1a1f3a 0%, #2d3561 50%, #1f2a45 100%)",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Background decoration */}
            <div
                style={{
                    position: "absolute",
                    top: "-30%",
                    right: "-20%",
                    width: "500px",
                    height: "500px",
                    background: "radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)",
                    borderRadius: "50%"
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-40%",
                    left: "-10%",
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)",
                    borderRadius: "50%"
                }}
            />

            {/* Logo */}
            <Link
                to="/"
                className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
                style={{zIndex: 10}}
            >
                <div
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "8px",
                        padding: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Lock size={20} color="white" />
                </div>
                <span
                    className="fs-5 fw-semibold"
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}
                >
                    AuthForge
                </span>
            </Link>

            {/* Card */}
            <div
                className="p-5 rounded-4 shadow-lg"
                style={{
                    width: "480px",
                    background: "linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(45, 53, 97, 0.8) 100%)",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    position: "absolute",
                    zIndex: 5,
                    backdropFilter: "blur(10px)",
                    margin: "20px"
                }}
            >
                {/* Icon */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "12px",
                        padding: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
                    }}
                    className="d-flex"
                >
                    <Mail size={24} color="white" />
                </div>

                <h4
                    className="text-center fw-bold mb-2"
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontSize: "24px"
                    }}
                >
                    Email Verification
                </h4>
                <p
                    className="text-center mb-4"
                    style={{
                        color: "#cbd5e1",
                        fontSize: "14px",
                        lineHeight: "1.6"
                    }}
                >
                    Enter the 6-digit code sent to your email
                </p>

                {/* OTP Inputs */}
                <div className="d-flex justify-content-between gap-2 mb-4">
                    {[...Array(6)].map((_, index) => (
                        <input
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            key={index}
                            type="text"
                            maxLength={1}
                            style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "12px",
                                border: "1px solid rgba(102, 126, 234, 0.3)",
                                background: "rgba(102, 126, 234, 0.1)",
                                textAlign: "center",
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: "#e0e7ff",
                                transition: "all 0.3s ease",
                                outline: "none",
                                boxSizing: "border-box"
                            }}
                            onFocus={(e) => {
                                e.target.style.background = "rgba(102, 126, 234, 0.15)";
                                e.target.style.borderColor = "rgba(102, 126, 234, 0.6)";
                                e.target.style.boxShadow = "0 0 12px rgba(102, 126, 234, 0.3)";
                            }}
                            onBlur={(e) => {
                                e.target.style.background = "rgba(102, 126, 234, 0.1)";
                                e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                                e.target.style.boxShadow = "none";
                            }}
                            ref={(el) => (inputRef.current[index] = el)}
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        opacity: loading ? 0.7 : 1,
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)"
                    }}
                    disabled={loading}
                    onClick={handleVerify}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.6)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) {
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.4)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }
                    }}
                >
                    {loading ? "Verifying..." : "Verify Email"}
                    {!loading && <ArrowRight size={18} />}
                </button>

                {/* Resend Option */}
                <p
                    className="text-center mt-4 mb-0"
                    style={{color: "#cbd5e1", fontSize: "14px"}}
                >
                    Didn't receive the code?{" "}
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            color: "#667eea",
                            fontWeight: "600",
                            cursor: "pointer",
                            padding: 0,
                            transition: "all 0.2s ease",
                            textDecoration: "none",
                            fontSize: "14px"
                        }}
                        onClick={sendVerificationOtp}
                        onMouseEnter={(e) => e.currentTarget.style.color = "#764ba2"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#667eea"}
                    >
                        Resend OTP
                    </button>
                </p>
            </div>

            <style>{`
                input::placeholder {
                    color: rgba(203, 213, 225, 0.6) !important;
                }
            `}</style>
        </div>
    );
};

export default EmailVerify;