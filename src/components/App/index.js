import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './reset.css';
import styles from './index.css';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import Promotional from '../Promotional';
import { CreateMessage } from '../Message';
import { withAuthentication, AuthUserContext } from '../Session';
import QuillIcon from '../../images/008-quill.svg';

import * as ROUTES from '../../constants/routes';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayCreateMessage: false,
    };
  }

  onToggleCreateMessageLightbox = () => {
    this.setState((prevState) => ({
      displayCreateMessage: !prevState.displayCreateMessage,
    }));
  }



  render() {
    return (
      <Router>
          <div className={styles.fullPage}>
              <header>
                <div className={styles.flexNavigation}>
                  <div className={styles.toggleCreate} onClick={this.onToggleCreateMessageLightbox}>
                      power
                  </div>
                  <div className={styles.innerNav}>
                    <Navigation />
                  </div>
                </div>
              </header>
              <main>
              <AuthUserContext.Consumer>
              {authUser => (
                <>
                {
                  this.state.displayCreateMessage &&
                  <>
                    <div className={styles.overlay} onClick={this.onToggleCreateMessageLightbox}>
                    </div>
                    <div className={styles.createMessageLightbox}>
                      <CreateMessage authUser={authUser} />
                    </div>
                  </>
                }
                <Route path={ROUTES.MESSAGE} component={()=><CreateMessage authUser={authUser}/>}/>
                </>
              )}
              </AuthUserContext.Consumer>
                  <Route exact path={ROUTES.LANDING} component={LandingPage} />
                  <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                  <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                  <Route path={ROUTES.HOME} component={HomePage} />
                  <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                  <Route path={ROUTES.ADMIN} component={AdminPage} />
                <aside>
                  <Promotional />
                </aside>
              </main>

          </div>
      </Router>
    );
  }
}

export default withAuthentication(App);
