import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { db } from "../../authentication/config";
import { useAuth } from "../../authentication/AuthProvider";
import firebase from "firebase/app";
import "firebase/firestore";
import useSound from "use-sound";
import SwooshSound from "../../resources/SwooshSound.mp3";

const AddGroupModal = (props) => {
  const [error, setError] = useState("");

  const { currentUser } = useAuth();

  const [playSwooshSound] = useSound(SwooshSound);

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setError("");
    props.handleClose();
  };

  const formController = (e) => {
    e.preventDefault();
    const dataForm = {
      name: e.target.name.value,
    };

    if (dataForm.name.trim() === "") {
      setError("Group name is missing");
    }

    if (dataForm.name.trim() !== "") {
      formModel(dataForm.name);
    }
  };

  const formModel = async (group_name) => {
    try {
      setLoading(true);
      const res = await db.collection("groups").doc();
      res.set({
        name: group_name,
        creator_id: currentUser.email,
        members_id: [],
        requests: [],
      });
      const group_id = res.id;

      await db
        .collection("users")
        .doc(currentUser.email)
        .update({
          groups_id: firebase.firestore.FieldValue.arrayUnion(group_id),
        });
      playSwooshSound();
      setLoading(false);
      props.handleClose();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <ModalHeader closeButton>
        <ModalTitle>Create new group</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form id="addGroup" onSubmit={formController}>
          <div className="input-wrapper">
            <label htmlFor="groupName">Group name</label>
            <input id="groupName" type="text" name="name" maxLength="40" />
            <div className="error">{error}</div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button disabled={loading} variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          disabled={loading}
          type="submit"
          form="addGroup"
          variant="primary"
        >
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddGroupModal;
