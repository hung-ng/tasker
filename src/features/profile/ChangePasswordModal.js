import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { useAuth } from '../../firebase/Auth';

const ChangePasswordModal = (props) => {

    const { updatePassword } = useAuth()

    const [error, setError] = useState({
        password: "",
        confirmPassword: ""
    })

    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setError({
            password: "",
            confirmPassword: ""
        })
        props.handleClose()
    }

    const formController = (e) => {
        e.preventDefault();
        const dataForm = {
            password: e.target.pw.value,
            confirmPassword: e.target.confirmPassword.value
        };

        var formValidate = {
            password: "",
            confirmPassword: ""
        }

        if (dataForm.password.trim() === "") {
            formValidate.password = "New password is missing"
        }

        if (dataForm.confirmPassword.trim() !== dataForm.password.trim()) {
            formValidate.confirmPassword = "Password confirmation is incorrect"
        }

        if (dataForm.confirmPassword.trim() === "") {
            formValidate.confirmPassword = "Please confirm your password"
        }

        setError(formValidate)

        if (dataForm.password.trim() !== "" && dataForm.confirmPassword.trim() !== "" && dataForm.confirmPassword.trim() === dataForm.password.trim()) {
            formModel(dataForm.password.trim());
        }
    }

    const formModel = async (data) => {
        try {
            setLoading(true);
            await updatePassword(data)
            alert("Password updated")
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
                <ModalTitle>Change password</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <form id="changePassword" onSubmit={formController}>
                    <div className="input-wrapper">
                        <label htmlFor="password">New password</label>
                        <input id="password" type="password" name="pw" maxLength="30" />
                        <div className="error">{error.password}</div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password">Confirm new password</label>
                        <input id="password" type="password" name="confirmPassword" maxLength="30" />
                        <div className="error">{error.confirmPassword}</div>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button disabled={loading} variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button disabled={loading} type="submit" form="changePassword" variant="primary">Change</Button>
            </ModalFooter>
        </Modal>
    )
}

export default ChangePasswordModal;