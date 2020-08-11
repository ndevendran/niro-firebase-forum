import React from 'react';
import Profile from '../Profile';
import styles from './create_message.css';
import { ButtonFlat } from '../../components/Button';

const CreateMessage = ({ onCreateMessage, authUser, onChangeText, text }) => {
  return (
    <div className={styles.createMessageContainer}>
      <Profile />
      <form className={styles.createMessage} onSubmit={onCreateMessage}>
        <div className={styles.body}>
          <textarea
              rows="6"
              cols="40"
              type="text"
              value={text}
              onChange={onChangeText}
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

export default CreateMessage;
