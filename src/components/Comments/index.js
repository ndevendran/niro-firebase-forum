import React, { Component } from 'react';
import { MessageList, MessageItem } from '../Message';
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
      users: this.props.location.state.users,
      limit: 20,
      basePath: this.props.location.state.basePath,
      message: this.props.location.state.message,
      displayCreateComment: false,
      activeMessage: this.props.location.state.message.uid,
    }
  }

  onListenForComments() {
    const message = this.props.location.state.message;
    const basePath = this.props.location.state.basePath
    const path = `${basePath}/${message.uid}/comments`;
    this.props.firebase.comments(`${path}`)
      .orderByChild('createdAt')
      .limitToLast(this.state.limit)
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
    this.onListenForComments();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.location.state.basePath !== this.props.location.state.basePath) {
      this.props.firebase.comments().off();
      this.onListenForComments();
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

  setActiveMessage = (messageId, basePath) => {
    this.setState({
      activeMessage: messageId,
      basePath: basePath,
    });
  }

  getActiveMessage = () => {
    return this.state.activeMessage;
  }

  getBasePath = () => {
    return this.state.basePath;
  }

  render() {
    const { message, depth, basePath } = this.props.location.state;
    const { comments, users } = this.state;
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
              depth={depth}
              path={`${basePath}/${message.uid}/comments`}
              toggleCreateComment={this.toggleCreateComment}
              setActiveMessage={this.setActiveMessage}
            />
          )}
          {(comments && message) && (
            <MessageList
              messages={comments}
              authUser={authUser}
              users={users}
              toggleCreateComment={this.toggleCreateComment}
              setActiveMessage={this.setActiveMessage}
              depth={depth+1}
              basePath={`${basePath}/${message.uid}/comments`}
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
                  getBasePath={this.getBasePath}
                  toggleCreateComment={this.toggleCreateComment}
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
