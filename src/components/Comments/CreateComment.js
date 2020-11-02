import React, { Component } from 'react';
import { ButtonFlat } from '../Button';
import Profile from '../Profile';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Redirect } from 'react-router-dom';
import styles from './index.css';
import messageStyles from '../Message/index.css';

class CreateCommentBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      maxCharacters: 160,
      charactersLeft: 160,
      redirect: false,
    };
  }

  onChange = event => {
    if(event.target.value.length > this.state.maxCharacters)
      return;
    else {
      const charactersLeft = this.state.maxCharacters - event.target.value.length;
      this.setState({
        text: event.target.value,
        charactersLeft: charactersLeft,
      });
    }
  }

  onCreateComment = () => {
    const activeMessage = this.props.getActiveMessage();
    this.props.firebase.writeComment({
      text: this.state.text,
      userId: this.props.authUser.uid,
      username: this.props.authUser.username,
      profile_picture: this.props.authUser.profile_picture,
    }, activeMessage.uid);

    this.setState({ text: '', redirect: true});
    this.props.toggleCreateComment();
  }

  render() {
    const { messageMaxCharacters, charactersLeft, redirect } = this.state;
    const activeMessage = this.props.getActiveMessage();
    const { users } = this.props;
    if(redirect) {
      return (
        <Redirect
          to={{
            pathname: `/comments/${activeMessage.uid}`,
            state: { message: activeMessage,
              users: users,
            }
          }}
        />
      );
    }
    return (
      <div className={styles.createComment}>
        <div className={messageStyles.avatarContainer}>
          <Profile url={this.props.authUser.profile_picture} />
        </div>
        <div>
            <textarea
                rows="6"
                cols="60"
                type="text"
                value={this.state.text}
                onChange={this.onChange}
            />
          <div className={messageStyles.createFooter}>
            <div className={styles.commentCharsLeft}>{charactersLeft} characters left</div>
            <div className={messageStyles.sendButton}>
              <ButtonFlat onClick={this.onCreateComment}>Send</ButtonFlat>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withFirebase(CreateCommentBase);
