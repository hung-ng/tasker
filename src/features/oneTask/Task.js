import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import './task.css'
import SubmitTask from './NewComment';
import CommentBar from './CommentBar';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../firebase/Auth';
import EditTaskModal from './EditTaskModal';

const Task = () => {

    const { group_id, task_id } = useParams()

    const history = useHistory()

    const [taskInfo, setTaskInfo] = useState({
        name: '',
        content: '',
        deadline: '',
        creator_id: ''
    })

    const { currentUser } = useAuth()

    const [commentInfo, setCommentInfo] = useState([])

    const [commentNumber, setCommentNumber] = useState(0)

    const [newComment, setNewComment] = useState(false)

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);

    const handleShowModal = () => setShowModal(true);

    const urlify = (text) => {
        if (text != null) {
            var urlRegex = new RegExp("((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)");
            const replaced = text.replace(urlRegex, function (url) {
                return '<a href="' + url + '">' + url + '</a>';
            })
            return replaced
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

    useEffect(() => {
        async function getTaskInfo() {
            try {
                const res1 = await db.collection('groups').doc(group_id).collection('tasks').doc(task_id).get()
                const data1 = res1.data()
                const res2 = await db.collection('groups').doc(group_id).get()
                const data2 = res2.data()
                setTaskInfo({
                    name: data1.name,
                    content: data1.content,
                    deadline: data1.deadline,
                    attachments: data1.attachments,
                    attachmentsName: data1.attachmentsName,
                    creator_id: data2.creator_id
                })
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getTaskInfo()
    }, [showModal, group_id, task_id])

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

    return (
        <div style={{ width: "100%", margin: "20px 40px" }}>
            <EditTaskModal show={showModal} handleClose={handleCloseModal} handleShow={handleShowModal} />
            <div className="flex">
                <div className="name">{taskInfo.name}</div>
                <div className="flex iconflex">
                    <div onClick={editTask} title="Edit" className="icon"><FontAwesomeIcon icon={faEdit} size="1x" /></div>
                    <div onClick={deleteTask} title="Delete" className="icon"><FontAwesomeIcon icon={faTrashAlt} size="1x" /></div>
                </div>
            </div>
            <div className="dl">Deadline: {taskInfo.deadline}</div>
            <br />
            <div className="content" style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: urlify(taskInfo.content) }}></div>
            {
                (taskInfo.attachments)
                && (
                    <div>
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
            {commentInfo.map(comment => {
                return <CommentBar status={setNewComment} id={comment.comment_id} content={urlify(comment.content)} time={comment.time} user_id={comment.user_id} />
            })}
        </div>
    )
}

export default Task;