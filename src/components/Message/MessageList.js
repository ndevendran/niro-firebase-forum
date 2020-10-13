import React, { Component } from 'react';
import MessageItem from './MessageItem.js';
import styles from './index.css';

const MessageList = ({
    messages, onRemoveMessage,
    onEditMessage, onLikeMessage, authUser, users }) => (
    <ul className={styles.messageList}>
        {messages.map(message => (
            <MessageItem
                key={message.uid}
                message={message}
                onRemoveMessage={onRemoveMessage}
                onEditMessage={onEditMessage}
                onLikeMessage={onLikeMessage}
                authUser={authUser}
                users={users}
            />
        ))}
    </ul>
);

export default MessageList;
