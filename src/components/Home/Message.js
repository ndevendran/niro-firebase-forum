import React from 'react';
import Button, { SVGEdit, SVGDelete, SVGLike } from '../Button';
import styles from './index.css';


const MessagePresentation = ({ message,
  onRemoveMessage, onToggleEditMode,
  onLikeMessage, authUser }) => {
  return (
    <>
      <div>
          <strong>{message.userId}</strong>
      </div>
      <div>
        {message.text}
        {message.editedAt && <span> (Edited)</span>}
      </div>
      <div
        <div>
          <span>
            <SVGLike>Like</SVGLike>
          </span>
        </div>
        <div></div>
        <div>
          {authUser.uid === message.userId && (
              <span>
                <SVGDelete onClick={onRemoveMessage}>Delete</SVGDelete>
                <SVGEdit onClick={onToggleEditMode}>Edit</SVGEdit>
              </span>
          )}
        </div>
      </div>
    </>
  );
}

export default MessagePresentation;
