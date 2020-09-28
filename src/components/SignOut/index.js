import React from 'react';
import styles from './index.css';
import { ButtonPop } from '../Button';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) =>
(
    <ButtonPop type="button" onClick={firebase.doSignOut}>
        signout
    </ButtonPop>
);

export default withFirebase(SignOutButton);
