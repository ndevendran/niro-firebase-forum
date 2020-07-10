import React, { Component } from 'react';
import { 
    withAuthorization, 
    withEmailVerification,
    AuthUserContext, 
} from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

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
                        <button type="button" onClick={this.onNextPage}>
                            More
                        </button>
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
    <ul>
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

// const MessageItem = ({ message, onRemoveMessage, onEditMessage }) => (
//     <li>
//         <strong>{message.userId}</strong>
//         {message.text}
//         <button
//             type="button"
//             onClick={() => onRemoveMessage(message.uid)}
//         >
//             Delete
//         </button>
//     </li>
// );

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
            <li>
                {editMode ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={this.onChangeEditText}
                    />
                ) : (
                    <span>
                        <strong>{message.userId}</strong>
                        {message.text}
                        {message.editedAt && <span> (Edited)</span>}
                    </span>
                )}
                {authUser.uid === message.userId && (
                    <span>
                        {!editMode && (
                            <button
                                type="button"
                                onClick={() => onRemoveMessage(message.uid)}
                            >
                                Delete
                            </button>
                        )}
                        {editMode ? (
                            <span>
                                <button onClick={this.onSaveEditText}>Save</button>
                                <button onClick={this.onToggleEditMode}>Reset</button>
                            </span>
                        ) : (
                            <button onClick={this.onToggleEditMode}>Edit</button>
                        )}
                    </span>
                )}

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