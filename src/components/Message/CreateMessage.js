import React, { Component } from 'react';
import Profile from '../Profile';
import styles from './index.css';
import { ButtonFlat } from '../../components/Button';
import { withFirebase } from '../Firebase';
import { withAuthentication } from '../Session';
import { withRouter } from 'react-router-dom';

class CreateMessage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      showCreateMessage: false,
      maxCharacters: 160,
      charactersLeft: 160,
      newMessage: null,
    };
  }

  onCreateMessage = (event) => {
      const key = this.props.firebase.writeMessage({
          text: this.state.text,
          userId: this.props.authUser.uid,
          profile_picture: this.props.authUser.profile_picture,
          username: this.props.authUser.username,
      });



      const that = this;
      this.props.firebase.message(key).once('value',
        function(snapshot) {
          const messageObject = snapshot.val();
          messageObject.uid = key;
          that.props.history.push({
            pathname: `comments/${key}`,
            state: { message: messageObject }
          });
        }
      );

      event.preventDefault();
  };

  onChangeText = event => {
    if(event.target.value.length > this.state.maxCharacters) {
      return;
    } else {
      this.setState({
        text: event.target.value,
        charactersLeft: this.state.maxCharacters-event.target.value.length,
      });
    }
  }

  render() {
    const { charactersLeft, newMessage } = this.state;

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
                <div> {charactersLeft} charactersLeft </div>
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

export default withRouter(withFirebase(CreateMessage));
