import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { useAuth } from '../../firebase/Auth';

const AddMemberModal = (props) => {

    const { group_id } = useParams()

    const { currentUser } = useAuth()

    const [error, setError] = useState("")

    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setError("")
        props.handleClose()
    }

    const formController = (e) => {
        e.preventDefault();
        const dataForm = {
            email: e.target.email.value
        };

        if (dataForm.email.trim() === "") {
            setError("User's email is missing")
        }

        if (dataForm.email.trim() !== "") {
            formModel(dataForm.email.trim());
        }
    }

    const formModel = async (email) => {
        try {
            setLoading(true);
            const res = await db.collection("users").doc(email).get();
            if (res.exists) {
                const res1 = await db.collection("groups").doc(group_id).get()
                const data = res1.data()
                var member_idArr = data.members_id
                if (member_idArr.includes(email)) {
                    alert("User is already in group")
                    setLoading(false)
                } else if (currentUser === email) {
                    alert("User is already in group")
                    setLoading(false)
                } else {
                    member_idArr.push(email)
                    await db.collection("groups").doc(group_id).update({
                        members_id: member_idArr
                    })
                    const res2 = await db.collection("users").doc(email).get()
                    const data2 = res2.data()
                    var group_idArr = data2.groups_id
                    group_idArr.push(group_id)
                    await db.collection("users").doc(email).update({
                        groups_id: group_idArr
                    })
                    props.handleClose()
                    setLoading(false)
                }
            } else {
                alert("User not exist")
                setLoading(false)
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }

    return (
        <Modal
            show={props.show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <ModalHeader closeButton>
                <ModalTitle>Add new member</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div className="error">{error}</div>
                <form id="addMember" onSubmit={formController}>
                    <div className="input-wrapper">
                        <label for="taskName">User's email</label>
                        <input id="taskName" type="text" name="email" maxLength="40" />
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button disabled={loading} variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button disabled={loading} type="submit" form="addMember" variant="primary">Add</Button>
            </ModalFooter>
        </Modal>
    )
}

export default AddMemberModal;