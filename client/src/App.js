import { Home, Login, Signup, ResetPassword } from "./components/pages";
import { Switch, Route } from "react-router-dom";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/signup" exact>
          <Signup />
        </Route>
        <Route path="/resetPassword" exact>
          <ResetPassword />
        </Route>
      </Switch>
    </div>
  );
}
