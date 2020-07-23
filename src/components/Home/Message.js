import React from 'react';
import Button from '../Button';


const Message = ({ message, onRemoveMessage, onToggleEditMode, authUser }) => {
  return (
    <>
      <div className="cut_corners messageHeader">
          <strong>{message.userId}</strong>
      </div>
      <div className="messageBody">
        {message.text}
      </div>
      <div className="messageFooter">
        <div className="header">{message.editedAt && <span> (Edited)</span>}</div>
        <div className="body"></div>
        <div className="footer">
          {authUser.uid === message.userId && (
              <span>
                <Button
                    type="button"
                    onClick={() => onRemoveMessage(message.uid)}
                >
                    Delete
                </Button>
                <Button onClick={onToggleEditMode}>Edit</Button>
              </span>
          )}
        </div>
      </div>
    </>
  );
}

export default Message;
