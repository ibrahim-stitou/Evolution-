import { Fragment, useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import "./headerHome.css";

export default function HeaderHome() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const { user_db } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProfileButtonClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const idAuth = localStorage.getItem("id_active");

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/profile-image/?id=${idAuth}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob' // important to handle image data
        });

        // Create a URL for the blob object
        const imageUrl = URL.createObjectURL(response.data);
        setProfileImageUrl(imageUrl);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    if (idAuth && token) {
      fetchProfileImage();
    }
  }, [idAuth, token]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("id_active");
      navigate("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Fragment>
      <div className="parentNavbar">
        <div className="leftNavbar">
          <Link to="/">
            <span>
              <img
                src="/assets/logos/logoRM.png"
                alt="Evolution"
                title="Evolution"
              />
            </span>
          </Link>
        </div>
        <div className="parentCircleHome">
          <div className="circleHome"></div>
        </div>
        <div className="RightNavbar">
          <ul className="parentULnavbar">
            <li>
              <button
                className={`profileHome ${isProfileMenuOpen ? "profileHomeActive" : ""}`}
                onClick={handleProfileButtonClick}
              >
                <img
                src={`http://localhost:8000/api/profile-image/?id=${idAuth}&${Date.now()}`}
                  className="imgProfileHeader"
                  alt="Profile"
                  onError={(e) => { e.target.onerror = null; e.target.src="/assets/default-profile.png"; }} // fallback if image fails to load
                />
                <h4>{user_db.name ? user_db.name : ""} <i className='bx bx-down-arrow'></i></h4>
              </button>
              {isProfileMenuOpen && (
                <ul className="ULprofileHome">
                  <li>
                    <Link to='/settings'>
                      <button><i className='bx bx-cog'></i> Settings</button>
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}><i className='bx bx-log-out'></i> Logout</button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}
