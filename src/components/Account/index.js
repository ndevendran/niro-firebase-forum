import React, { Component } from 'react';
import * as ROUTES from '../../constants/routes';
import { NavigationAccount } from '../Navigation';

import {
    AuthUserContext,
    withAuthorization,
    withEmailVerification,
} from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styles from './index.css';

const SIGN_IN_METHODS = [
    {
        id: 'password',
        provider: null,
    },
    {
        id: 'google.com',
        provider: 'googleProvider',
    },
    {
        id: 'facebook.com',
        provider: 'facebookProvider',
    },
    {
        id: 'twitter.com',
        provider: 'twitterProvider',
    },
];

const AccountPage = () => (
    <Router>
    <AuthUserContext.Consumer>
        {authUser => (
            <div className={styles.accountPage}>
                <div className={styles.accountNavigation}>
                  <NavigationAccount />
                </div>

                <div className={styles.accountMain}>
                  <h1>Account: {authUser.email}</h1>
                  <Route exact path={ROUTES.PASSWORD_FORGET}><PasswordForgetForm /></Route>
                  <Route path={ROUTES.PASSWORD_CHANGE}><PasswordChangeForm /></Route>
                  <Route path={ROUTES.SIGN_IN_METHODS}><LoginManagement authUser={authUser}/></Route>
                </div>
            </div>
        )}
    </AuthUserContext.Consumer>
    </Router>
);

class LoginManagementBase extends Component
{
    constructor(props) {
        super(props);

        this.state = {
            activeSignInMethods: [],
            error: null,
        };
    }

    componentDidMount() {
        this.fetchSignInMethods();
    }

    fetchSignInMethods = () => {
                this.props.firebase.auth
            .fetchSignInMethodsForEmail(this.props.authUser.email)
            .then(activeSignInMethods =>
                this.setState({
                    activeSignInMethods, error: null
                })
            )
            .catch(error => this.setState({ error }));
    }

    onSocialLoginLink = provider => {
        this.props.firebase.auth.currentUser
            .linkWithPopup(this.props.firebase[provider])
            .then(this.fetchSignInMethods)
            .catch(error => this.setState({ error }));

    };

    onDefaultLoginLink = password => {
        const credential = this.props.firebase.emailAuthProvider.credential(
                this.props.authUser.email,
                password,
            );

        this.props.firebase.auth.currentUser
            .linkAndRetrieveDataWithCredential(credential)
            .then(this.fetchSignInMethods)
            .catch(error => this.setState({
                error
            }));
    };

    onUnlink = providerId => {
        this.props.firebase.auth.currentUser
        .unlink(providerId)
        .then(this.fetchSignInMethods)
        .catch(error => this.setState({
            error
        }))

    };

    onDefaultLoginLink = () => {

    };

    render() {
        const { activeSignInMethods, error } = this.state;
        return (
            <div className={styles.page_container}>
                Sign In Methods:
                <ul>
                    {SIGN_IN_METHODS.map(signInMethod => {
                        const onlyOneLeft = activeSignInMethods.length === 1;
                        const isEnabled = activeSignInMethods.includes(
                            signInMethod.id,
                        );

                        return (
                            <li key={signInMethod.id}>
                                {signInMethod.id === 'password' ? (
                                    <DefaultLoginToggle
                                        onlyOneLeft={onlyOneLeft}
                                        isEnabled={isEnabled}
                                        signInMethod={signInMethod}
                                        onLink={this.onDefaultLoginLink}
                                        onUnlink={this.onUnlink}
                                    />
                                    ) : (
                                    <SocialLoginToggle
                                        onlyOneLeft={onlyOneLeft}
                                        isEnabled={isEnabled}
                                        signInMethod={signInMethod}
                                        onLink={this.onDefaultLoginLink}
                                        onUnlink={this.onUnlink}
                                    />
                                    )}
                            </li>
                        );
                    })}
                </ul>
                    {error && error.message}
            </div>
        );
    }
}

class DefaultLoginToggle extends Component {
    constructor(props) {
        super(props);
        this.state = { passwordOne: '', passwordTwo: '' };
    }

    onSubmit = event => {
        event.preventDefault();

        this.props.onLink(this.state.passwordOne);

        this.setState({ passwordOne: '', passwordTwo: ''});
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            onlyOneLeft,
            isEnabled,
            signInMethod,
            onUnlink,
        } = this.props;

        const { passwordOne, passwordTwo } = this.state;

        const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

        return isEnabled ? (
            <button
                type="button"
                onClick={() => onUnlink(signInMethod.id)}
                disabled={onlyOneLeft}
            >
                Deactivate {signInMethod.id}
            </button>
        ) : (
            <form onSubmit={this.onSubmit}>
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="New Password"
                />
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password"
                />
                <button disabled={isInvalid} type="submit">
                    Link {signInMethod.id}
                </button>
            </form>
        );
    }
}

const SocialLoginToggle = ({
    onlyOneLeft,
    isEnabled,
    signInMethod,
    onLink,
    onUnlink,
}) =>
    isEnabled ? (
        <button
            type="button"
            onClick={() => onUnlink(signInMethod.id)}
            disabled ={onlyOneLeft}
        >
        Deactivate {signInMethod.id}
        </button>
    ) : (
        <button
            type="button"
            onClick={() => onLink(signInMethod.provider)}
        >
            Link {signInMethod.id}
        </button>
    );

const LoginManagement = withFirebase(LoginManagementBase);

const condition = authUser => !!authUser;
export default compose(
    withAuthorization(condition),
    withEmailVerification,
)(AccountPage);
