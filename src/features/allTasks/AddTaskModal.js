import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { useParams } from 'react-router-dom';
import { db, storage } from '../../firebase/config';
import { useAuth } from '../../firebase/Auth';
import firebase from 'firebase';
import useSound from 'use-sound';
import SwooshSound from '../../resources/SwooshSound.mp3';

const AddTaskModal = (props) => {

    const { group_id } = useParams()

    const [error, setError] = useState("")

    const { currentUser } = useAuth()

    const [playSwooshSound] = useSound(SwooshSound);

    const [loading, setLoading] = useState(false)

    const [fileUrl, setFileUrl] = useState([])

    const [fileName, setFileName] = useState([])

    const [value, setValue] = useState('');

    const [rows, setRows] = useState(5)

    const minRows = 5;

    const maxRows = 10;

    const handleChange = (event) => {
        const textareaLineHeight = 24;

        const previousRows = event.target.rows;

        event.target.rows = minRows;

        const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }

        if (currentRows >= maxRows) {
            event.target.rows = maxRows;
            event.target.scrollTop = event.target.scrollHeight;
        }

        setValue(event.target.value)

        setRows(currentRows < maxRows ? currentRows : maxRows)
    };

    const handleClose = () => {
        setError("")
        props.handleClose()
    }

    const fileOnChange = async (e) => {
        const filelist = e.target.files;
        const storageRef = storage.ref();
        const now = Date.now()
        var fileUrlList = []
        var fileNameList = []
        setLoading(true)
        for (var i = 0; i < filelist.length; i++) {
            if (filelist[i].size < 5 * 1024 * 1024) {
                const fileRef = storageRef.child(currentUser + "/" + now + filelist[i].name);
                await fileRef.put(filelist[i]);
                const url = await fileRef.getDownloadURL();
                fileUrlList.push(url)
                fileNameList.push(filelist[i].name)
            } else {
                alert("File" + filelist[i].name + " is too large")
            }
        }
        setLoading(false)
        setFileUrl(fileUrlList)
        setFileName(fileNameList)
    }

    const formController = (e) => {
        e.preventDefault();
        const dataForm = {
            name: e.target.name.value,
            deadline: e.target.deadline.value,
            content: e.target.content.value
        };

        if (dataForm.content.trim() === "") {
            setError("Task's content is missing")
        }

        if (dataForm.deadline === "") {
            setError("Deadline is missing")
        }

        if (dataForm.name.trim() === "") {
            setError("Title is missing")
        }

        if (dataForm.name !== "" && dataForm.deadline !== "" && dataForm.content !== "") {
            formModel(dataForm);
        }
    }

    const formModel = async (data) => {
        try {
            setLoading(true);
            const now = new Date()
            const res1 = await db.collection("groups").doc(group_id).collection("tasks").add({
                name: data.name,
                deadline: data.deadline,
                content: data.content,
                attachments: fileUrl,
                attachmentsName: fileName,
                visible: true
            })
            const res2 = await db.collection("notifications").add({
                time: now,
                content: props.creator + " added a new task to group " + props.groupName,
                path: "/groups/" + group_id + "/tasks/" + res1.id
            })
            for (var i = 0; i < props.members_id.length; i++) {
                await db.collection("users").doc(props.members_id[i]).update({
                    notifications: firebase.firestore.FieldValue.arrayUnion(res2.id),
                    unseen_notifications: true
                })
            }
            playSwooshSound()
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
                <ModalTitle>Add new task</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div className="error">{error}</div>
                <form id="addTask" onSubmit={formController}>
                    <div className="input-wrapper">
                        <label htmlFor="taskName">Title</label>
                        <input id="taskName" type="text" name="name" maxLength="40" />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="taskDl">Deadline</label>
                        <input id="taskDl" type="date" name="deadline" />
                    </div>
                    <div className="input-wrapper flex">
                        <div className="textarea-label">
                            <label htmlFor="content">Details</label>
                        </div>
                        <textarea name="content" form="addTask" maxLength="1000" rows={rows} value={value} onChange={handleChange}></textarea>
                    </div>
                    <div className="input-wrapper">
                        <div className="attachmentsLetter">Attachments</div>
                        <input id="file" type="file" onChange={fileOnChange} accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf, image/*" multiple hidden />
                        <label className="fileLabel" htmlFor="file">Choose files</label>
                        <span id="file-chosen">{fileName.toString()}</span>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button disabled={loading} variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button disabled={loading} type="submit" form="addTask" variant="primary">Add</Button>
            </ModalFooter>
        </Modal>
    )
}

export default AddTaskModal;