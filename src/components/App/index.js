import React from 'react';
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
import { CreateMessage } from '../Message'
import { withAuthentication, AuthUserContext } from '../Session';

import * as ROUTES from '../../constants/routes';

const App = () => (
    <Router>
        <div className={styles.fullPage}>
            <header>
              <div className={styles.flexNavigation}>
                <div>
                  <div className={styles.toggleCreate}><Link to={ROUTES.MESSAGE}>Msg</Link></div>
                </div>
                <div>
                  <Navigation />
                </div>
              </div>
            </header>
            <main>
            <AuthUserContext.Consumer>
            {authUser => (
              <Route path={ROUTES.MESSAGE} component={()=><CreateMessage authUser={authUser}/>}/>
            )}
            </AuthUserContext.Consumer>
              <Route exact path={ROUTES.LANDING} component={LandingPage} />
              <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
              <Route path={ROUTES.SIGN_IN} component={SignInPage} />
              <Route path={ROUTES.HOME} component={HomePage} />
              <Route path={ROUTES.ACCOUNT} component={AccountPage} />
              <Route path={ROUTES.ADMIN} component={AdminPage} />
            </main>
            <footer>Icons made by <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry
              </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
            </footer>
        </div>
    </Router>
);

export default withAuthentication(App);
