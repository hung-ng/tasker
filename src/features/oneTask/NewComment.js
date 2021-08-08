import React, { useState } from 'react';
import { db } from "../../firebase/config";
import { useParams } from "react-router-dom";
import { useAuth } from "../../firebase/Auth";
import './task.css'

const NewComment = (props) => {

    const { group_id, task_id } = useParams()

    const { currentUser } = useAuth()

    const [loading, setLoading] = useState(false)

    const [value, setValue] = useState('');

    const [rows, setRows] = useState(1)

    const [minRows, setMinRows] = useState(1)

    const [maxRows, setMaxRows] = useState(7)

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

    const submitTaskController = (e) => {
        e.preventDefault()
        if (value.trim() !== "") {
            submitTaskModel(value);
        }
    }

    const submitTaskModel = async (content) => {
        try {
            setLoading(true)
            const now = new Date()
            await db.collection("groups").doc(group_id).collection("tasks").doc(task_id).collection("users_comment").add({
                user_id: currentUser,
                content: content,
                time: now
            })
            setValue("")
            setLoading(false)
            props.status(true)
        }
        catch (err) {
            console.log(err.message);
        }
    }

    return (
        <form onSubmit={submitTaskController} id="submitTaskForm">
            <div className="flex commentForm">
                <textarea rows={rows} className="textarea" value={value} onChange={handleChange} form="submitTaskForm" maxLength="1000" placeholder="New comment..."></textarea>
                <button className="submit" disabled={loading} form="submitTaskForm" type="submit">Submit</button>
            </div>
        </form>
    );
}

export default NewComment;