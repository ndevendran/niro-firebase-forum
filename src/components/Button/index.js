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

export default Button;