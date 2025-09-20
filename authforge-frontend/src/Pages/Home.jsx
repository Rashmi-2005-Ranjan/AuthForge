import Menubar from "../Components/Menubar.jsx";
import Header from "../Components/Header.jsx";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-content-center min-vh-100">
            <Menubar/>
            <Header/>
        </div>
    )
}

export default Home;