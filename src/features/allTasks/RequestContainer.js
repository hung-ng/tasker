import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { RiUserShared2Line } from "react-icons/ri"
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import './allTasks.css'
import firebase from 'firebase';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
        title="Join group requests"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        style={{ color: 'inherit', }}
        className='cursor'
    >
        {children}
        <RiUserShared2Line size="2em" />
    </span>
));

const CustomDiv = React.forwardRef(({ children, setJustAdded, setAcceptMember }, ref) => {

    const { group_id } = useParams()

    const acceptUser = async (e) => {
        e.preventDefault()
        try {
            const now = new Date()
            await db.collection("groups").doc(group_id).update({
                members_id: firebase.firestore.FieldValue.arrayUnion(children.email),
                requests: firebase.firestore.FieldValue.arrayRemove(children.email)
            })
            const res1 = await db.collection("groups").doc(group_id).get()
            const data = res1.data()
            const res = await db.collection("notifications").add({
                time: now,
                content: "Your request to join " + data.name + " was accepted",
                path: "/groups/" + group_id
            })
            await db.collection("users").doc(children.email).update({
                groups_id: firebase.firestore.FieldValue.arrayUnion(group_id),
                notifications: firebase.firestore.FieldValue.arrayUnion(res.id),
                unseen_notifications: true
            })
            setJustAdded(true)
            setAcceptMember(true)
        }
        catch (err) {
            console.log(err.message);
        }
    }

    return (
        <div ref={ref}
            style={{ width: "20vw" }}>
            <div className="flex requestContent">
                <div className="cursor" title={children.email}>{children.name}</div>
                <div className="cursor underlined" onClick={acceptUser}>Accept</div>
            </div>
        </div>
    )
})

const RequestContainer = (props) => {

    const [requestList, setRequestList] = useState([]);

    const { group_id } = useParams()

    const [justAdded, setJustAdded] = useState(false)

    useEffect(() => {
        async function getRequestsList() {
            try {
                const res = await db.collection('groups').doc(group_id).get()
                const requests = res.data().requests
                const objArr = []
                for (var i = 0; i < requests.length; i++) {
                    const res = await db.collection('users').doc(requests[i]).get()
                    objArr.push({
                        name: res.data().firstName + " " + res.data().lastName,
                        email: requests[i]
                    })
                }
                setRequestList(objArr)
                setJustAdded(false)
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getRequestsList()
    }, [group_id, justAdded])

    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
            <Dropdown.Menu style={{ overflow: "auto", maxHeight: "50vh" }}>
                {requestList.length === 0 && <div className="noRequest" >No pending requests</div>}
                {requestList.length > 0 && requestList.map(req => {
                    return <Dropdown.Item setAcceptMember={props.setAcceptMember} setJustAdded={setJustAdded} as={CustomDiv}>{req}</Dropdown.Item>
                })}
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default RequestContainer;