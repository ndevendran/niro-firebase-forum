import React, { Component } from 'react';
import Profile from '../Profile';
import styles from './create_message.css';
import { ButtonFlat } from '../../components/Button';
import { withFirebase } from '../Firebase';

class CreateMessage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: '',
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
      <div className={styles.createMessageContainer}>
        <Profile />
        <form className={styles.createMessage} onSubmit={this.onCreateMessage}>
          <div className={styles.body}>
            <textarea
                rows="6"
                cols="40"
                type="text"
                value={this.state.text}
                onChange={this.onChangeText}
            />
          </div>
          <div className={styles.footer}>
            <div className={styles.formatMessage}>Format Placeholder</div>
            <ButtonFlat className={styles.sendMessageBtn} type="submit">Send</ButtonFlat>
          </div>
        </form>
      </div>
    );
  }
}

export default withFirebase(CreateMessage);
