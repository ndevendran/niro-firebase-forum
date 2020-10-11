import React from 'react';
import Button, { SVGEdit, SVGDelete, SVGLike } from '../Button';
import styles from './index.css';


const MessagePresentation = ({ message,
  onRemoveMessage, onToggleEditMode,
  onLikeMessage, authUser }) => {
  return (
    <>
      <div className={styles.messageHeader}>
          <strong>{message.userId}</strong>
      </div>
      <div className={styles.messageBody}>
        {message.text}
        {message.editedAt && <span> (Edited)</span>}
      </div>
      <div className={styles.messageFunctions}>
        <div>
          <span>
            <span className={styles.icon}>heart</span>
          </span>
        </div>
        <div></div>
        <div>
          {authUser.uid === message.userId && (
              <span>
                <span className={styles.icon}
                  onClick={onRemoveMessage}>bin
                </span>
                <span className={styles.icon}
                  onClick={onToggleEditMode}>pencil
                </span>
              </span>
          )}
        </div>
      </div>
    </>
  );
}

export default MessagePresentation;
