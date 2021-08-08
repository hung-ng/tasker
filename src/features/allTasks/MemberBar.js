import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../firebase/Auth';
import { db } from '../../firebase/config';
import firebase from 'firebase';

const MemberBar = (props) => {

    const { group_id } = useParams()

    const { currentUser } = useAuth()

    const handleOnclick = (e) => {
        e.preventDefault();
        if (currentUser == props.creator_id) {
            var cf = window.confirm("Remove this member?")
            if (cf == true) {
                removeUser()
            }
        } else {
            alert("You don't have permission to remove this group's members")
        }

    }

    const removeUser = async () => {
        await db.collection("groups").doc(group_id).update({
            members_id: firebase.firestore.FieldValue.arrayRemove(props.id)
        })
        await db.collection("users").doc(props.id).update({
            groups_id: firebase.firestore.FieldValue.arrayRemove(group_id)
        })
        props.status(true)
    }

    return (
        <div className="flex">
            <div className="memberBar">{props.id}</div>
            <div onClick={handleOnclick} className="removeUser">Remove</div>
        </div>
    )
}

export default MemberBar;