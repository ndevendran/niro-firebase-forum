import React, { Component } from 'react';
import App from '../App';
import { AuthUserContext } from '../Session';
import { Redirect, BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import SignInPage from '../SignIn';


class FrontPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
      <AuthUserContext.Consumer>
      {
        authUser => {
          if (!authUser) {

            return <Redirect to={ROUTES.SIGN_IN} />
          }
          else {
            return <App />
          }
        }
      }
      </AuthUserContext.Consumer>
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      </Router>
    );
  }
}

export default FrontPage;
