import React, { Component } from 'react';
import EditMessageForm from './EditMessageForm.js';
import MessagePresentation from './MessagePresentation.js';
import Profile from '../Profile';
import styles from './index.css';

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
        this.props.onEditMessage(this.props.message, this.state.editText);

        this.setState({ editMode: false });
    };

    onRemoveMessage = () => {
      this.props.onRemoveMessage(this.props.message.uid);
    }

    render() {
        const { authUser, message, onRemoveMessage } = this.props;
        const { editMode, editText } = this.state;

        return (
            <li className={styles.container}>
              <div className={styles.avatarContainer}>
                <Profile />
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
                />
              )}
              </div>
            </li>
        );
    }
}

export default MessageItem;
