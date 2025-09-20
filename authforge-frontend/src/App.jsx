import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import EmailVerify from "./Pages/EmailVerify.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";

const App = () => {
    return (
        <div>
            <ToastContainer/>
            <Routes>
                {/* Define your routes here */}
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/email-verify" element={<EmailVerify/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
            </Routes>
        </div>
    )
}

export default App;