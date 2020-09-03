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
    this.state = {
      menuOpen: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState(prevState => ({
      menuOpen: !prevState.menuOpen
    }));
  }

  render() {
    const authUser = this.props.authUser;
    return (
      <>
        <ul className={styles.authNav}>
            <li className={styles.navItem}>
              <span>
                <Link to={ROUTES.LANDING}>Land</Link>
              </span>
            </li>
            <li className={styles.navItem}>
              <span>
                <Link to={ROUTES.HOME}>Home</Link>
              </span>
            </li>
            <li className={styles.navItem}>
              <span>
                <Link to={ROUTES.ACCOUNT}>User</Link>
              </span>
            </li>
            {authUser.roles[ROLES.ADMIN] && (
              <li className={styles.navItem}>
                <span>
                  <Link to={ROUTES.ADMIN}>Admin</Link>
                </span>
              </li>
            )}
            <li className={styles.navItem}>
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
