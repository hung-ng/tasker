import React, { useEffect, useState } from "react";
import TaskBar from "./TaskBar";
import { db } from "../../firebase/config";
import { useHistory, useParams } from "react-router-dom";
import './allTasks.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faEdit, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../firebase/Auth";
import AddTaskModal from "./AddTaskModal";
import AddMemberModal from "./AddMemberModal";
import MemberBar from "./MemberBar";
import EditGroupNameModal from "./EditGroupNameModal";
import firebase from 'firebase';


const AllTasks = () => {

    const { currentUser } = useAuth()

    const history = useHistory()

    const [allTasks, setAllTasks] = useState([])

    const [groupNameAndCreator, setGroupNameAndCreator] = useState({})

    const [allMembersId, setAllMembersId] = useState([])

    const [showTaskModal, setShowTaskModal] = useState(false);

    const handleCloseTaskModal = () => setShowTaskModal(false);

    const handleShowTaskModal = () => setShowTaskModal(true);

    const [showMemberModal, setshowMemberModal] = useState(false);

    const handleCloseMemberModal = () => setshowMemberModal(false);

    const handleShowMemberModal = () => setshowMemberModal(true);

    const [showEditName, setShowEditName] = useState(false);

    const handleCloseEditName = () => setShowEditName(false);

    const handleShowEditName = () => setShowEditName(true);

    const [removeMember, setRemoveMember] = useState(false)

    const { group_id } = useParams()

    const checkPermission = () => {
        if (currentUser === groupNameAndCreator.creator_id) {
            return true;
        } else {
            return false
        }
    }

    const editGroupName = (e) => {
        e.preventDefault();
        if (checkPermission()) {
            handleShowEditName()
        } else {
            alert("You are not the group creator!")
        }
    }

    const createTask = (e) => {
        e.preventDefault();
        if (checkPermission()) {
            handleShowTaskModal()
        } else {
            alert("You are not the group creator!")
        }
    }

    const onClickHandle = (id) => {
        history.push("/groups/" + group_id + "/tasks/" + id)
    }

    const addMember = (e) => {
        e.preventDefault();
        if (checkPermission()) {
            handleShowMemberModal()
        } else {
            alert("You are not the group creator!")
        }
    }

    const leaveGroup = (e) => {
        e.preventDefault();
        var cf = window.confirm("Leave this group ?")
        if (cf === true) {
            leave()
        }
    }

    const leave = async () => {
        await db.collection("groups").doc(group_id).update({
            members_id: firebase.firestore.FieldValue.arrayRemove(currentUser)
        })
        await db.collection("users").doc(currentUser).update({
            groups_id: firebase.firestore.FieldValue.arrayRemove(group_id)
        })
        history.goBack()
    }

    useEffect(() => {
        async function getGroupNameandCreator() {
            try {
                const res = await db.collection('groups').doc(group_id).get()
                const data = res.data()
                const object = {
                    name: data.name,
                    creator_id: data.creator_id
                }
                const res1 = await db.collection('users').doc(object.creator_id).get()
                const data1 = res1.data()
                setGroupNameAndCreator({
                    groupName: object.name,
                    creator_id: object.creator_id,
                    creatorName: data1.firstName + " " + data1.lastName
                })
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getGroupNameandCreator()
    }, [showEditName, group_id])

    useEffect(() => {
        async function getAllTask() {
            try {
                await db.collection('groups').doc(group_id).collection('tasks').onSnapshot((snapShot) => {
                    setAllTasks(snapShot.docs.map((doc) => {
                        return {
                            data: doc.data(),
                            id: doc.id
                        }
                    })
                    )
                })
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getAllTask()
    }, [groupNameAndCreator, group_id])

    useEffect(() => {
        async function getAllMembersId() {
            try {
                const res = await db.collection('groups').doc(group_id).get();
                const data = res.data();
                var memebersId = data.members_id
                setAllMembersId(memebersId)
                setRemoveMember(false)
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getAllMembersId()
    }, [showMemberModal, removeMember, group_id])

    return (
        <div style={{ width: "100%", margin: "20px 40px" }}>
            <AddTaskModal show={showTaskModal} handleClose={handleCloseTaskModal} handleShow={handleShowTaskModal} />

            <AddMemberModal show={showMemberModal} handleClose={handleCloseMemberModal} handleShow={handleShowMemberModal} />

            <EditGroupNameModal show={showEditName} handleClose={handleCloseEditName} handleShow={handleShowEditName} />

            <div className="flex header">
                <div className="flex">
                    <div className="groupName">{groupNameAndCreator.groupName}</div>
                    <div onClick={editGroupName} title="Change group name" className="icon"><FontAwesomeIcon icon={faEdit} size="1x" /></div>
                    {currentUser !== groupNameAndCreator.creator_id &&
                        <div onClick={leaveGroup} title="Leave group" className="leaveIcon"><FontAwesomeIcon icon={faDoorOpen} size="1x" /></div>
                    }
                </div>
                <div className="creator">Creator: {groupNameAndCreator.creatorName}</div>
                <div onClick={createTask} title="Add task" className="icon"><FontAwesomeIcon icon={faPlusSquare} size="2x" /></div>
            </div>
            <br />
            <div className="flex container">
                <div>
                    {allTasks.map(task => {
                        return <TaskBar name={task.data.name} deadline={task.data.deadline} onClick={onClickHandle} id={task.id} />
                    })}
                </div>
                <div className="members">
                    <div>Group members</div>
                    <div onClick={addMember} className="addText">+ Add member</div>
                    <br />
                    {allMembersId.map(id => {
                        return (
                            <MemberBar status={setRemoveMember} creator_id={groupNameAndCreator.creator_id} id={id} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default AllTasks;