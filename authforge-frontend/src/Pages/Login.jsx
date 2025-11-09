import {Link, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {AppContext} from "../Context/AppContext.jsx";
import {Lock, Mail, User, ArrowRight, Eye, EyeOff} from "lucide-react";

const Login = () => {
    const [createAccount, setCreateAccount] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const {backendUrl,setIsLoggedIn,getUserData} = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true);
        try {
            if (createAccount) {
                const response = await axios.post(`${backendUrl}/register`, {name, email, password});
                if (response.status === 201) {
                    navigate("/");
                    toast.success("Account Created Successfully");
                } else {
                    toast.error("Some Error Occurred. Please try again later.");
                }
            } else {
                const response = await axios.post(`${backendUrl}/login`, {email, password});
                if(response.status === 200){
                    setIsLoggedIn(true);
                    getUserData();
                    navigate("/");
                    toast.success("Logged In Successfully");
                }else{
                    toast.error("Some Error Occurred. Please try again later.");
                }
            }
        } catch (e) {
            console.error("Error in Login/Register: ", e);
            toast.error("Some Error Occurred. Please try again later." + e.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
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
            <div style={{position: "absolute", top: "30px", left: "30px", zIndex: 10}}>
                <Link to="/" style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                    textDecoration: "none",
                    transition: "all 0.3s ease"
                }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
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
                    <span style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>AuthForge</span>
                </Link>
            </div>

            {/* Card */}
            <div
                style={{
                    maxWidth: "420px",
                    width: "100%",
                    padding: "40px",
                    background: "linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(45, 53, 97, 0.8) 100%)",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    borderRadius: "16px",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
                    position: "relative",
                    zIndex: 5,
                    backdropFilter: "blur(10px)",
                    margin: "20px"
                }}
            >
                <h2
                    className="text-center mb-4"
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontSize: "28px",
                        fontWeight: "bold"
                    }}
                >
                    {createAccount ? "Create Account" : "Welcome Back"}
                </h2>

                <form onSubmit={onSubmitHandler}>
                    {
                        createAccount && (
                            <div className="mb-3">
                                <label style={{color: "#cbd5e1", fontSize: "14px", fontWeight: "500", marginBottom: "8px", display: "block"}}>Full Name</label>
                                <div style={{position: "relative"}}>
                                    <User size={18} style={{position: "absolute", left: "12px", top: "12px", color: "#667eea"}}/>
                                    <input
                                        type="text"
                                        id="fullName"
                                        placeholder="Enter your full name"
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        style={{
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
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.background = "rgba(102, 126, 234, 0.15)";
                                            e.target.style.borderColor = "rgba(102, 126, 234, 0.6)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.background = "rgba(102, 126, 234, 0.1)";
                                            e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    }

                    <div className="mb-3">
                        <label style={{color: "#cbd5e1", fontSize: "14px", fontWeight: "500", marginBottom: "8px", display: "block"}}>Email Address</label>
                        <div style={{position: "relative"}}>
                            <Mail size={18} style={{position: "absolute", left: "12px", top: "12px", color: "#667eea"}}/>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                style={{
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
                                }}
                                onFocus={(e) => {
                                    e.target.style.background = "rgba(102, 126, 234, 0.15)";
                                    e.target.style.borderColor = "rgba(102, 126, 234, 0.6)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.background = "rgba(102, 126, 234, 0.1)";
                                    e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                                }}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label style={{color: "#cbd5e1", fontSize: "14px", fontWeight: "500", marginBottom: "8px", display: "block"}}>Password</label>
                        <div style={{position: "relative"}}>
                            <Lock size={18} style={{position: "absolute", left: "12px", top: "12px", color: "#667eea"}}/>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                style={{
                                    width: "100%",
                                    padding: "10px 40px 10px 40px",
                                    background: "rgba(102, 126, 234, 0.1)",
                                    border: "1px solid rgba(102, 126, 234, 0.3)",
                                    borderRadius: "8px",
                                    color: "#e0e7ff",
                                    fontSize: "14px",
                                    transition: "all 0.3s ease",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                                onFocus={(e) => {
                                    e.target.style.background = "rgba(102, 126, 234, 0.15)";
                                    e.target.style.borderColor = "rgba(102, 126, 234, 0.6)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.background = "rgba(102, 126, 234, 0.1)";
                                    e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "12px",
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
                    </div>

                    {!createAccount && (
                        <div className="mb-3">
                            <Link to="/reset-password" style={{color: "#667eea", textDecoration: "none", fontSize: "14px", fontWeight: "500", transition: "all 0.2s ease"}}
                                  onMouseEnter={(e) => e.currentTarget.style.color = "#764ba2"}
                                  onMouseLeave={(e) => e.currentTarget.style.color = "#667eea"}
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    )}

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
                        {loading ? "Loading..." : createAccount ? "Sign Up" : "Login"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p style={{color: "#cbd5e1", fontSize: "14px", marginBottom: 0}}>
                        {createAccount ?
                            (
                                <>
                                    Already have an account? {" "}
                                    <span
                                        style={{
                                            color: "#667eea",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            transition: "all 0.2s ease"
                                        }}
                                        onClick={() => setCreateAccount(false)}
                                        onMouseEnter={(e) => e.currentTarget.style.color = "#764ba2"}
                                        onMouseLeave={(e) => e.currentTarget.style.color = "#667eea"}
                                    >
                                        Login Here
                                    </span>
                                </>
                            ) : (
                                <>
                                    Don't have an account? {" "}
                                    <span
                                        style={{
                                            color: "#667eea",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            transition: "all 0.2s ease"
                                        }}
                                        onClick={() => setCreateAccount(true)}
                                        onMouseEnter={(e) => e.currentTarget.style.color = "#764ba2"}
                                        onMouseLeave={(e) => e.currentTarget.style.color = "#667eea"}
                                    >
                                        Create One
                                    </span>
                                </>
                            )
                        }
                    </p>
                </div>
            </div>

            <style>{`
                input::placeholder {
                    color: rgba(203, 213, 225, 0.6) !important;
                }
            `}</style>
        </div>
    )
}

export default Login;