import React from 'react';

import AuthUserContext from './context';

import { withFirebase } from '../Firebase';

const needsEmailVerification = authUser => {
    authUser &&
    !authUser.emailVerified &&
    authUser.providerData
    .map(provider =>
        provider.providerId)
    .includes('password');
}

const withEmailVerification = Component => {
    class WithEmailVerification extends React.Component {
        constructor(props) {
            super(props);

            this.state = { isSent: false };
        }

        onSendEmailVerification = () => {
            this.props.firebase.doSendEmailVerification()
            .then(() => this.setState({ isSent: true }));
        };

        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser => 
                        needsEmailVerification(authUser) ? (
                            <div>
                            {
                                this.state.isSent ? (
                                    <p>
                                        E-Mail confirmation sent: Check your E-Mails
                                        (Spam folder included) for a confirmation Email.
                                        Refresh this pageo nce you confirmed your Email.
                                    </p>
                                ) : (
                                    <p>
                                        Verify your E-mail:
                                        Check your E-mails (Spam folder included)
                                        for a confirmation E-mail or send another confirmation
                                        E-mail
                                    </p>
                                )}
                                    <button
                                        type="button"
                                        onClick={this.onSendEmailVerification}
                                        disabled={this.state.isSent}
                                    >
                                        Send Confirmation E-Mail
                                    </button>


                            </div>
                        ) : (
                            <Component {...this.props} />
                        )
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return withFirebase(WithEmailVerification);
};

export default withEmailVerification;