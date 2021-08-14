import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../firebase/Auth';
import { db } from '../../firebase/config';
import useSound from 'use-sound';
import CrumpledPaper from '../../resources/CrumpledPaper.mp3';

const CommentBar = (props) => {
    const date = props.time.toDate().toLocaleString()

    const { group_id, task_id } = useParams()

    const [playCrumpledPaper] = useSound(CrumpledPaper);

    const [commenter, setCommenter] = useState("")

    const { currentUser } = useAuth()

    const handleDelete = () => {
        console.log(props.id);
        var del = window.confirm("Delete this comment?")
        if (del === true) {
            deleteComment()
        }
    }

    const deleteComment = async () => {
        console.log(group_id);
        await db.collection("groups").doc(group_id).collection("tasks").doc(task_id).collection("users_comment").doc(props.id).delete()
        playCrumpledPaper()
        props.status(true)
    }

    useEffect(() => {
        async function getCommenter() {
            const res = await db.collection('users').doc(props.user_id).get()
            const data = res.data()
            setCommenter(data.firstName + " " + data.lastName)
        }
        getCommenter()
    }, [props.user_id])

    return (
        <div className="flex commentsection">
            <div className="commentbar">
                <div className="flex">
                    <div style={{ cursor: "pointer" }} title={props.user_id}>{commenter}</div>
                    <div>{date}</div>
                </div>
                <div className="content" style={{whiteSpace: "pre-line"}} dangerouslySetInnerHTML={{ __html: props.content }}></div>
            </div>
            {props.user_id === currentUser && <div onClick={handleDelete} className="deletebutton">Delete</div>}
        </div>
    )
}

export default CommentBar;