import { Link } from "react-router-dom";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          <span>
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </span>
        </div>

        <h1>My Profile</h1>
        <p className="profile-subtitle">
          Manage your personal information
        </p>

        <div className="profile-details">
          <div className="profile-detail">
            <span className="detail-label">Full Name</span>
            <span className="detail-value">{user.name || "Not available"}</span>
          </div>

          <div className="profile-detail">
            <span className="detail-label">Email Address</span>
            <span className="detail-value">{user.email || "Not available"}</span>
          </div>
        </div>

        <Link to="/" className="profile-home-btn">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default Profile;