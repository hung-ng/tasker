import React from "react";
import "./allGroups.css";

const GroupBar = (props) => {
  const getGroupDetails = () => {
    props.onClick(props.id);
  };

  return (
    <div className="hover group-bar" onClick={getGroupDetails}>
      {props.name}
    </div>
  );
};

export default GroupBar;
