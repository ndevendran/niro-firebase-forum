import React, { Component } from 'react';
import Avatar from '../../images/avatar_test_02.jpg';
import './index.css';

class Profile extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return(
            <div className="profile_picture">
                <img className="avatar" src={Avatar} alt="profile picture" />
            </div>
        )
    }
}

export default Profile;