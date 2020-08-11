import React from 'react';
import Button from '../Button';
import styles from './index.css';

const EditMessageForm = ({ message, onChangeEditText, onSaveEditText, onToggleEditMode, editText, placeholder }) => {
  return (
    <>
      <div className={styles.messageHeader}>
        <strong>{message.userId}</strong>
      </div>
      <div className={styles.messageBody}>
        <input
            type="text"
            value={editText}
            onChange={onChangeEditText}
            placeholder={placeholder}
        />
      </div>
      <div className={styles.messageFooter}>
        <div className={styles.header}>{message.editedAt && <span> (Edited)</span>}</div>
        <div className={styles.body}></div>
        <div className={styles.footer}>
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
