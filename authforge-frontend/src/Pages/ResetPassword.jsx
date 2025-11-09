import {Link, useNavigate} from "react-router-dom";
import {useContext, useRef, useState} from "react";
import {AppContext} from "../Context/AppContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";
import {Lock, Mail, ArrowRight, Eye, EyeOff} from "lucide-react";

const ResetPassword = () => {
    const inputRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const {backendUrl} = useContext(AppContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

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

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(backendUrl + "/send-reset-otp?email=" + email);
            if (response.status === 200) {
                toast.success("OTP Sent To Your Email");
                setIsEmailSent(true);
            } else {
                toast.error("Unable To Send OTP. Please try again.");
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }

    const handleVerify = () => {
        const otp = inputRef.current.map((input) => input.value).join("");
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
        }
        setOtp(otp);
        setIsOtpSubmitted(true);
        toast.success("OTP Verified. You can now set a new password.");
    }

    const onSubmitPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/reset-password`, {email, otp, newPassword});
            console.log(email, otp, newPassword)
            if (response.status === 200) {
                toast.success("Password Reset Successfully. Please log in with your new password.");
                navigate("/login");
            } else {
                toast.error("Failed to reset password. Please try again.");
            }
        } catch (e) {
            toast.error(e.message)
        } finally {
            setLoading(false)
        }
    }

    axios.defaults.withCredentials = true;

    const cardStyle = {
        maxWidth: "480px",
        width: "100%",
        padding: "40px",
        background: "linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(45, 53, 97, 0.8) 100%)",
        border: "1px solid rgba(102, 126, 234, 0.2)",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
        position: "absolute",
        zIndex: 5,
        backdropFilter: "blur(10px)",
        margin: "20px"
    };

    const inputStyle = {
        width: "100%",
        padding: "10px 12px 10px 40px",
        background: "rgba(102, 126, 234, 0.1)",
        border: "1px solid rgba(102, 126, 234, 0.3)",
        borderRadius: "8px",
        color: "#e0e7ff",
        fontSize: "14px",
        transition: "all 0.3s ease",
        outline: "none",
        boxSizing: "border-box"
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center vh-100 position-relative"
            style={{
                background: "linear-gradient(135deg, #1a1f3a 0%, #2d3561 50%, #1f2a45 100%)",
                position: "relative",
                overflow: "hidden"
            }}>

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

            {/* Email Submit Card */}
            {!isEmailSent && (
                <div style={cardStyle}>
                    <h4
                        className="text-center mb-2 fw-bold"
                        style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            fontSize: "24px"
                        }}
                    >
                        Reset Password
                    </h4>
                    <p
                        className="mb-4 text-center"
                        style={{color: "#cbd5e1", fontSize: "14px"}}
                    >
                        Enter your registered email address
                    </p>

                    <form onSubmit={onSubmitEmail}>
                        <div className="mb-4" style={{position: "relative"}}>
                            <label style={{color: "#cbd5e1", fontSize: "14px", fontWeight: "500", marginBottom: "8px", display: "block"}}>Email Address</label>
                            <Mail size={18} style={{position: "absolute", left: "12px", top: "40px", color: "#667eea"}}/>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.background = "rgba(102, 126, 234, 0.15)";
                                    e.target.style.borderColor = "rgba(102, 126, 234, 0.6)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.background = "rgba(102, 126, 234, 0.1)";
                                    e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                                }}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
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
                            {loading ? "Sending..." : "Send OTP"}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>
            )}

            {/* OTP Verification Card */}
            {!isOtpSubmitted && isEmailSent && (
                <div style={cardStyle}>
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
                        Verify OTP
                    </h4>
                    <p
                        className="text-center mb-4"
                        style={{color: "#cbd5e1", fontSize: "14px"}}
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
                        {loading ? "Verifying..." : "Verify OTP"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </div>
            )}

            {/* New Password Card */}
            {isOtpSubmitted && isEmailSent && (
                <div style={cardStyle}>
                    <h4
                        className="text-center mb-2 fw-bold"
                        style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            fontSize: "24px"
                        }}
                    >
                        Set New Password
                    </h4>
                    <p
                        className="mb-4 text-center"
                        style={{color: "#cbd5e1", fontSize: "14px"}}
                    >
                        Enter your new password
                    </p>

                    <form onSubmit={onSubmitPassword}>
                        <div className="mb-4" style={{position: "relative"}}>
                            <label style={{color: "#cbd5e1", fontSize: "14px", fontWeight: "500", marginBottom: "8px", display: "block"}}>New Password</label>
                            <Lock size={18} style={{position: "absolute", left: "12px", top: "40px", color: "#667eea"}}/>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{...inputStyle, paddingRight: "40px"}}
                                onFocus={(e) => {
                                    e.target.style.background = "rgba(102, 126, 234, 0.15)";
                                    e.target.style.borderColor = "rgba(102, 126, 234, 0.6)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.background = "rgba(102, 126, 234, 0.1)";
                                    e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                                }}
                                ref={el => inputRef.current[0] = el}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "40px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#667eea",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: 0
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
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
                            {loading ? "Resetting..." : "Set Password"}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>
            )}

            <style>{`
                input::placeholder {
                    color: rgba(203, 213, 225, 0.6) !important;
                }
            `}</style>
        </div>
    );
}

export default ResetPassword;