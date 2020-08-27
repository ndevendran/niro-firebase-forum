import React from 'react';
import Button from '../Button';
import styles from './index.css';

const EditMessageForm = ({ message, onChangeEditText, onSaveEditText, onToggleEditMode, editText, placeholder }) => {
  return (
    <>
      <div>
        <strong>{message.userId}</strong>
      </div>
      <div>
        <input
            type="text"
            value={editText}
            onChange={onChangeEditText}
            placeholder={placeholder}
        />
      </div>
      <div>
        <div>{message.editedAt && <span> (Edited)</span>}</div>
        <div></div>
        <div>
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
