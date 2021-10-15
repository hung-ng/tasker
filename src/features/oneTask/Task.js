import React, { useState, useEffect } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import './task.css'
import SubmitTask from './NewComment';
import CommentBar from './CommentBar';
import { faCheckCircle, faEdit, faEye, faEyeSlash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../firebase/Auth';
import EditTaskModal from './EditTaskModal';
import useSound from 'use-sound';
import PopUp from '../../resources/PopUp.mp3';
import CrumpledPaper from '../../resources/CrumpledPaper.mp3';
import NotificationContainer from '../notifications/NotificationContainer';

const Task = () => {

    const { group_id, task_id } = useParams()

    const history = useHistory()

    const [playPopUp] = useSound(PopUp);

    const [playCrumpledPaper] = useSound(CrumpledPaper);

    const [taskInfo, setTaskInfo] = useState({
        name: '',
        content: '',
        deadline: '',
        creator_id: ''
    })

    const { currentUser } = useAuth()

    const [notExist, setNotExist] = useState(false)

    const [commentInfo, setCommentInfo] = useState([])

    const [markStatus, setMarkStatus] = useState("Mark task as done")

    const [commentNumber, setCommentNumber] = useState(0)

    const [newComment, setNewComment] = useState(false)

    const [justChange, setJustChange] = useState(false)

    const [showModal, setShowModal] = useState(false);

    const [visibility, setVisibility] = useState(null);

    const handleCloseModal = () => setShowModal(false);

    const handleShowModal = () => setShowModal(true);

    const urlify = (text) => {
        if (text != null) {
            var urlRegex = new RegExp("((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)");
            const replaced = text.replace(urlRegex, function (url) {
                return '<a target="_blank" rel="noopener noreferrer" href="' + url + '">' + url + '</a>';
            })
            return replaced
        }
    }

    const sortComment = (array) => {
        if (currentUser !== taskInfo.creator_id) {
            if (visibility === true) {
                return array
            } else {
                return array.filter(element => element.user_id === currentUser || element.user_id === taskInfo.creator_id)
            }
        } else {
            return array
        }
    }

    const deleteTask = async (e) => {
        e.preventDefault();
        if (currentUser === taskInfo.creator_id) {
            var cf = window.confirm("Delete task " + taskInfo.name + "?")
            if (cf === true) {
                try {
                    await db.collection('groups').doc(group_id).collection("tasks").doc(task_id).delete()
                }
                catch (err) {
                    console.log(err.mesage);
                }
                playCrumpledPaper()
                history.goBack()
            }
        } else {
            alert("You are not the group creator")
        }
    }

    const editTask = (e) => {
        e.preventDefault();
        if (currentUser === taskInfo.creator_id) {
            handleShowModal()
        } else {
            alert("You are not the group creator")
        }
    }

    const changeVisible = async (e) => {
        e.preventDefault();
        if (currentUser === taskInfo.creator_id) {
            try {
                const newVisibility = !visibility
                await db.collection("groups").doc(group_id).collection("tasks").doc(task_id).update({
                    visible: newVisibility
                })
                playPopUp()
                setVisibility(newVisibility)
            }
            catch (err) {
                console.log(err.message);
            }
        } else {
            alert("You are not the group creator")
        }
    }

    const changeTaskStatus = async (e) => {
        e.preventDefault();
        if (currentUser === taskInfo.creator_id) {
            try {
                setJustChange(false)
                await db.collection("groups").doc(group_id).collection("tasks").doc(task_id).update({
                    done: !taskInfo.done
                })
                setJustChange(true)
            }
            catch (err) {
                console.log(err.message);
            }
        } else {
            alert("You are not the group creator")
        }
    }

    useEffect(() => {
        async function getTaskInfo() {
            try {
                const res = await db.collection("groups").doc(group_id).get()
                const data = res.data()
                if (!data.members_id.includes(currentUser) && currentUser !== data.creator_id) {
                    setNotExist(true)
                }
                const res1 = await db.collection('groups').doc(group_id).collection('tasks').doc(task_id).get()
                const data1 = res1.data()
                if (data1 === undefined) {
                    setNotExist(true)
                }
                const res2 = await db.collection('groups').doc(group_id).get()
                const data2 = res2.data()
                setTaskInfo({
                    name: data1.name,
                    content: data1.content,
                    deadline: data1.deadline,
                    attachments: data1.attachments,
                    attachmentsName: data1.attachmentsName,
                    creator_id: data2.creator_id,
                    members_id: data2.members_id,
                    done: data1.done
                })
                if (data1.done) {
                    setMarkStatus("Mark task as on going")
                } else {
                    setMarkStatus("Mark task as done")
                }
                setVisibility(data1.visible)
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getTaskInfo()
    }, [showModal, group_id, task_id, visibility, currentUser, justChange])

    useEffect(() => {
        async function getCommentInfo() {
            try {
                await db.collection('groups').doc(group_id).collection('tasks').doc(task_id).collection("users_comment").orderBy("time", "desc").get()
                    .then(querySnapShot => {
                        var commentInfo = []
                        var commentCount = 0
                        querySnapShot.forEach(doc => {
                            const data = doc.data()
                            const Info = {
                                content: data.content,
                                user_id: data.user_id,
                                time: data.time,
                                comment_id: doc.id
                            }
                            commentCount += 1
                            commentInfo.push(Info)
                        })
                        setCommentInfo(commentInfo)
                        setCommentNumber(commentCount)
                        setNewComment(false)
                    })
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getCommentInfo()
    }, [taskInfo, newComment, group_id, task_id])

    if (notExist) {
        return <Redirect to="/groups" />
    }

    return (
        <div style={{ width: "100%", margin: "3vh 2vw" }}>
            <EditTaskModal members_id={taskInfo.members_id} task={taskInfo.name} show={showModal} handleClose={handleCloseModal} handleShow={handleShowModal} />
            <div className="flex main-header">
                <div className="flex">
                    <div className="name">{taskInfo.name}</div>
                    <div className="flex iconflex">
                        <div onClick={editTask} title="Edit" className="icon"><FontAwesomeIcon icon={faEdit} size="1x" /></div>
                        {(visibility === true) && <div onClick={changeVisible} title="Comments visible to everyone" className="icon"><FontAwesomeIcon icon={faEye} size="1x" /></div>}
                        {(visibility === false) && <div onClick={changeVisible} title="Comments visible to commentor and creator only" className="icon"><FontAwesomeIcon icon={faEyeSlash} size="1x" /></div>}
                        <div onClick={changeTaskStatus} title={markStatus} className="icon"><FontAwesomeIcon icon={faCheckCircle} size="1x" /></div>
                        <div onClick={deleteTask} title="Delete" className="icon"><FontAwesomeIcon icon={faTrashAlt} size="1x" /></div>
                    </div>
                </div>
                <NotificationContainer />
            </div>
            <div className="dl">Deadline: {taskInfo.deadline}</div>
            <br />
            <div className="content" style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: urlify(taskInfo.content) }}></div>
            {
                (taskInfo.attachments && taskInfo.attachments.length > 0)
                && (
                    <div>
                        <br />
                        <div>Attachments</div>
                        {taskInfo.attachments.map((attach, index) => {
                            return <div><a target="_blank" rel="noopener noreferrer" href={attach}><div>{taskInfo.attachmentsName[index]}</div></a></div>
                        })}
                    </div>
                )
            }
            <br />
            <hr />
            <p>Comments: {commentNumber}</p>
            <SubmitTask status={setNewComment} />
            {sortComment(commentInfo).map(comment => {
                return <CommentBar status={setNewComment} id={comment.comment_id} content={urlify(comment.content)} time={comment.time} user_id={comment.user_id} />
            })}
        </div>
    )
}

export default Task;