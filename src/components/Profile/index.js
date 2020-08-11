import React, { Component } from 'react';
import Avatar from '../../images/avatar_test_02.jpg';
import styles from './index.css';

class Profile extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return(
            <div className={styles.profile_picture}>
                <img className={styles.avatar} src={Avatar} alt="profile picture" />
            </div>
        )
    }
}

export default Profile;
