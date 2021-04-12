import React, { Component } from 'react';
import MessageList from '../Message/MessageList.js';
import MessageItem from '../Message/MessageItem.js';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import CreateMessage from './CreateMessage.js';
import { AuthUserContext } from '../Session';
import Button, { ButtonFlat } from '../Button';
import CreateComment from '../Comments/CreateComment.js';
import styles from './index.css';

class MessageBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            messages: [],
            users: {},
            text: '',
            limit: 15,
            displayCreateComment: false,
            activeMessage: null,
        };
    }

    componentDidMount() {
        this.onListenForMessages();
        this.onListenForUsers();
    }

    onListenForUsers() {
      this.setState({ loading: true });
      this.props.firebase
      .users()
      .once('value')
      .then(snapshot => {
        if(snapshot.val()){
          this.setState({
            users: snapshot.val(),
            loading: false,
          });
        } else {
          console.log("User lookup failed...");
        }
      });
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

    onToggleCreateCommentLightbox = () => {
      this.setState((prevState) => ({
        displayCreateComment: !prevState.displayCreateComment,
      }));
    }

    setActiveMessage = (messageId) => {
      this.setState((prevState) => ({
        activeMessage:  messageId,
      }));
    }

    getActiveMessage = () => {
      return this.state.activeMessage;
    }

    render() {
        const { text, messages, loading, users } = this.state;
        const depth = 1;

        return (
            <div className={styles.messagesScrollContainer}>
            <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <div className={styles.createContainer}>
                      <CreateMessage authUser={authUser} />
                    </div>
                    {!loading && messages && (
                        <div className={styles.MoreButton}>
                          <ButtonFlat onClick={this.onNextPage}>
                              More
                          </ButtonFlat>
                        </div>
                    )}
                    {loading && <div> Loading...</div>}
                    {(messages && users) ? (
                        <MessageList messages={messages}
                            authUser={authUser}
                            users={users}
                            toggleCreateComment={this.onToggleCreateCommentLightbox}
                            setActiveMessage={this.setActiveMessage}
                        />
                    ) : (
                        <div>There are no messages...</div>
                    )}
                    {
                      this.state.displayCreateComment &&
                      <>
                        <div className={styles.overlay} onClick={this.onToggleCreateCommentLightbox}>
                        </div>
                        <div className={styles.createCommentLightbox}>
                          <CreateComment
                            authUser={authUser}
                            getActiveMessage={this.getActiveMessage}
                            toggleCreateComment={this.onToggleCreateCommentLightbox}
                          />
                        </div>
                      </>
                    }
                </div>
            )}
            </AuthUserContext.Consumer>
            </div>
        );
    }
}


export { CreateMessage, MessageList, MessageItem };

const Messages = withFirebase(MessageBase);

export default Messages;
