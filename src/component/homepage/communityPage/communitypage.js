import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, firestore } from '../../../firebase/firebase';
import './communitypage.css'; // Import CSS file

const CommunityPage = () => {
  const [user, setUser] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');

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
        userEmail: user.email, // Add user's email to the post
        timestamp: new Date()
      });
      setNewPostContent('');
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  return (
    <div className="community-page">
      <h1>Community Page</h1>
      <form onSubmit={handlePostSubmit}>
        <textarea
          className="post-input"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Write your post..."
          rows="4"
          cols="50"
        />
        <button type="submit" className="post-button">Post</button>
      </form>
      <div>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

const Post = ({ post }) => {
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
        userEmail: user.email, // Add user's email to the comment
        timestamp: new Date()
      });
      setNewCommentContent('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  return (
    <div className="post">
      <p>{post.content}</p>
      <p className="post-timestamp">Posted by {post.userEmail} on: {post.timestamp.toDate().toLocaleString()}</p>
      <button onClick={() => setShowComments(!showComments)}>
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </button>
      {showComments && (
        <div>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              className="comment-input"
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Write your comment..."
              rows="2"
              cols="40"
            />
            <button type="submit" className="comment-button">Comment</button>
          </form>
          <div>
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
      <p>{comment.content}</p>
      <p className="comment-timestamp">Commented by {comment.userEmail} on: {comment.timestamp.toDate().toLocaleString()}</p>
    </div>
  );
};

export default CommunityPage;