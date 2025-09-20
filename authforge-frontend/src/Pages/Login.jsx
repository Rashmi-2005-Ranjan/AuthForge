import {Link, useNavigate} from "react-router-dom";
import {assets} from "../assets/assets.js";
import {useContext, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {AppContext} from "../Context/AppContext.jsx";

const Login = () => {
    const [createAccount, setCreateAccount] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const {backendUrl,setIsLoggedIn,getUserData} = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true);
        try {
            if (createAccount) {
                //Register API Call
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
        <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
             style={{background: "linear-gradient(90deg, #6a5af9, #8268f9)", border: "none"}}>
            <div style={{position: "absolute", top: "20px", left: "30px", display: "flex", alignItems: "center"}}>
                <Link to="/" style={{
                    display: "flex",
                    gap: 5,
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "24px",
                    textDecoration: "none",
                }}>
                    <img src={assets.logo_home} alt="logo" height={32} width={32}/>
                    <span className="fw-bold fs-4 text-light">AuthForge</span>
                </Link>
            </div>
            <div className="card p-4"
                 style={{
                     maxWidth: "400px",
                     width: "100%",
                 }}
            >
                <h2 className="text-center mb-4">
                    {createAccount ? "Create Account" : "Login"}
                </h2>
                <form onSubmit={onSubmitHandler}>
                    {
                        createAccount && (
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <input type="text"
                                       id="fullName"
                                       className="form-control"
                                       placeholder="Enter Fullname"
                                       required
                                       onChange={(e) => setName(e.target.value)}
                                       value={name}
                                />
                            </div>
                        )
                    }
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Id</label>
                        <input type="email"
                               id="email"
                               className="form-control"
                               placeholder="Enter your email id"
                               required
                               onChange={(e) => setEmail(e.target.value)}
                               value={email}
                        />
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password"
                               id="password"
                               className="form-control"
                               placeholder="********"
                               required
                               onChange={(e) => setPassword(e.target.value)}
                               value={password}
                        />
                    </div>
                    <div className="flex justify-content-between mb-3">
                        <Link to="/reset-password"
                              className="text-decoration-none">
                            Forgot Password ?
                        </Link>
                    </div>
                    <button type="submit" className="btn btn-primary w-100"
                            disabled={loading}
                    >
                        {loading ? "Loading..." : createAccount ? "Sign Up" : "Login"}
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p className="mb-0">
                        {createAccount ?
                            (
                                <>
                                    Already Have an Account ? {" "}
                                    <span className="text-decoration-underline"
                                          style={{cursor: "pointer"}}
                                          onClick={() => setCreateAccount(false)}
                                    >
                                Login Here
                            </span>
                                </>
                            ) : (
                                <>
                                    Don't Have an Account ? {"  "}
                                    <span className="text-decoration-underline"
                                          style={{cursor: "pointer"}} onClick={() => setCreateAccount(true)}>
                                Create One
                            </span>
                                </>
                            )
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;