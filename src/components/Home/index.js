import React, { Component } from 'react';
import {
    withAuthorization,
    withEmailVerification,
} from '../Session';
import { compose } from 'recompose';
import Profile from '../Profile';
import Messages from '../Message';
import styles from './index.css';

const HomePage = () => (
    <div>
        <div className={styles.homeContainer}>
          <h1>Home Page</h1>
          <Messages />
        </div>
    </div>
);


const condition = authUser => !!authUser;

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(HomePage);
