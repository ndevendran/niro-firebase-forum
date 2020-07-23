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
                <Link to={this.props.link}>{this.props.children}</Link>
            </li>
        );
    }
}

export default TrapezoidTabs;