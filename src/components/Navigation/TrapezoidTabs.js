import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

class TrapezoidTabs extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <li className="tab">
                <span className="menuItem">
                  <Link to={this.props.link}>{this.props.children}</Link>
                </span>
            </li>
        );
    }
}

export default TrapezoidTabs;
