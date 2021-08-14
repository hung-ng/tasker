import React, { useState, useEffect } from 'react';
import GroupBar from './GroupBar';
import { useAuth } from '../../firebase/Auth';
import { db } from '../../firebase/config';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import AddGroupModal from './AddGroupModal';
import SearchBar from './SearchBar';


const AllGroups = () => {

    const history = useHistory()

    const { currentUser } = useAuth()

    const [allGroupsId, setAllGroupsId] = useState([])

    const [allGroupsName, setAllGroupsName] = useState([])

    const [searchTerm, setSearchTerm] = useState("")

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);


    const onClickHandle = (id) => {
        history.push("/groups/" + id)
    }

    useEffect(() => {
        async function getGroupIds() {
            try {
                const res = await db.collection('users').doc(currentUser).get();
                const data = res.data()
                if (data.groups_id.length > 0) {
                    setAllGroupsId(data.groups_id);
                }
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getGroupIds()
    }, [show, currentUser])

    useEffect(() => {
        async function getGroupNames() {
            try {
                if (allGroupsId.length > 0) {
                    var allName = []
                    for (var i = 0; i < allGroupsId.length; i++) {
                        const res = await db.collection("groups").doc(allGroupsId[i]).get();
                        const data = res.data();
                        allName.push(data.name)
                    }
                    setAllGroupsName(allName)
                }
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getGroupNames()
    }, [allGroupsId])

    return (
        <div style={{ width: "100%", margin: "20px 40px" }}>
            <AddGroupModal show={show} handleClose={handleClose} handleShow={handleShow} />
            <div className="flex allgroups-header">
                <div className="groupName">Groups</div>
                <SearchBar value={searchTerm} setSearchTerm={setSearchTerm} />
                <div onClick={handleShow} title="Creat new group" className="icon"><FontAwesomeIcon icon={faPlusSquare} size="2x" /></div>
            </div>
            <br />
            {allGroupsName.length > 0 && allGroupsName
            .map((name, index) => {
                if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return <GroupBar name={name} onClick={onClickHandle} id={allGroupsId[index]} />
                } else{
                    return true
                }
            })}
        </div>
    )
}

export default AllGroups;