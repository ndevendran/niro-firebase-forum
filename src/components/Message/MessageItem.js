import React, { Component } from 'react';
import EditMessageForm from './EditMessageForm.js';
import MessagePresentation from './MessagePresentation.js';
import Profile from '../Profile';
import styles from './index.css';
import { withFirebase } from '../Firebase';

class MessageItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            editText: this.props.message.text,
        };

    }

    onToggleEditMode = () => {
        this.setState(state => ({
            editMode: !state.editMode,
            editText: this.props.message.text,
        }));
    };

    onChangeEditText = event => {
        this.setState({ editText: event.target.value });
    }

    onSaveEditText = () => {
        this.onEditMessage(this.props.message, this.state.editText);

        this.setState({ editMode: false });
    };

    onEditMessage = (message, text) => {
        const { uid, ...messageSnapshot } = message;

        if(messageSnapshot.parentId) {
          this.props.firebase.comment(uid).set({
            ...messageSnapshot,
            text,
            editedAt: this.props.firebase.serverValue.TIMESTAMP,
          });
        } else {
          this.props.firebase.message(uid).set({
              ...messageSnapshot,
              text,
              editedAt: this.props.firebase.serverValue.TIMESTAMP,
          });
        }
    };

    onRemoveMessage = () => {
        const { uid, ...messageSnapshot } = this.props.message;
        console.log(uid);

        if(messageSnapshot.parentId) {
          this.props.firebase.comment(uid).set({
            ...messageSnapshot,
            text: 'This comment has been deleted',
            editedAt: this.props.firebase.serverValue.TIMESTAMP,
          });
        }
        else {
          this.props.firebase.message(uid).set({
            ...messageSnapshot,
            text: 'This message has been deleted',
            editedAt: this.props.firebase.serverValue.TIMESTAMP,
          });
        }
    };

    onLikeMessage = () => {
      const message = this.props.message;
      const user = this.props.authUser;
      if(message.userId === user.uid){
        return;
      }


      let likes;
      if(!message.likes){
        likes = {};
        likes.members = {};
        likes.members[user.uid] = true;
        likes.count = 1;

        message.likes = likes;
      } else if(message.likes && (!message.likes.members || !message.likes.members[user.uid])){
        likes = message.likes;
        if(!likes.members) {
          likes.members = {};
        }
        likes.members[user.uid] = true;
        likes.count = likes.count + 1;
        message.likes = likes;
      } else if(message.likes && message.likes.members[user.uid]){
        likes = message.likes;
        delete likes.members[user.uid];
        likes.count = likes.count - 1;
        if(likes.count === 0)
          message.likes = null;
        else
          message.likes = likes;
      }

      this.props.firebase.message(message.uid).set({
        ...message
      });

      return message;
    }

    onToggleCreateComment = () => {
      this.props.setActiveMessage(this.props.message);
      this.props.toggleCreateComment();
    }

    render() {
        const { authUser, message, depth, commentCount } = this.props;
        const { editMode, editText } = this.state;

        return (
            <div className={styles.container}>
              <div className={styles.avatarContainer}>
                <Profile url={message.profile_picture}/>
              </div>
              <div className={styles.messageContainer}>
              {editMode ? (
                <EditMessageForm
                  message={message} onChangeEditText={this.onChangeEditText}
                  onSaveEditText={this.onSaveEditText} onToggleEditMode={this.onToggleEditMode}
                  editText={editText}
                />
              ) : (
                <MessagePresentation
                  message={message} onRemoveMessage={this.onRemoveMessage}
                  onToggleEditMode={this.onToggleEditMode} authUser={authUser}
                  onLikeMessage={this.onLikeMessage}
                  toggleCreateComment={this.onToggleCreateComment}
                />
              )}
              </div>
            </div>
        );
    }
}

export default withFirebase(MessageItem);
