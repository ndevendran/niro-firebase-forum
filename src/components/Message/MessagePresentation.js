import React from 'react';
import Button, { SVGEdit, SVGDelete, SVGLike } from '../Button';
import styles from './index.css';
import * as ROUTES from '../../constants/routes';
import { Switch, Route, Link } from 'react-router-dom';


const MessagePresentation = ({ message,
  onRemoveMessage, onToggleEditMode,
  onLikeMessage, toggleCreateComment,
  authUser, setActiveMessage,
  commentCount, users }) => {
  return (
    <>
      <div className={styles.messageHeader}>
          <strong>{message.username || 'Anonymous'}</strong>
      </div>
      <div className={styles.messageBody}>
      <Link to={{pathname: `${ROUTES.COMMENTS}/${message.uid}`,
        state: { message, users },}}
      >
        {message.text}
        {message.editedAt && <span> (Edited)</span>}
      </Link>
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
