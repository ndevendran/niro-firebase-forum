import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import TrapezoidTabs from './TrapezoidTabs.js';

import SignOutButton from '../SignOut';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser => authUser ? <NavigationAuth authUser={authUser} /> :
                <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = ({ authUser }) => (
        <ul className="navigation">
            <TrapezoidTabs link={ROUTES.LANDING}>Landing</TrapezoidTabs>
            <TrapezoidTabs link={ROUTES.HOME}>Home</TrapezoidTabs>
            <TrapezoidTabs link={ROUTES.ACCOUNT}>Account</TrapezoidTabs>
            {authUser.roles[ROLES.ADMIN] && (
                <TrapezoidTabs link={ROUTES.ADMIN}>Admin</TrapezoidTabs>
            )}

            <li>
                <SignOutButton />
            </li>
        </ul>
);

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
  <ul className="profileNav">
    <li>
      <span className="menuItem">
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password</Link>
      </span>
      <span className="menuItem">
        <Link to={ROUTES.PASSWORD_CHANGE}>Change Password</Link>
      </span>
      <span className="menuItem">
        <Link to={ROUTES.SIGN_IN_METHODS}>Sign In Methods</Link>
      </span>
    </li>
  </ul>
);

export default Navigation;
