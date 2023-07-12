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

const FindGroupModal = (props) => {
  const { currentUser } = useAuth();

  const [playSwooshSound] = useSound(SwooshSound);

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    props.handleClose();
  };

  const formController = (e) => {
    e.preventDefault();
    const dataForm = {
      id: e.target.id.value,
    };

    if (dataForm.id.trim() !== "") {
      formModel(dataForm.id);
    }
  };

  const formModel = async (groupId) => {
    try {
      setLoading(true);
      const res = await db.collection("groups").doc(groupId).get();
      if (!res.exists) {
        alert("Group not exist");
        setLoading(false);
        return;
      } else {
        const res = await db.collection("users").doc(currentUser.email).get();
        const data = res.data();
        if (data.groups_id.includes(groupId)) {
          alert("You are already in this group");
          setLoading(false);
          return;
        }
        await db
          .collection("groups")
          .doc(groupId)
          .update({
            requests: firebase.firestore.FieldValue.arrayUnion(currentUser.email),
          });
      }
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
        <ModalTitle>Find group by Id</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <form id="addGroup" onSubmit={formController}>
          <div className="input-wrapper">
            <label htmlFor="groupId">Group Id</label>
            <input id="groupId" type="text" name="id" maxLength="30" />
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
          Send join request
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FindGroupModal;
