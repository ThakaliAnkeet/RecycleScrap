import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, orderBy, updateDoc, arrayUnion,doc } from 'firebase/firestore';
import { auth, firestore } from '../../../firebase/firebase';
import './communitypage.css';
import { Link, useNavigate } from 'react-router-dom';

const CommunityPage = () => {
  const [user, setUser] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupNeed, setGroupNeed] = useState('');
  
  const navigate=useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(firestore, 'posts'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setUser(auth.currentUser);
        const fetchedPosts = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(fetchedPosts);
      });
      return () => unsubscribe();
    };
    fetchData();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const docRef = await addDoc(collection(firestore, 'posts'), {
        content: newPostContent,
        userId: user.uid,
        userEmail: user.email,
        timestamp: new Date()
      });
      setNewPostContent('');
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !groupDescription.trim() || !groupNeed.trim()) return;

    try {
      // Create a document in the 'Groups' collection with group name as the document ID
      const groupDocRef = await addDoc(collection(firestore, 'Groups'), {
        name: groupName,
        description: groupDescription,
        need: groupNeed,
        creatorId: user.uid,
        creatorEmail: user.email,
        timestamp: new Date(),
        members: [user.email] // Include current user as a member
      });

      // Also, create a post in the 'posts' collection
      const postDocRef = await addDoc(collection(firestore, 'posts'), {
        content: `New group created: ${groupName}`,
        userId: user.uid,
        userEmail: user.email,
        timestamp: new Date(),
        groupId: groupDocRef.id // Reference to the newly created group document
      });

      // Clear form fields and hide the dialog
      setGroupName('');
      setGroupDescription('');
      setGroupNeed('');
      setShowCreateGroupDialog(false);
    } catch (error) {
      console.error('Error creating group: ', error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      // Update the 'members' array in the group document
      await updateDoc(doc(firestore, 'Groups', groupId), {
        members: arrayUnion(user.email) // Add current user to the 'members' array
      });
      alert('Joined group successfully!');
    } catch (error) {
      console.error('Error joining group: ', error);
    }
  };
  const handleGroupNav=()=>{
    navigate('/groups');
  }
  return (
    <div className="community-page">
      <h1 className="title">Welcome to Our Community</h1>
      {/* <Link className='custom-link' to="/groups">Groups</Link> */}
      <button onClick={handleGroupNav} className='groups-button' >Groups</button>
      <button onClick={() => setShowCreateGroupDialog(true)} className="groups-button">Create A Group</button>
      <form onSubmit={handlePostSubmit}>
        <textarea
          className="post-input"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Share your thoughts..."
          rows="4"
          cols="50"
        />
        <button type="submit" className="post-button">Post</button>
      </form>
      <div className="posts-container">
        {posts.map((post) => (
          <Post key={post.id} post={post} handleJoinGroup={handleJoinGroup} />
        ))}
      </div>

      {/* Dialog Box for Create Group */}
      {showCreateGroupDialog && (
        <div className="create-group-dialog">
          <form onSubmit={handleCreateGroup}>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter Group Name"
              required
            />
            <input
              type="text"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Enter Group Description"
              required
            />
            <input
              type="text"
              value={groupNeed}
              onChange={(e) => setGroupNeed(e.target.value)}
              placeholder="Enter Group Need"
              required
            />
            <button type="submit">Create Group</button>
            <button onClick={() => setShowCreateGroupDialog(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

const Post = ({ post, handleJoinGroup }) => {
  const [user, setUser] = useState('');
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'posts', post.id, 'comments'), (querySnapshot) => {
      setUser(auth.currentUser);
      const fetchedComments = [];
      querySnapshot.forEach((doc) => {
        fetchedComments.push({ id: doc.id, ...doc.data() });
      });
      setComments(fetchedComments);
    });
    return () => unsubscribe();
  }, [post.id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;
    try {
      await addDoc(collection(firestore, 'posts', post.id, 'comments'), {
        content: newCommentContent,
        userId: user.uid,
        userEmail: user.email,
        timestamp: new Date()
      });
      setNewCommentContent('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  return (
    <div className="post">
      <p className="post-content">{post.content}</p>
      <p className="post-details">Posted by {post.userEmail} on: {post.timestamp.toDate().toLocaleString()}</p>
      {post.groupId && (
        <button className='join-group' onClick={() => handleJoinGroup(post.groupId)}>Join Group</button>
      )}
      <button className="comment-toggle" onClick={() => setShowComments(!showComments)}>
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </button>
      {showComments && (
        <div>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              className="comment-input"
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Add a comment..."
              rows="2"
              cols="40"
            />
            <button type="submit" className="comment-button">Comment</button>
          </form>
          <div className="comments">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <p className="comment-content">{comment.content}</p>
      <p className="comment-details">Commented by {comment.userEmail} on: {comment.timestamp.toDate().toLocaleString()}</p>
    </div>
  );
};

export default CommunityPage;
