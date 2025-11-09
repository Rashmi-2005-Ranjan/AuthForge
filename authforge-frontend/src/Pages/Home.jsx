import Menubar from "../Components/Menubar.jsx";
import Header from "../Components/Header.jsx";

const Home = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(90deg, #0f1629 50%, #1a1f3a 50%, #16213e 100%)",
            }}
        >
            <Menubar/>
            <Header/>
        </div>
    )
}

export default Home;