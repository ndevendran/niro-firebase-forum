import React from 'react';
import './index.css';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) =>
(
    <button className="btn_signout" type="button" onClick={firebase.doSignOut}>
        Sign Out
    </button>
);

export default withFirebase(SignOutButton);
