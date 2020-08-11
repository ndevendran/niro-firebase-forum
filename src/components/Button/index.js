import React, { Component } from 'react';
import styles from './index.css';
import EditIcon from '../../images/svg/008-chat-7.svg';
import DeleteIcon from '../../images/svg/006-chat-5.svg';
import LikeIcon from '../../images/svg/014-chat-13.svg';
import MessageIcon from '../../images/svg/016-chat-15.svg';

class Button extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <button className={styles.btn_standard}
                type="button" onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}

export const ButtonFlat = ({ onClick, children,type }) => {
  return (
    <button className={styles.btn_flat}
      type={type ? type : "button" }
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export const SVGEdit = ({ onClick, children }) => {
  return (
      <img src={EditIcon} className={styles.svgIcon} alt={children} onClick={onClick} />
  );
}

export const SVGDelete = ({ onClick, children }) => {
  return (
    <img src={DeleteIcon} className={styles.svgIcon} alt={children} onClick={onClick} />
  );
}

export const SVGLike = ({ onClick, children }) => {
  return (
    <img src={LikeIcon} className={styles.svgIcon} alt={children} onClick={onClick} />
  );
}

export const SVGMessage = ({ onClick, children }) => {
  return (
    <img src={MessageIcon} className={styles.svgIcon} alt={children} onClick={onClick} />
  );
}

export default Button;
