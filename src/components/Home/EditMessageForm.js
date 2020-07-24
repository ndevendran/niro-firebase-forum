import React from 'react';
import Button from '../Button';

const EditMessageForm = ({ message, onChangeEditText, onSaveEditText, onToggleEditMode, editText }) => {
  return (
    <>
      <div className="cut_corners messageHeader">
        <strong>{message.userId}</strong>
      </div>
      <div className="messageBody">
        <input
            type="text"
            value={editText}
            onChange={onChangeEditText}
        />
      </div>
      <div className="messageFooter">
        <div className="header">{message.editedAt && <span> (Edited)</span>}</div>
        <div className="body"></div>
        <div className="footer">
          <span>
              <Button onClick={onSaveEditText}>Save</Button>
              <Button onClick={onToggleEditMode}>Reset</Button>
          </span>
        </div>
      </div>
    </>
  );
}

export default EditMessageForm;
