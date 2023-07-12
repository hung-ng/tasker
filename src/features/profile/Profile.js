import React, { useEffect, useState } from "react";
import { useAuth } from "../../authentication/AuthProvider";
import { db } from "../../authentication/config";
import Button from "react-bootstrap/Button";
import "./profile.css";
import ChangePasswordModal from "./ChangePasswordModal";
import EditProfileModal from "./EditProfileModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const { currentUser } = useAuth();

  const [profileInfo, setProfileInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowEditModal = () => setShowEditModal(true);

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  const handleShowModal = () => setShowModal(true);

  const changePassword = (e) => {
    e.preventDefault();
    handleShowModal();
  };

  useEffect(() => {
    let isMounted = true;
    async function getProfileInfo() {
      try {
        const res = await db.collection("users").doc(currentUser.email).get();
        const data = res.data();
        if (isMounted) {
          setProfileInfo({
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            gender: data.gender,
            dob: data.dob,
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    getProfileInfo();

    return () => (isMounted = false);
  }, [showEditModal, currentUser]);

  return (
    <div style={{ width: "100%", margin: "3vh 2vw" }}>
      <EditProfileModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        handleShow={handleShowEditModal}
      />
      <ChangePasswordModal
        show={showModal}
        handleClose={handleCloseModal}
        handleShow={handleShowModal}
      />
      <div className="flex">
        <div className="profileLetter">Personal Infomation</div>
        <div onClick={handleShowEditModal} title="Edit" className="icon">
          <FontAwesomeIcon icon={faEdit} size="1x" />
        </div>
      </div>
      <br />
      <div className="flex nameBar">
        <div>First name: {profileInfo.firstName}</div>
        <div>Last name: {profileInfo.lastName}</div>
      </div>
      <br />
      <div className="emailBar">Email: {currentUser.email}</div>
      <br />
      <div className="phoneBar">Phone number: {profileInfo.phone}</div>
      <br />
      <div className="flex nameBar">
        <div>Gender: {profileInfo.gender}</div>
        <div>D.o.B: {profileInfo.dob}</div>
      </div>
      <br />
      <Button onClick={changePassword}>Change password</Button>
    </div>
  );
};

export default Profile;
