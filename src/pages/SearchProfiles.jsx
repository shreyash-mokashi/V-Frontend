import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchProfiles.css";

export default function SearchProfiles() {
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  //  Fetch all profiles on page load
  useEffect(() => {
    const fetchAllProfiles = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/profile/search`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setResults(res.data);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProfiles();
  }, [API_BASE_URL]);

  const validateField = (fieldName, value) => {
    if (fieldName === "name") {
      if (value.trim() === "") return "";
      const namePattern = /^[A-Za-z\s]+$/;
      if (!namePattern.test(value)) {
        return "Name must contain only letters (no numbers or symbols).";
      }
    }

    return "";
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(false);

    //  Validate name field before search
    const nameError = validateField("name", name);
    setErrors({ name: nameError });

    if (nameError) {
      return; // Stop search if error exists
    }

    if (!name && !skill) {
      alert("Please enter at least one search criteria (name or skill).");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (skill) params.append("skill", skill);

      const res = await axios.get(`${API_BASE_URL}/profile/search?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResults(res.data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    const errorMsg = validateField("name", e.target.value);
    setErrors((prev) => ({ ...prev, name: errorMsg }));
  };

  return (
    <div className="container">
      <h2 className="heading">Search Profiles</h2>
      <form onSubmit={handleSearch}>
        <div className="inputGroup">
          <input
            type="text"
            placeholder="Search by name"
            className={`inputField ${errors.name ? "inputInvalid" : ""}`}
            value={name}
            onChange={handleNameChange}
          />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>
        <div className="inputGroup">
          <input
            type="text"
            placeholder="Search by skill"
            className="inputField"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>
        <button type="submit" className="searchButton">
          Search
        </button>
      </form>

      {loading && <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>}

      {searched && results.length === 0 && !loading && (
        <p style={{ textAlign: "center", marginTop: "20px", color: "#999" }}>
          No profiles found matching your criteria.
        </p>
      )}

      {results.map((profile) => (
        <div key={profile._id} className="profileCard">
          <div className="profileName">{profile.user?.name}</div>
          <div className="profileBio">{profile.bio || "No bio available."}</div>
          <div className="profileSkills">
            Skills: {profile.skills?.join(", ") || "None listed"}
          </div>
        </div>
      ))}
    </div>
  );
}
