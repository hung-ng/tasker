import React from "react";
import './allTasks.css'

const TaskBar = (props) => {

    const getTaskDetails = () => {
        props.onClick(props.id)
    }

    return (
        <div className="hover flex task-bar" onClick={getTaskDetails}>
            <div className="taskName">
                {props.name}
            </div>
            <div>
                Deadline: {props.deadline}
            </div>
        </div>
    )
}

export default TaskBar;