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

  onToggleCreate = () => {
    if(this.state.showCreateMessage) {
      this.refs.createMessage.style.display = "none";
    } else {
      this.refs.createMessage.style.display = "flex";
    }

    this.setState((prevState, props) => ({
      showCreateMessage: !prevState.showCreateMessage,
    }));
  }


  render() {
    return (
        <div className={styles.createContainer} ref='createMessage'>
          <div className={styles.avatarContainer}>
            <Profile />
          </div>
          <div className={styles.createBody}>
            <form onSubmit={this.onCreateMessage}>
                <textarea
                    rows="6"
                    cols="40"
                    type="text"
                    value={this.state.text}
                    onChange={this.onChangeText}
                />
              <div className={styles.createFooter}>
                <div>Format Placeholder</div>
                <ButtonFlat type="submit">Send</ButtonFlat>
              </div>
            </form>
          </div>
        </div>
    );
  }
}

export default withFirebase(CreateMessage);
