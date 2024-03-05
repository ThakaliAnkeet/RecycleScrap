import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc } from 'firebase/firestore';
import { auth, firestore } from '../../../firebase/firebase';
import { Link } from 'react-router-dom';
import './groupspage.css';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'Groups'));
        const groupsData = [];
        querySnapshot.forEach((doc) => {
          groupsData.push({ id: doc.id, ...doc.data() });
        });
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }

    fetchGroups();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Groups</h1>
      <ul className="group-list">
        {groups.map((group) => (
          <li key={group.id} className="group-item">
            <Link to={`/groupposts/${group.id}`} className="group-link">
              <div className="group-name">{group.name}</div>
              <div className="group-details">{group.description} - {group.need}</div>
              <div className="group-details">Created by {group.creatorEmail}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupsPage;
