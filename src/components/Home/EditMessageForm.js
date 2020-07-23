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
        <span>
            <Button onClick={onSaveEditText}>Save</Button>
            <Button onClick={onToggleEditMode}>Reset</Button>
        </span>
      </div>
    </>
  );
}

export default EditMessageForm;
