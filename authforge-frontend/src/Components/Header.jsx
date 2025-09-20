import {assets} from "../assets/assets.js";
import {useContext} from "react";
import {AppContext} from "../Context/AppContext.jsx";

const Header = () => {
    const {userData} = useContext(AppContext);
    return (
        <div className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3" style={{minHeight: "80vh"}}>
            <img src={assets.header} alt="logo" width={150} height={150} className="mb-4"/>
            <h5 className="fw-semibold">Hey {userData ? userData.name : "Developer"}
                <span role="img" aria-label="wave">👋</span>
            </h5>
            <h1 className="fw-bold display-5 mb-3">Welcome To Our Product</h1>

            <p className="text-muted fs-5 mb-4" style={{maxWidth:"500px"}}>
                Let's Start With a Quick Tour of Our Authentication and Authorization Service.
            </p>
            <button className="btn btn-outline-dark rounded-pill px-4 py-2">
                Get Started
            </button>
        </div>
    )
}

export default Header;