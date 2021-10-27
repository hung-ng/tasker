import './App.css';
import { Route, Switch } from 'react-router-dom';
import { AuthProvider } from '../firebase/Auth';
import LogIn from '../containers/LogIn';
import SignUp from '../containers/SignUp';
import PrivateRoute from './PrivateRoute';
import Main from '../containers/Main';
import ForgotPassword from '../containers/ForgotPassword';

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route exact path="/login/:email?/:password?" component={LogIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <PrivateRoute path="/" component={Main} />
      </Switch>
    </AuthProvider>
  );
}

export default App;