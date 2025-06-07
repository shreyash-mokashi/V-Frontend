import { useEffect, useState, useRef } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "./MyProfile.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const alertShown = useRef(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        setProfile(res.data);
      } catch (err) {
        if (!alertShown.current) {
          alert("Profile not found");
          alertShown.current = true;
        }
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <p>No profile found. Please create your profile.</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      {profile.imageUrl && (
        <div className="profile-image-wrapper">
          <img
            src={`${API_BASE_URL.replace("/api", "")}${profile.imageUrl}`}
            alt="Profile"
            className="profile-image"
          />
        </div>
      )}

      <p><strong>Bio:</strong><br />{profile.bio}</p>
      <p><strong>Skills:</strong><br />{profile.skills.join(", ")}</p>
      <p>
        <strong>GitHub:</strong><br />
        <a href={profile.social?.github} target="_blank" rel="noopener noreferrer">
          {profile.social?.github}
        </a>
      </p>
      <p>
        <strong>LinkedIn:</strong><br />
        <a href={profile.social?.linkedin} target="_blank" rel="noopener noreferrer">
          {profile.social?.linkedin}
        </a>
      </p>
      <p>
        <strong>Twitter:</strong><br />
        <a href={profile.social?.twitter} target="_blank" rel="noopener noreferrer">
          {profile.social?.twitter}
        </a>
      </p>
      <Link to="/home/edit-profile" className="edit-link">Edit Profile</Link>
    </div>
  );
}
