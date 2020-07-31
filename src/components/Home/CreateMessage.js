import React from 'react';
import Profile from '../Profile';
import './create_message.css';
import { ButtonFlat } from '../../components/Button';

const CreateMessage = ({ onCreateMessage, authUser, onChangeText, text }) => {
  return (
    <div className="createMessageContainer">
      <Profile />
      <form className="createMessage" onSubmit={onCreateMessage}>
        <div className="body">
          <textarea
              rows="6"
              cols="40"
              type="text"
              value={text}
              onChange={onChangeText}
          />
        </div>
        <div className="footer">
          <div className="formatMessage">Format Placeholder</div>
          <ButtonFlat className="sendMessageBtn" type="submit">Send</ButtonFlat>
        </div>
      </form>
    </div>
  );
}

export default CreateMessage;
