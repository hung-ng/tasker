import React from 'react';
import NavBar from '../features/navBar/NavBar';
import Profile from '../features/profile/Profile';
import { Route, Switch } from 'react-router-dom'
import AllGroups from '../features/allGroups/AllGroups';
import AllTasks from '../features/allTasks/AllTasks';
import Task from '../features/oneTask/Task';

const Main = () => {
    return (
        <div className="flex" style={{ width: "100%" }}>
            <NavBar />
            <Switch>
                <Route path="/profile" component={Profile} />
                <Route path="/groups/:group_id/tasks/:task_id" component={Task} />
                {/* <Route path="/groups/:group_id/createtasks" component={} /> */}
                <Route path="/groups/:group_id" component={AllTasks} />
                <Route exact path="/groups" component={AllGroups} />
            </Switch>
        </div>
    )
}

export default Main;