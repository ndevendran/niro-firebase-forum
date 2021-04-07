import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    /* Helper */
    this.serverValue = app.database.ServerValue;

    this.emailAuthProvider = app.auth.EmailAuthProvider;

    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () =>
    this.auth.signInWithPopup(this.googleProvider);

  doSignInWithFacebook = () =>
    this.auth.signInWithPopup(this.facebookProvider);

  doSignInWithTwitter = () =>
    this.auth.signInWithPopup(this.twitterProvider);

  doSignOut = () =>
    this.auth.signOut();

  doPasswordReset = email =>
    this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });

  // *** User API ***
  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');

  getCurrentUser = () => this.auth.currentUser;

  // *** Merge Auth and DB User API ***

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
        .once('value')
        .then(snapshot => {
          const dbUser = snapshot.val();

          //default empty roles
          if (!dbUser.roles) {
            dbUser.roles = {};
          }

          // merge auth and db user
          authUser = {
            uid: authUser.uid,
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            providerData: authUser.providerData,
            ...dbUser,
          };

          next(authUser);
        });
      } else {
        fallback();
      }
    });

  // *** Message API ***
  message = uid => this.db.ref(`messages/${uid}`);

  writeMessage = (message) => {
    return this.db.ref(`messages`).push(
      {
        text: message.text,
        userId: message.userId,
        username: message.username,
        profile_picture: message.profile_picture,
        createdAt: this.serverValue.TIMESTAMP,
      }).key;
  }

  getMessages = (limit) => {
    let messageRef = this.db.ref('messages');
    return messageRef.orderByValue('createdAt')
      .limitToFirst(limit)
      .once('value');
  }

  messages = () => this.db.ref('messages');

  // *** Comment API ***
  writeComment = (comment, messageId) => {
    const that = this;
    this.db.ref(`messages/${messageId}`)
      .once('value', function(snapshot) {
      const messageObject = snapshot.val();

      if(messageObject) {
        let updates = {};
        const newCommentKey = that.db.ref().child('messages').push().key;
        if(!messageObject.commentCount) {
          messageObject.commentCount = 0;
        }

        updates[`messages/${messageId}`] = {
          ...messageObject,
          commentCount: messageObject.commentCount + 1,
        };

        updates[`messages/${newCommentKey}`] = {
          text: comment.text,
          createdAt: that.serverValue.TIMESTAMP,
          userId: comment.userId,
          username: comment.username,
          parentId: messageId,
          profile_picture: comment.profile_picture,
        };

        that.db.ref().update(updates);
      } else {
      }
    });
  }

  getComments = messageId => {
    let commentsRef = this.db.ref(`messages`);
    return commentsRef.orderByChild('parentId').equalTo(messageId);
  }

  comments = () => this.db.ref(`messages`);

  // *** Storage API ***
  getRef = () => this.storage.ref();
}

export default Firebase;
