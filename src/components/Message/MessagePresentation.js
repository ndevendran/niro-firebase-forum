import React from 'react';
import Button, { SVGEdit, SVGDelete, SVGLike } from '../Button';
import styles from './index.css';


const MessagePresentation = ({ message,
  onRemoveMessage, onToggleEditMode,
  onLikeMessage, toggleCreateComment,
  authUser, setActiveMessage,
  commentCount }) => {
  return (
    <>
      <div className={styles.messageHeader}>
          <strong>{message.username || 'Anonymous'}</strong>
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
            (true) && (
              <span className={styles.icon} onClick={toggleCreateComment}>
                bubble
              </span>
            )}
            {message.commentCount}
        </div>
        <div>

        </div>
        <div>
          {authUser.uid === message.userId && (
              <span>
                <span className={styles.icon}
                  onClick={onRemoveMessage}>
                  bin
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
