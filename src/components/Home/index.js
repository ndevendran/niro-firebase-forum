import React, { Component } from 'react';
import {
    withAuthorization,
    withEmailVerification,
} from '../Session';
import { compose } from 'recompose';
import styles from './index.css';
import Profile from '../Profile';
import Messages from '../Message';

const HomePage = () => (
    <div className={styles.pageContainer}>
        <div className={styles.contentContainer}>
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
