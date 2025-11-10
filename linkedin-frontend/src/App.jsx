import "./App.css";
import Navbar1 from "./components/NavbarV1/navbar1";
import LandingPage from "./pages/LandingPage/landingPage";
import Footer from "./components/Footer/footer.jsx";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/signUp.jsx";
import Login from "./pages/Login/login.jsx";
import Navbar2 from "./components/Navbar2/navbar2.jsx";
import Posts from "./pages/Posts/posts.jsx";
import Profile from "./pages/Profile/profile.jsx";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {location.pathname === '/' ? <Navbar1 /> : <Navbar2 />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;