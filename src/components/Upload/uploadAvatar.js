import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthentication } from '../Session';
import { compose } from 'recompose';
import Profile from '../Profile';
import styles from './index.css';
import { ButtonFlat } from '../Button';


class UploadAvatarBase extends Component {
  constructor(props){
    super(props);



    this.state = {
      file: null,
      profile_picture: null,
    }
  }

  setUserAvatar(url, user) {
    user.updateProfile({
      photoUrl: url
    }).then(function() {
      console.log("Success!");
    }).catch(error => {
      console.log(error);
    });

    this.props.firebase.user(user.uid).set({
      username: user.displayName,
      email: user.email,
      profile_picture: url,
    });
  }

  onFileSelect = event => {
    const file = event.target.files[0];
    this.setState({
      file: file,
    });
  }

  onFileUpload = () => {
    const that = this;
    const currentUser = that.props.firebase.getCurrentUser;
    const user = currentUser();
    const file = this.state.file;
    const filePath = "avatar/" + user.uid + "_avatar.jpg";
    const fileRef = that.props.firebase.getRef().child(filePath);

    fileRef.put(file).then(function(snapshot) {
      if(snapshot.state === "success") {
        fileRef.getDownloadURL().then(function(url){
          //set users picture to url
          that.setUserAvatar(url, user);
          that.setState({
            profile_picture: url,
          });
        });
      }
    });
  }

  render() {
    return (
      <AuthUserContext.Consumer>
      { authUser =>(
        <div>
          <div className={styles.profilePicture}>
          <Profile url={this.state.profile_picture
            ? this.state.profile_picture: authUser.profile_picture} />
          </div>
          <h1>Upload Avatar</h1>
          <input type="file" onChange={this.onFileSelect} />
          <div className={styles.uploadButtonContainer}>
            <ButtonFlat onClick={this.onFileUpload}>Upload</ButtonFlat>
          </div>
        </div>
      )}
      </AuthUserContext.Consumer>
    );
  }
}

const UploadAvatar = compose(withAuthentication, withFirebase)(UploadAvatarBase);

export default UploadAvatar;
