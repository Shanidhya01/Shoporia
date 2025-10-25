import React, { useEffect, useState } from "react";
import "./Styles/UsersList.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { Delete, Edit } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, removeErrors, deleteUser } from "../features/admin/adminSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

function UsersList() {
  const { users, loading, error, message } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(users);
  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setShowPopup(true);
    document.body.classList.add("blur-active"); // blur background
  };

  const cancelDelete = () => {
    setShowPopup(false);
    setSelectedUserId(null);
    document.body.classList.remove("blur-active");
  };

  const confirmDelete = async () => {
    setShowPopup(false);
    document.body.classList.remove("blur-active");
    try {
      const resultAction = await dispatch(deleteUser(selectedUserId));
      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success("User deleted successfully!", { position: "top-center", autoClose: 3000 });
        navigate("/admin/dashboard");
      } else {
        const errorMsg = resultAction.payload?.message || "Failed to delete user.";
        toast.error(errorMsg, { position: "top-center", autoClose: 3000 });
      }
    } catch (err) {
      toast.error("Failed to delete user.", { position: "top-center", autoClose: 3000 });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="All Users" />
          <div className="usersList-container">
            <h1 className="usersList-title">All Users</h1>
            <div className="usersList-table-container">
              <table className="usersList-table">
                <thead>
                  <tr>
                    <th>SI No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link
                          to={`/admin/user/${user._id}`}
                          className="action-icon edit-icon"
                        >
                          <Edit />
                        </Link>
                        <button
                          className="action-icon delete-icon"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Delete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ✅ Delete Confirmation Popup */}
          {showPopup && (
            <div className="popup-overlay">
              <div className="popup">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this user?</p>
                <div className="popup-buttons">
                  <button onClick={confirmDelete} className="confirm-btn">
                    Yes, Delete
                  </button>
                  <button onClick={cancelDelete} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </>
      )}
    </>
  );
}

export default UsersList;
