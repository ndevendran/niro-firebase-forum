import React, { Component } from 'react';
import Profile from '../Profile';
import styles from './index.css';
import { ButtonFlat } from '../../components/Button';
import { withFirebase } from '../Firebase';
import { withAuthentication } from '../Session';

class CreateMessage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      showCreateMessage: false,
    };
  }

  onCreateMessage = (event) => {
      this.props.firebase.messages().push({
          text: this.state.text,
          userId: this.props.authUser.uid,
          createdAt: this.props.firebase.serverValue.TIMESTAMP,
      });

      this.setState({ text: '' });

      event.preventDefault();
  };

  onChangeText = event => {
      this.setState({ text: event.target.value });
  }


  render() {
    return (
        <div className={styles.container} ref='createMessage'>
          <div className={styles.avatarContainer}>
            <Profile url={this.props.authUser.profile_picture}/>
          </div>
          <div className={styles.messageContainer}>
            <form onSubmit={this.onCreateMessage}>
                <textarea
                    rows="6"
                    cols="60"
                    type="text"
                    value={this.state.text}
                    onChange={this.onChangeText}
                />
              <div className={styles.createFooter}>
                <div>Format Placeholder</div>
                <div className={styles.sendButton}>
                  <ButtonFlat type="submit">Send</ButtonFlat>
                </div>
              </div>
            </form>
          </div>
        </div>
    );
  }
}

export default withFirebase(CreateMessage);
