import React, { Component } from 'react';
import MessageList from '../Message/MessageList.js';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import CreateMessage from './CreateMessage.js';
import { AuthUserContext } from '../Session';
import Button, { ButtonFlat } from '../Button';
import styles from './index.css';

class MessageBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            messages: [],
            likes: [],
            text: '',
            limit: 5,
        };
    }

    componentDidMount() {
        this.onListenForMessages();
        this.onListenForLikes();
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

    onListenForLikes() {
      this.props.firebase
      .likes()
      .on('value', snapshot => {
        const likesObject = snapshot.val();

        if(likesObject) {
          const likesList = Object.keys(likesObject).map(
            key => ({
              uid: key,
              ...likesObject[key],
            }));

          this.setState({
            likes: likesList,
          });
        } else {
          this.setState({ likes: null, });
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

    onLikeMessage = (message, user) => {
      console.log("Liking post...");
      let like;
      const { uid, ...messageSnapshot } = message;
      if(this.state.likes) {
        const singleLikeInList = this.state.likes.filter(potentialLike => {
          console.log(potentialLike);
          if(potentialLike.messageId === uid){
            console.log("found one...");
            return true;
          }

          return false;
        });

        like = singleLikeInList[0];
      }

      console.log(like);

      if(!like) {
        const memberList = {};
        memberList[user.uid] = true;
        this.props.firebase.likes().push({
          messageId: message.uid,
          members: memberList,
        });

        this.props.firebase.message(uid).set({
          uid: uid,
          ...messageSnapshot,
          likes: 1,
        });
      } else {
        let userLikedPost = false;
        for(const member in like.members) {
          if (member===user.uid) {
              userLikedPost = true;
          }
        }

        console.log(like);

        if(userLikedPost) {
          delete like.members[user.uid];
          this.props.firebase.message(uid).set({
            uid: uid,
            ...messageSnapshot,
            likes: messageSnapshot.likes - 1
          });

          this.props.firebase.like(like.uid).set({
            ...like,
            members: like.members,
          });
        } else {
          let newMemberList;
          if(like.members) {
            newMemberList = like.members;
          } else {
            newMemberList = {};
          }

          const likeCount = messageSnapshot.likes;
          console.log(likeCount);
          newMemberList[user.uid] = true;
          this.props.firebase.message(uid).set({
            ...messageSnapshot,
            likes: messageSnapshot.likes + 1
          })
          this.props.firebase.like(like.uid).set({
            ...like,
            members: newMemberList,
          });
        }
      }
    }

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
                        <div className={styles.MoreButton}>
                          <ButtonFlat onClick={this.onNextPage}>
                              More
                          </ButtonFlat>
                        </div>
                    )}
                    {loading && <div> Loading...</div>}
                    {messages ? (
                        <MessageList messages={messages}
                            onRemoveMessage={this.onRemoveMessage}
                            onEditMessage={this.onEditMessage}
                            authUser={authUser}
                            onLikeMessage={this.onLikeMessage}
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
