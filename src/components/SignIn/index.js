import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { PasswordForgetLink } from '../PasswordForget';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

const signInFormStyle = {
  fontSize: '15px',
  height: '30%',
};

const signInPageStyle = {
  maxWidth: '400px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '20px',
  display: 'flex',
  flexBasis: 'auto',
  flexDirection: 'column',
  height: '100%',
};

const inputStyle = {
  width: '100%',
  height: '50%',
  maxHeight: '40px',
};

const divStyle = {
  height: '50%',
  boxSizing: 'border-box',
  marginBottom: 'auto',
  marginTop: 'auto',
};

const SignInPage = () => (
    <div style={signInPageStyle}>
        <h1>Sign In</h1>
        <SignInForm />
        <div style={divStyle}>
        <SignInGoogle />
        <SignInFacebook />
        <SignInTwitter />
        <PasswordForgetLink />
        <SignUpLink />
        </div>
    </div>
);

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
    An account with an E-Mail address to this social account already
    exists. Try to login from this account instead and associate your
    social accounts on your personal account page.
`;

class SignInFormBase extends Component
{
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;
        this.props.firebase.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });

                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState( { [event.target.name]: event.target.value});
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <form style={signInFormStyle} onSubmit={this.onSubmit}>
              <div style={divStyle}>
                <input
                    style={inputStyle}
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
              </div>
              <div style={divStyle}>
                <input
                    style={inputStyle}
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
              </div>
              <div style={divStyle}>
                <button disabled={isInvalid} type="submit">
                    Sign In
                </button>
              </div>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

class SignInGoogleBase extends Component {
    constructor(props) {
        super(props);

        this.state = { error: null };
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                // Create a user in the Database
                return this.props.firebase.user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.user.displayName,
                        email: socialAuthUser.user.email,
                        roles: {},
                    });
                }).then(() => {
                    this.setState({ error: null });
                    this.props.history.push(ROUTES.HOME);
                })
                .catch(error => {
                    if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                        error.message = ERROR_MSG_ACCOUNT_EXISTS;
                    }

                    this.setState({ error });
                });

        event.preventDefault();
    };

    render() {
        const { error } = this.state;

        return (
            <form onSubmit={this.onSubmit}>
                <button type="submit">Sign In with Google</button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

class SignInFacebookBase extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithFacebook()
            .then(socialAuthUser => {
                //Create a user in the Database
                return this.props.firebase.user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.additionalUserInfo.profile.name,
                        email: socialAuthUser.additionalUserInfo.profile.email,
                        roles: {}
                    });
                })
                .then(() => {
                    this.setState({ error: null });
                    this.props.history.push(ROUTES.HOME);
                }).catch(error => {
                    if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                        error.message = ERROR_MSG_ACCOUNT_EXISTS;
                    }

                    this.setState({ error });
                });

            event.preventDefault();
    };

    render() {
        const { error } = this.state;

        return (
            <form onSubmit={this.onSubmit}>
                <button type="submit">Sign In with Facebook</button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

class SignInTwitterBase extends Component {
    constructor(props) {
        super(props);

        this.state = { error: null };
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithTwitter()
            .then(socialAuthUser => {
                return this.props.firebase.user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.additionalUserInfo.profile.name,
                        email: socialAuthUser.additionalUserInfo.profile.email,
                        roles: {}
                    });
            })
            .then(() => {
                this.setState({ error: null });
                this.props.history.push(ROUTES.HOME);
            }).catch(error => {
                if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

                this.setState({ error });
            });

        event.preventDefault();
    }

    render() {
        const { error } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <button type="submit">Sign In with Twitter</button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignInForm = compose( withRouter, withFirebase)(SignInFormBase);

const SignInGoogle = compose(
    withRouter,
    withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
    withRouter,
    withFirebase,
)(SignInFacebookBase);

const SignInTwitter = compose(
    withRouter,
    withFirebase,
)(SignInTwitterBase);

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };
