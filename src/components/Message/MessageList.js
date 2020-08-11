import React, { Component } from 'react';
import MessageItem from './MessageItem.js';
import styles from './index.css';

const MessageList = ({
    messages, onRemoveMessage,
    onEditMessage, authUser }) => (
    <ul className="messageList">
        {messages.map(message => (
            <MessageItem
                key={message.uid}
                message={message}
                onRemoveMessage={onRemoveMessage}
                onEditMessage={onEditMessage}
                authUser={authUser}
            />
        ))}
    </ul>
);

export default MessageList;
