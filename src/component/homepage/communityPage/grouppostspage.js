import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../../../firebase/firebase';
import './groupposts.css';

const GroupPosts = () => {
  const { groupId } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(firestore, 'Groups', groupId, 'GroupPosts'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const postsData = [];
          for (const doc of querySnapshot.docs) {
            const postData = { id: doc.id, ...doc.data() };
            const commentsQuerySnapshot = await getDocs(collection(doc.ref, 'comments'));
            const commentsData = commentsQuerySnapshot.docs.map(commentDoc => ({
              id: commentDoc.id,
              ...commentDoc.data()
            }));
            postData.comments = commentsData;
            postsData.push(postData);
          }
          setPosts(postsData);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [groupId]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const docRef = await addDoc(collection(firestore, 'Groups', groupId, 'GroupPosts'), {
        content: newPostContent,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        timestamp: new Date()
      });
      setNewPostContent('');
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    try {
      const postRef = doc(firestore, 'Groups', groupId, 'GroupPosts', postId);
      const commentDocRef = await addDoc(collection(postRef, 'comments'), {
        content: newCommentContent,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        timestamp: new Date()
      });

      const commentDocSnapshot = await getDoc(commentDocRef);
      const newComment = { id: commentDocSnapshot.id, ...commentDocSnapshot.data() };

      setPosts(prevPosts => {
        const updatedPosts = prevPosts.map(post => {
          if (post.id === postId) {
            return { ...post, comments: [...(post.comments || []), newComment] };
          }
          return post;
        });
        return updatedPosts;
      });

      setNewCommentContent('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const toggleComments = postId => {
    setShowComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  const hideComments = postId => {
    setShowComments(prevState => ({
      ...prevState,
      [postId]: false
    }));
  };

  return (
    <div className="container">
      <h1 className="title">Group Posts</h1>
      <form onSubmit={handlePostSubmit}>
        <textarea
          className="textarea"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Write your post here..."
          rows="4"
          cols="50"
        />
        <button type="submit" className="button">Post</button>
      </form>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <div className="content">{post.content}</div>
            <div className="details">Posted by {post.userEmail} on: {post.timestamp.toDate().toLocaleString()}</div>
            {showComments[post.id] ? (
              <>
                <form onSubmit={(e) => handleCommentSubmit(e, post.id)}>
                  <textarea
                    className="textarea"
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Write your comment here..."
                    rows="2"
                    cols="40"
                  />
                  <button type="submit" className="button">Comment</button>
                </form>
                <button onClick={() => hideComments(post.id)} className="button">Hide Comments</button>
                <ul className="comment-list">
                  {post.comments && post.comments.map((comment) => (
                    <li key={comment.id} className="comment-item">
                      <div className="comment-content">{comment.content}</div>
                      <div className="comment-details">Commented by {comment.userEmail} on: {comment.timestamp.toDate().toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <button onClick={() => toggleComments(post.id)} className="show-comment">Show Comments</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupPosts;
