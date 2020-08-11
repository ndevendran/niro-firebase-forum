import React from 'react';
import styles from './index.css';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) =>
(
    <button className={styles.btn_signout} type="button" onClick={firebase.doSignOut}>
        Sign Out
    </button>
);

export default withFirebase(SignOutButton);
