import React from 'react';
import Profile from '../Profile';
import './create_message.css';

const CreateMessage = ({ onCreateMessage, authUser, onChangeText, text }) => {
  return (
    <div className="createMessageContainer">
      <Profile />
      <form className="createMessage" onSubmit={event => onCreateMessage(event, authUser)}>
        <div className="header">
          <strong>Create New Message</strong>
        </div>
        <div className="body">
          <textarea
              rows="6"
              cols="50"
              className="createMessageInput"
              type="text"
              value={text}
              onChange={onChangeText}
          />
        </div>
        <div className="footer">
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}

export default CreateMessage;
