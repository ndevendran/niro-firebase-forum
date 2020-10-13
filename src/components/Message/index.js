import React, { Component } from 'react';
import MessageList from '../Message/MessageList.js';
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
            limit: 5,
            displayCreateComment: false,
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
        this.props.firebase.users().off();
    }

    onToggleCreateCommentLightbox = () => {
      this.setState((prevState) => ({
        displayCreateComment: !prevState.displayCreateComment,
      }));
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

    onLikeMessage = (message, user) => {
      if(message.userId === user.uid){
        return;
      }


      let likes;
      if(!message.likes){
        likes = {};
        likes.members = {};
        likes.members[user.uid] = true;
        likes.count = 1;

        message.likes = likes;
      } else if(message.likes && (!message.likes.members || !message.likes.members[user.uid])){
        likes = message.likes;
        if(!likes.members) {
          likes.members = {};
        }
        likes.members[user.uid] = true;
        likes.count = likes.count + 1;
        message.likes = likes;
      } else if(message.likes && message.likes.members[user.uid]){
        likes = message.likes;
        delete likes.members[user.uid];
        likes.count = likes.count - 1;
        if(likes.count === 0)
          message.likes = null;
        else
          message.likes = likes;
      }

      this.props.firebase.message(message.uid).set({
        ...message
      });

      return message;
    }

    render() {
        const { text, messages, loading, users } = this.state;

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
                            onRemoveMessage={this.onRemoveMessage}
                            onEditMessage={this.onEditMessage}
                            authUser={authUser}
                            onLikeMessage={this.onLikeMessage}
                            users={users}
                            toggleCreateComment={this.onToggleCreateCommentLightbox}
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
                          <CreateComment authUser={authUser} />
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


export { CreateMessage };

const Messages = withFirebase(MessageBase);

export default Messages;
