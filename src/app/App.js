import "./App.css";
import { Route, Switch } from "react-router-dom";
import { AuthProvider } from "../authentication/AuthProvider";
import LogIn from "../user/LogIn";
import SignUp from "../user/SignUp";
import ForgotPassword from "../user/ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import Main from "../features/Main";

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route exact path="/login/:email?/:password?" component={LogIn} />
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <PrivateRoute path="/" component={Main} />
      </Switch>
    </AuthProvider>
  );
}

export default App;
