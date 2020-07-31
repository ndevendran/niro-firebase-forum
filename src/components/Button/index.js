import React, { Component } from 'react';
import './index.css';

class Button extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <button className="btn_standard"
                type="button" onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}

export const ButtonFlat = ({ onClick, children,type }) => {
  return (
    <button className="btn_flat"
      type={type ? type : "button" }
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
