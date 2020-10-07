import React, { Component } from 'react';
import MessageList from '../Message/MessageList.js';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import CreateMessage from './CreateMessage.js';
import { AuthUserContext } from '../Session';
import Button from '../Button';
import styles from './index.css';

class MessageBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            messages: [],
            text: '',
            limit: 5,
        };
    }

    componentDidMount() {
        this.onListenForMessages();
    }

    onListenForMessages() {
        this.setState({ loading: true });

        this.props.firebase
        .messages()
        .orderByChild('createdAt')
        .limitToLast(this.state.limit)
        .on('value', snapshot => {
            const messageObject = snapshot.val();

            if(messageObject) {
                // convert messages list from snapshot
                const messageList = Object.keys(messageObject).map(
                    key => ({
                        ...messageObject[key],
                        uid: key,
                    }));

                this.setState({
                    messages: messageList,
                    loading: false
                });
            } else {
                this.setState({ messages: null, loading: false});
            }
        });
    }

    onNextPage = () => {
        this.setState(
        state => ({ limit: state.limit + 5 }),
            this.onListenForMessages,
        );
    };

    componentWillUnmount() {
        this.props.firebase.messages().off();
    }


    onRemoveMessage = uid => {
        this.props.firebase.message(uid).remove();
    };

    onEditMessage = (message, text) => {
        const { uid, ...messageSnapshot } = message;

        this.props.firebase.message(message.uid).set({
            ...messageSnapshot,
            text,
            editedAt: this.props.firebase.serverValue.TIMESTAMP,
        });
    };

    render() {
        const { text, messages, loading } = this.state;

        return (
            <div className={styles.messagesScrollContainer}>
            <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <div className={styles.createContainer}>
                      <CreateMessage authUser={authUser} />
                    </div>
                    {!loading && messages && (
                        <Button onClick={this.onNextPage} className={styles.MoreButton}>
                            More
                        </Button>
                    )}
                    {loading && <div> Loading...</div>}
                    {messages ? (
                        <MessageList messages={messages}
                            onRemoveMessage={this.onRemoveMessage}
                            onEditMessage={this.onEditMessage}
                            authUser={authUser}
                        />
                    ) : (
                        <div>There are no messages...</div>
                    )}
                </div>
            )}
            </AuthUserContext.Consumer>
            </div>
        );
    }
}


export { CreateMessage };

const Messages = withFirebase(MessageBase);

export default Messages;
