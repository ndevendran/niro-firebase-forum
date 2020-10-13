import React, { Component } from 'react';
import { ButtonFlat } from '../Button';
import Profile from '../Profile';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import styles from './index.css';
import messageStyles from '../Message/index.css';

class CreateCommentBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  componentDidMount() {
    console.log(this.props.authUser);
  }

  render() {
    return (
      <div className={styles.createComment}>
        <div className={messageStyles.avatarContainer}>
          <Profile url={this.props.authUser.profile_picture} />
        </div>
        <div>
          <div className={styles.reply}>Your reply...</div>
          <div className={messageStyles.createFooter}>
            <div>Format Options</div>
            <div className={messageStyles.sendButton}>
              <ButtonFlat>Send</ButtonFlat>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateCommentBase;
