import {assets} from "../assets/assets.js";
import {useContext} from "react";
import {AppContext} from "../Context/AppContext.jsx";
import {ArrowRight, Shield} from "lucide-react";

const Header = () => {
    const {userData} = useContext(AppContext);
    return (
        <div
            className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3"
            style={{
                minHeight: "80vh",
                background: "linear-gradient(135deg, #1a1f3a 0%, #2d3561 50%, #1f2a45 100%)",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Animated background elements */}
            <div
                style={{
                    position: "absolute",
                    top: "-50%",
                    right: "-10%",
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)",
                    borderRadius: "50%",
                    animation: "float 6s ease-in-out infinite"
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-30%",
                    left: "-5%",
                    width: "300px",
                    height: "300px",
                    background: "radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)",
                    borderRadius: "50%",
                    animation: "float 8s ease-in-out infinite reverse"
                }}
            />

            {/* Content */}
            <div style={{position: "relative", zIndex: 1}}>
                <div className="mb-4" style={{animation: "slideDown 0.8s ease-out"}}>
                    <div
                        style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "20px",
                            padding: "16px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)"
                        }}
                    >
                        <Shield size={48} color="white" strokeWidth={1.5} />
                    </div>
                </div>

                <h5
                    className="fw-semibold mb-3"
                    style={{
                        color: "#e0e7ff",
                        fontSize: "18px",
                        animation: "slideDown 0.8s ease-out 0.1s both",
                        letterSpacing: "0.5px"
                    }}
                >
                    Hey {userData ? userData.name : "Developer"} <span role="img" aria-label="wave">👋</span>
                </h5>

                <h1
                    className="fw-bold display-5 mb-3"
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        animation: "slideDown 0.8s ease-out 0.2s both",
                        letterSpacing: "-0.5px"
                    }}
                >
                    Welcome To Our Product
                </h1>

                <p
                    className="fs-5 mb-4"
                    style={{
                        maxWidth: "500px",
                        color: "#cbd5e1",
                        animation: "slideDown 0.8s ease-out 0.3s both",
                        lineHeight: "1.8"
                    }}
                >
                    Let's Start With a Quick Tour of Our Authentication and Authorization Service.
                </p>

                <button
                    style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "50px",
                        padding: "12px 32px",
                        fontWeight: "600",
                        fontSize: "16px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        animation: "slideDown 0.8s ease-out 0.4s both"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 12px 32px rgba(102, 126, 234, 0.6)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(102, 126, 234, 0.4)";
                        e.currentTarget.style.transform = "translateY(0)";
                    }}
                    className="btn"
                >
                    Get Started
                    <ArrowRight size={18} />
                </button>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(20px);
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

export default Header;