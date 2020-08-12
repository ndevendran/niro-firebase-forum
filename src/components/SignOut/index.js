import React from 'react';
import styles from './index.css';
import { ButtonPop } from '../Button';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) =>
(
    <ButtonPop type="button" onClick={firebase.doSignOut}>
        Sign Out
    </ButtonPop>
);

export default withFirebase(SignOutButton);
