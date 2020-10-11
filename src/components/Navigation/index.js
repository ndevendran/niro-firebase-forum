import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import TrapezoidTabs from './TrapezoidTabs.js';

import SignOutButton from '../SignOut';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import styles from './index.css';

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser => authUser ? <NavigationAuth authUser={authUser} /> :
                <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

class NavigationAuth extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    const authUser = this.props.authUser;
    return (
      <>
        <ul className={styles.authNav}>
            <li className={styles.navItem}>
              <span>
                <Link to={ROUTES.LANDING} id={styles.landingMainNav}>
                  <span className={styles.icon}>news</span>
                </Link>
              </span>
            </li>
            <li className={styles.navItem}>
              <span>
                <Link to={ROUTES.HOME} id={styles.homeMainNav}>
                  <span className={styles.icon}>home3</span>
                </Link>
              </span>
            </li>
            <li className={styles.navItem}>
              <span>
                <Link to={ROUTES.ACCOUNT} id={styles.userMainNav}>
                  <span className={styles.icon}>user</span>
                </Link>
              </span>
            </li>
            {authUser.roles[ROLES.ADMIN] && (
              <li className={styles.navItem}>
                <span>
                  <span className={styles.icon}>admin</span>
                  <Link to={ROUTES.ADMIN} id="adminMainNav">Admin</Link>
                </span>
              </li>
            )}
            <li className={styles.navItem} id={styles.listMainNav}>
              <span className={styles.icon}>list</span>
            </li>
            <li className={styles.navItem} id={styles.messagesMainNav}>
              <span className={styles.icon}>envelop</span>
            </li>
            <li className={styles.navItem} id={styles.bookmarksMainNav}>
              <span className={styles.icon}>bookmark</span>
            </li>
            <li className={styles.navItem}>
                <span className={styles.icon}>signout</span>
                <SignOutButton />
            </li>

        </ul>
      </>
    );
  }
}


const NavigationNonAuth = () => (
        <ul>
            <li>
                <Link to={ROUTES.SIGN_IN}>Sign In</Link>
            </li>
            <li>
                <Link to={ROUTES.LANDING}>Landing</Link>
            </li>
            <li>
                <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
            </li>
        </ul>
);

export const NavigationAccount = () => (
  <ul>
    <li>
      <span>
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password</Link>
      </span>
    </li>
    <li>
      <span>
        <Link to={ROUTES.PASSWORD_CHANGE}>Change Password</Link>
      </span>
    </li>
    <li>
      <span>
        <Link to={ROUTES.SIGN_IN_METHODS}>Sign In Methods</Link>
      </span>
    </li>
  </ul>
);

export default Navigation;
