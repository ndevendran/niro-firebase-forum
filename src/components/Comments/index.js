import React, { Component } from 'react';
import { MessageList, MessageItem } from '../Message';
import CommentList from './CommentList.js';
import CreateComment from '../Comments/CreateComment.js';
import { withFirebase } from '../Firebase';
import { withAuthentication, AuthUserContext } from '../Session';
import { compose } from 'recompose';
import styles from './index.css';

class CommentsBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      comments: [],
      limit: 20,
      displayCreateComment: false,
      activeMessage: null,
    }
  }

  onListenForComments(message) {
    this.props.firebase.comments()
      .orderByChild('parentId')
      .equalTo(message.uid)
      .on('value', (snapshot) => {
        const commentObject = snapshot.val();
        if(commentObject) {
          const commentList = Object.keys(commentObject).map(key => ({
            ...commentObject[key],
            uid: key,
          }));

          this.setState({
            comments: commentList,
            loading: false,
          });
        } else {
          this.setState({
            comments: null,
            loading: false,
          });
        }
      });
  }

  componentDidMount() {
    this.onListenForComments(this.props.location.state.message);
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log("The component is getting new comments...");
  //   this.props.firebase.comments().off();
  //   this.onListenForComments(nextProps.location.state.message);
  // }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.location.state.message.uid
        !== this.props.location.state.message.uid) {
      this.props.firebase.comments().off();
      this.onListenForComments(this.props.location.state.message);
    }
  }

  componentWillUnmount() {
    this.props.firebase.comments().off();
  }

  toggleCreateComment = () => {
    this.setState((prevState) => ({
      displayCreateComment: !prevState.displayCreateComment,
    }))
  }

  setActiveMessage = (message) => {
    this.setState({
      activeMessage: message,
    });
  }

  getActiveMessage = () => {
    return this.state.activeMessage;
  }

  getBasePath = () => {
    return this.state.basePath;
  }

  render() {
    const { message, users } = this.props.location.state;
    const { comments } = this.state;
    return (
      <AuthUserContext.Consumer>
      { authUser => (
        <div className={styles.scrollable}>
          <h1>Message Details</h1>
          {message && (
            <MessageItem
              key={message.uid}
              message={message}
              authUser={authUser}
              users={users}
              toggleCreateComment={this.toggleCreateComment}
              setActiveMessage={this.setActiveMessage}
            />
          )}
          {(comments && message) && (
            <CommentList
              messages={comments}
              authUser={authUser}
              users={users}
              toggleCreateComment={this.toggleCreateComment}
              setActiveMessage={this.setActiveMessage}
            />
          )}
          {
            this.state.displayCreateComment &&
            <>
              <div className={styles.overlay} onClick={this.toggleCreateComment}>
              </div>
              <div className={styles.createCommentLightbox}>
                <CreateComment
                  authUser={authUser}
                  getActiveMessage={this.getActiveMessage}
                  toggleCreateComment={this.toggleCreateComment}
                  users={users}
                />
              </div>
            </>
          }
        </div>
      )}
      </AuthUserContext.Consumer>
    );
  }
}

export default compose(withAuthentication, withFirebase)(CommentsBase);
