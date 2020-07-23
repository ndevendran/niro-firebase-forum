import React, { Component } from 'react';
import {
    withAuthorization,
    withEmailVerification,
    AuthUserContext,
} from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import Button from '../Button';
import EditMessageForm from './EditMessageForm.js';
import Message from './Message.js';
import './index.css';
import Profile from '../Profile';

const HomePage = () => (
    <div>
        <h1>Home Page</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        <Messages />
    </div>
);

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

    onChangeText = event => {
        this.setState({ text: event.target.value });
    }

    onCreateMessage = (event, authUser) => {
        this.props.firebase.messages().push({
            text: this.state.text,
            userId: authUser.uid,
            createdAt: this.props.firebase.serverValue.TIMESTAMP,
        });

        this.setState({ text: '' });

        event.preventDefault();
    };

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
            <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    {!loading && messages && (
                        <Button onClick={this.onNextPage}>
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
                    <form onSubmit={event => this.onCreateMessage(event, authUser)}>
                        <input
                            type="text"
                            value={text}
                            onChange={this.onChangeText}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}

            </AuthUserContext.Consumer>
        );
    }
}

const MessageList = ({
    messages, onRemoveMessage,
    onEditMessage, authUser }) => (
    <ul className="messageList">
        {messages.map(message => (
            <MessageItem
                key={message.uid}
                message={message}
                onRemoveMessage={onRemoveMessage}
                onEditMessage={onEditMessage}
                authUser={authUser}
            />
        ))}
    </ul>
);

class MessageItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            editText: this.props.message.text,
        };
    }

    onToggleEditMode = () => {
        this.setState(state => ({
            editMode: !state.editMode,
            editText: this.props.message.text,
        }));
    };

    onChangeEditText = event => {
        this.setState({ editText: event.target.value });
    }

    onSaveEditText = () => {
        this.props.onEditMessage(this.props.message, this.state.editText);

        this.setState({ editMode: false });
    };

    render() {
        const { authUser, message, onRemoveMessage } = this.props;
        const { editMode, editText } = this.state;

        return (
            <li className="messageContent">
              <div>
                <Profile />
              </div>
              <div class="messageContainer">
              {editMode ? (
                <EditMessageForm
                  message={message} onChangeEditText={this.onChangeEditText}
                  onSaveEditText={this.onSaveEditText} onToggleEditMode={this.onToggleEditMode}
                  editText={editText}
                />
              ) : (
                <Message
                  message={message} onRemoveMessage={this.onRemoveMessage}
                  onToggleEditMode={this.onToggleEditMode} authUser={authUser}
                />
              )}
              </div>
            </li>
        );
    }
}

const Messages = withFirebase(MessageBase);

const condition = authUser => !!authUser;

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(HomePage);
