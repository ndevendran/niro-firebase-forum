import React, { Component } from 'react';
import MessageItem from './MessageItem.js';
import styles from './index.css';
import { Switch, Route, Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const MessageList = ({
    messages, onRemoveMessage,
    onEditMessage, onLikeMessage,
    toggleCreateComment, setActiveMessage,
    authUser, users}) => (
    <>
    <ul className={styles.messageList}>
        { messages.map(message => {
            if(!message.parentId) {
              return (
                <li key={message.uid}>
                  <MessageItem
                      key={message.uid}
                      message={message}
                      authUser={authUser}
                      toggleCreateComment={toggleCreateComment}
                      setActiveMessage={setActiveMessage}
                      users={users}
                  />
                </li>
              )
            }
        })}
    </ul>
    </>
);

export default MessageList;
