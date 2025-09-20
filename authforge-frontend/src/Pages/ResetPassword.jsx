import {Link, useNavigate} from "react-router-dom";
import {assets} from "../assets/assets.js";
import {useContext, useRef, useState} from "react";
import {AppContext} from "../Context/AppContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";

const ResetPassword = () => {
    const inputRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const {backendUrl} = useContext(AppContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
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

    return (
        <div
            className="d-flex align-items-center justify-content-center vh-100 position-relative"
            style={{
                background: "linear-gradient(90deg, #6a5af9, #8268f9)",
                border: "none"
            }}>
            <Link
                to="/"
                className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none">
                <img
                    src={assets.logo}
                    alt="logo"
                    height="32"
                    width="32"
                />
                <span className="fs-4 fw-semibold text-light">AuthForge</span>
            </Link>

            {/* Reset Password Card */}
            {!isEmailSent && (
                <div
                    className="rounded-4 p-5 text-center bg-white shadow"
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                    }}
                >
                    <h4 className="mb-2 fw-bold">Reset Password</h4>
                    <p className="mb-4 text-muted">Enter Your Registered Email Address</p>

                    <form onSubmit={onSubmitEmail}>
                        <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
                            <span className="input-group-text bg-transparent border-0 ps-4">
                                <i className="bi bi-envelope text-primary"></i>
                            </span>
                            <input
                                type="email"
                                className="form-control bg-transparent border-0 p-4 rounded-end"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{height: "50px"}}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-100 py-2 fw-semibold"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                </div>
            )}
            {/*    OTP Card*/}
            {
                !isOtpSubmitted && isEmailSent && (
                    <div
                        className="d-flex align-items-center justify-content-center min-vh-100 position-relative">
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
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </div>
                    </div>
                )
            }
            {/*   New Password Form */}
            {isOtpSubmitted && isEmailSent && (
                <div className="rounded-4 p-4 text-center bg-white"
                     style={{
                         width: "100%",
                         maxWidth: "400px",
                     }}
                >
                    <h4 className="mb-2 fw-bold">Set New Password</h4>
                    <p className="mb-4 text-muted">Enter Your New Password</p>

                    <form onSubmit={onSubmitPassword}>
                        <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
                                                <span className="input-group-text bg-transparent border-0 ps-4">
                                                    <i className="bi bi-person-fill-lock text-primary"></i>
                                                </span>
                            <input
                                type="password"
                                className="form-control bg-transparent border-0 p-4 rounded-end"
                                placeholder="******"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{height: "50px"}}
                                ref={el => inputRef.current[0] = el}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-100 py-2 fw-semibold"
                        >
                            {loading ? "Setting..." : "Set Password"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ResetPassword;
