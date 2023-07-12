import React from "react";
import NavBar from "./navBar/NavBar";
import Profile from "./profile/Profile";
import { Route, Switch } from "react-router-dom";
import AllGroups from "./allGroups/AllGroups";
import AllTasks from "./allTasks/AllTasks";
import Task from "./oneTask/Task";

const Main = () => {
  return (
    <div className="flex" style={{ width: "100%" }}>
      <NavBar />
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/groups/:group_id/tasks/:task_id" component={Task} />
        <Route path="/groups/:group_id" component={AllTasks} />
        <Route exact path="/groups" component={AllGroups} />
      </Switch>
    </div>
  );
};

export default Main;
