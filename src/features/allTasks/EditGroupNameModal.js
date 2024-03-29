import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { db } from "../../authentication/config";
import { useParams } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import useSound from "use-sound";
import SwooshSound from "../../resources/SwooshSound.mp3";

const EditGroupNameModal = (props) => {
  const [error, setError] = useState("");

  const { group_id } = useParams();

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
      const now = new Date();
      await db.collection("groups").doc(group_id).update({
        name: group_name,
      });
      if (props.members_id.length > 0) {
        const res = await db.collection("notifications").add({
          time: now,
          content:
            props.creator +
            " change group " +
            props.groupName +
            "'s name to " +
            group_name,
          path: "/groups/" + group_id,
        });
        for (var i = 0; i < props.members_id.length; i++) {
          await db
            .collection("users")
            .doc(props.members_id[i])
            .update({
              notifications: firebase.firestore.FieldValue.arrayUnion(res.id),
              unseen_notifications: true,
            });
        }
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
        <ModalTitle>Change group name</ModalTitle>
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
          Change
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditGroupNameModal;
