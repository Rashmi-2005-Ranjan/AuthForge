import {Link, useNavigate} from "react-router-dom";
import {assets} from "../assets/assets.js";
import {useContext, useEffect, useRef, useState} from "react";
import {AppContext} from "../Context/AppContext.jsx";
import {toast} from "react-toastify";
import axios from "axios";

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
                background: "linear-gradient(135deg, #6a5af9 0%, #8268f9 50%, #a08efb 100%)",
            }}
        >
            {/* Logo */}
            <Link
                to="/"
                className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
            >
                <img src={assets.logo} alt="logo" height={36} width={36}/>
                <span className="fs-4 fw-semibold text-light">AuthForge</span>
            </Link>

            {/* Card */}
            <div
                className="p-5 rounded-4 shadow-lg bg-white"
                style={{width: "400px"}}
            >
                <h4 className="text-center fw-bold mb-2 text-dark">
                    Email Verification
                </h4>
                <p className="text-center text-secondary mb-4">
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
                            className="form-control text-center fs-4 fw-bold border-2"
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "12px",
                            }}
                            ref={(el) => (inputRef.current[index] = el)}
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button className="btn btn-primary w-100 fw-semibold py-2 rounded-3 shadow-sm"
                        disabled={loading}
                        onClick={handleVerify}>
                    {loading ? "Verifying..." : "Verify Email"}
                </button>

                {/* Resend Option */}
                <p className="text-center text-muted mt-3 mb-0">
                    Didn’t receive the code?{" "}
                    <button className="btn btn-link p-0 fw-semibold text-decoration-none"
                            onClick={sendVerificationOtp}
                    >
                        Resend OTP
                    </button>
                </p>
            </div>
        </div>
    );
};

export default EmailVerify;
