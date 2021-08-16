import React, { useEffect, useState } from "react";
import TaskBar from "./TaskBar";
import { db } from "../../firebase/config";
import { Redirect, useHistory, useParams } from "react-router-dom";
import './allTasks.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faEdit, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../firebase/Auth";
import AddTaskModal from "./AddTaskModal";
import AddMemberModal from "./AddMemberModal";
import MemberBar from "./MemberBar";
import EditGroupNameModal from "./EditGroupNameModal";
import firebase from 'firebase';
import NotificationContainer from "../notifications/NotificationContainer";

const AllTasks = () => {

    const { currentUser } = useAuth()

    const history = useHistory()

    const [allTasks, setAllTasks] = useState([])

    const [groupNameAndCreator, setGroupNameAndCreator] = useState({})

    const [allMembersId, setAllMembersId] = useState([])

    const [notAvailable1, setNotAvailable1] = useState(false)
    
    const [notAvailable2, setNotAvailable2] = useState(false)

    const [showTaskModal, setShowTaskModal] = useState(false);

    const [done, setDone] = useState({})

    const [onGoing, setOnGoing] = useState({
        fontWeight: "bold"
    })

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
        if (currentUser !== groupNameAndCreator.creator_id) {
            var cf1 = window.confirm("Leave this group ?")
            if (cf1 === true) {
                leave()
            }
        } else {
            if (allMembersId.length > 0) {
                alert("Can not leave group")
            } else {
                var cf2 = window.confirm("Leave this group ?")
                if (cf2 === true) {
                    deleteGroup()
                }
            }
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

    const deleteGroup = async () => {
        await db.collection("users").doc(currentUser).update({
            groups_id: firebase.firestore.FieldValue.arrayRemove(group_id)
        })
        await db.collection("groups").doc(group_id).delete()
        history.goBack()
    }

    const getOnGoingTasks = async (e) => {
        e.preventDefault();
        try {
            await db.collection('groups').doc(group_id).collection('tasks').where("done", "==", false).orderBy("deadline").onSnapshot((snapShot) => {
                setAllTasks(snapShot.docs.map((doc) => {
                    return {
                        data: doc.data(),
                        id: doc.id
                    }
                })
                )
            })
            setOnGoing({
                fontWeight: "bold"
            })
            setDone({})
        }
        catch (err) {
            console.log(err.message);
        }
    }

    const getDoneTasks = async (e) => {
        e.preventDefault();
        try {
            await db.collection('groups').doc(group_id).collection('tasks').where("done", "==", true).orderBy("deadline", "desc").onSnapshot((snapShot) => {
                setAllTasks(snapShot.docs.map((doc) => {
                    return {
                        data: doc.data(),
                        id: doc.id
                    }
                })
                )
            })
            setDone({
                fontWeight: "bold"
            })
            setOnGoing({})
        }
        catch (err) {
            console.log(err.message);
        }
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
                if (currentUser !== object.creator_id){
                    setNotAvailable1(true)
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
    }, [showEditName, group_id, currentUser])

    useEffect(() => {
        async function getAllTask() {
            try {
                await db.collection('groups').doc(group_id).collection('tasks').where("done", "==", false).orderBy("deadline").onSnapshot((snapShot) => {
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
                var membersId = data.members_id
                if(!membersId.includes(currentUser)){
                    setNotAvailable2(true)
                }
                setAllMembersId(membersId)
                setRemoveMember(false)
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getAllMembersId()
    }, [showMemberModal, removeMember, group_id, currentUser])

    if(notAvailable1 && notAvailable2){
        console.log("alo");
        return <Redirect to="/groups" />
    }

    return (
        <div style={{ width: "100%", margin: "3vh 2vw" }}>
            <AddTaskModal members_id={allMembersId} creator={groupNameAndCreator.creatorName} groupName={groupNameAndCreator.groupName} show={showTaskModal} handleClose={handleCloseTaskModal} handleShow={handleShowTaskModal} />

            <AddMemberModal creator={groupNameAndCreator.creatorName} groupName={groupNameAndCreator.groupName} show={showMemberModal} handleClose={handleCloseMemberModal} handleShow={handleShowMemberModal} />

            <EditGroupNameModal groupName={groupNameAndCreator.groupName} members_id={allMembersId} show={showEditName} creator={groupNameAndCreator.creatorName} handleClose={handleCloseEditName} handleShow={handleShowEditName} />

            <div className="flex main-header">
                <div className="flex">
                    <div className="groupName">{groupNameAndCreator.groupName}</div>
                    <div onClick={editGroupName} title="Change group name" className="icon"><FontAwesomeIcon icon={faEdit} size="1x" /></div>
                    <div onClick={leaveGroup} title="Leave group" className="leaveIcon"><FontAwesomeIcon icon={faDoorOpen} size="1x" /></div>
                </div>
                <div className="creator">Creator: {groupNameAndCreator.creatorName}</div>
                <div onClick={createTask} title="Add task" className="icon"><FontAwesomeIcon icon={faPlusSquare} size="2x" /></div>
                <NotificationContainer />
            </div>
            <br />
            <div className="flex container">
                <div>
                    <div className="flex taskStatusChoice">
                        <div style={onGoing} onClick={getOnGoingTasks} className="cursor">On going</div>
                        <div style={done} onClick={getDoneTasks} className="cursor">Done</div>
                    </div>
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