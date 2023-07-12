import React, { useState, useEffect } from "react";
import GroupBar from "./GroupBar";
import { useAuth } from "../../authentication/AuthProvider";
import { db } from "../../authentication/config";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faSearch } from "@fortawesome/free-solid-svg-icons";
import AddGroupModal from "./AddGroupModal";
import SearchBar from "./SearchBar";
import NotificationContainer from "../notifications/NotificationContainer";
import FindGroupModal from "./FindGroupModal";

const AllGroups = () => {
  const history = useHistory();

  const { currentUser } = useAuth();

  const [allGroupsId, setAllGroupsId] = useState([]);

  const [allGroupsName, setAllGroupsName] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [show, setShow] = useState(false);

  const [showFindGroup, setShowFindGroup] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const handleCloseFindGroup = () => setShowFindGroup(false);

  const handleShowFindGroup = () => setShowFindGroup(true);

  const onClickHandle = (id) => {
    history.push("/groups/" + id);
  };

  useEffect(() => {
    let isMounted = true;
    async function getGroupIds() {
      try {
        const res = await db.collection("users").doc(currentUser.email).get();
        const data = res.data();
        if (data.groups_id.length > 0 && isMounted) {
          setAllGroupsId(data.groups_id);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    getGroupIds();

    return () => (isMounted = false);
  }, [show, currentUser]);

  useEffect(() => {
    let isMounted = true;
    async function getGroupNames() {
      try {
        if (allGroupsId.length > 0) {
          var allName = [];
          for (var i = 0; i < allGroupsId.length; i++) {
            const res = await db.collection("groups").doc(allGroupsId[i]).get();
            const data = res.data();
            allName.push(data.name);
          }
          if (isMounted) {
            setAllGroupsName(allName);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    getGroupNames();

    return () => (isMounted = false);
  }, [allGroupsId]);

  return (
    <div style={{ width: "100%", margin: "3vh 2vw" }}>
      <AddGroupModal
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
      />
      <FindGroupModal
        show={showFindGroup}
        handleClose={handleCloseFindGroup}
        handleShow={handleShowFindGroup}
      />
      <div className="flex main-header">
        <div className="groupName">Groups</div>
        <SearchBar value={searchTerm} setSearchTerm={setSearchTerm} />
        <div onClick={handleShow} title="Creat new group" className="icon">
          <FontAwesomeIcon icon={faPlusSquare} size="2x" />
        </div>
        <div onClick={handleShowFindGroup} title="Find group" className="icon">
          <FontAwesomeIcon icon={faSearch} size="2x" />
        </div>
        <NotificationContainer />
      </div>
      <br />
      {allGroupsName.length > 0 &&
        allGroupsName.map((name, index) => {
          if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return (
              <GroupBar
                name={name}
                onClick={onClickHandle}
                id={allGroupsId[index]}
                key={index}
              />
            );
          } else {
            return true;
          }
        })}
    </div>
  );
};

export default AllGroups;
