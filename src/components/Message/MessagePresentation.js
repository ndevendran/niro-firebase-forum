import React from 'react';
import Button, { SVGEdit, SVGDelete, SVGLike } from '../Button';
import styles from './index.css';


const MessagePresentation = ({ message,
  onRemoveMessage, onToggleEditMode,
  onLikeMessage, toggleCreateComment, authUser, setActiveMessage, depth }) => {
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
          <span className={styles.messageLikes}>
            {(message.likes && message.likes.members && message.likes.members[authUser.uid])
              || (message.userId === authUser.uid)
                ? (
                <span className={styles.icon} onClick={onLikeMessage}>
                  heart
                </span>
              ) : (
                <span className={styles.icon} onClick={onLikeMessage}>
                  heart-broken
                </span>
            )}
            {message.likes && message.likes.count}
          </span>
          {
            (depth < 5) && (
              <span className={styles.icon} onClick={() => toggleCreateComment(event, message.uid)}>
                bubble
              </span>
            )
          }
        </div>
        <div>

        </div>
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
