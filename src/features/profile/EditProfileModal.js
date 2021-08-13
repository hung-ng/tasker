import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { useAuth } from '../../firebase/Auth';
import { auth, db } from '../../firebase/config';

const EditProfileModal = (props) => {

    const { currentUser } = useAuth()

    const [error, setError] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        dob: ""
    })

    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setError({
            firstName: "",
            lastName: "",
            phone: "",
            dob: ""
        })
        props.handleClose()
    }

    const formController = (e) => {
        e.preventDefault();
        const dataForm = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastname.value,
            phone: e.target.phone.value,
            gender: e.target.gender.value,
            dob: e.target.dob.value
        };
        var formValidate = {
            firstName: "",
            lastName: "",
            phone: "",
            dob: ""
        };

        if (dataForm.firstName.trim() === "") {
            formValidate.firstName = "First name is missing"
        }

        if (dataForm.lastName.trim() === "") {
            formValidate.lastName = "Last name is missing"
        }

        if (isNaN(dataForm.phone.trim())){
            formValidate.phone = "Phone number must be numeric"
        }

        if (dataForm.phone.trim().length !== 10){
            formValidate.phone = "Phone number must has 10 digits"
        }

        if (dataForm.dob === ""){
            formValidate.dob = "D.o.B is missing"
        }

        setError(formValidate)

        if (dataForm.firstName.trim() !== "" && dataForm.lastName.trim() !== "" && !isNaN(dataForm.phone.trim()) && dataForm.phone.trim().length === 10 && dataForm.dob !== "") {
            formModel(dataForm);
        }
    }

    const formModel = async (data) => {
        try {
            setLoading(true);
            await db.collection("users").doc(currentUser).update({
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                phone: data.phone,
                dob: data.dob,
                gender: data.gender
            })
            auth.currentUser.updateProfile({
                displayName: data.lastName.trim() + " " + data.firstName.trim()
            });
            alert("Profile updated")
            props.handleClose()
            setLoading(false)
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
                <ModalTitle>Edit profile</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <form id="profile" onSubmit={formController}>
                    <div className="input-wrapper">
                        <label htmlFor="fisrtName">First name</label>
                        <input id="fisrtName" type="text" name="firstName" maxLength="30" />
                        <div className="error">{error.firstName}</div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="lastName">Last name</label>
                        <input id="lastName" type="text" name="lastname" maxLength="30" />
                        <div className="error">{error.lastName}</div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="phone">Phone No</label>
                        <input id="phone" type="text" name="phone" minLength="10" maxLength="10" />
                        <div className="error">{error.phone}</div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="lastName">Gender</label>
                        <select name="gender" form="profile">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="lastName">D.o.B</label>
                        <input id="lastName" type="date" name="dob" />
                        <div className="error">{error.dob}</div>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button disabled={loading} variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button disabled={loading} type="submit" form="profile" variant="primary">Edit</Button>
            </ModalFooter>
        </Modal>
    )
}

export default EditProfileModal;