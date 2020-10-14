import React, { Component } from 'react';
import MessageItem from './MessageItem.js';
import styles from './index.css';
import { Switch, Route, Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const MessageList = ({
    messages, onRemoveMessage,
    onEditMessage, onLikeMessage,
    toggleCreateComment, setActiveMessage,
    authUser, users, basePath, depth }) => (
    <>
    <ul className={styles.messageList}>
        {messages.map(message => (
            <li key={message.uid}>
            <Link to={{pathname: `${ROUTES.COMMENTS}/${message.uid}`, state: { message, depth, basePath, users },}}>
              <MessageItem
                  key={message.uid}
                  message={message}
                  authUser={authUser}
                  users={users}
                  toggleCreateComment={toggleCreateComment}
                  setActiveMessage={setActiveMessage}
                  depth={depth}
              />
            </Link>
            </li>
        ))}
    </ul>
    </>
);

export default MessageList;
