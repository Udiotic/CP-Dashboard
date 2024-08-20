// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { Link } from 'react-router-dom';

import ConnectAccountForm from './ConnectAccountForm';
import AccountCard from './AccountCard';
import { fetchLeetCodeData, fetchCodeforcesData, fetchCodeChefData } from '../utils/apiUtils';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConnectAccount, setShowConnectAccount] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setAccounts(docSnap.data().accounts || {});
        }
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [currentUser]);

  const handleAccountConnect = async (platform, username) => {
    setLoading(true);
    try {
      setError(null);
      console.log('Connecting account:', platform, username);

      const userDoc = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userDoc);
      const existingData = docSnap.exists() ? docSnap.data().accounts : {};

      const cachedData = existingData[platform];
      const now = new Date().getTime();

      if (cachedData && now - cachedData.timestamp < 3600000) {
        console.log('Using cached data:', cachedData);
        setAccounts({ ...accounts, [platform]: cachedData });
        return;
      }

      let userData;
      switch (platform) {
        case 'leetcode':
          userData = await fetchLeetCodeData(username);
          break;
        case 'codeforces':
          userData = await fetchCodeforcesData(username);
          break;
        case 'codechef':
          userData = await fetchCodeChefData(username);
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      if (!userData) {
        throw new Error(`Failed to fetch data for ${platform}`);
      }

      const updatedData = { ...userData, timestamp: now };
      const updatedAccounts = { ...existingData, [platform]: updatedData };
      await setDoc(userDoc, { accounts: updatedAccounts }, { merge: true });
      setAccounts(updatedAccounts);
      setShowConnectAccount(false);
    } catch (err) {
      console.error('Error connecting account:', err);
      setError(`Failed to connect ${platform} account. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAccount = async (platform) => {
    setLoading(true);
    try {
      const userDoc = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        await updateDoc(userDoc, {
          [`accounts.${platform}`]: deleteField(),
        });

        const updatedDocSnap = await getDoc(userDoc);
        setAccounts(updatedDocSnap.data().accounts || {});
      } else {
        console.error(`No document found for user: ${currentUser.uid}`);
      }
    } catch (err) {
      console.error('Error removing account:', err);
      setError(`Failed to remove ${platform} account. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const toggleConnectAccountForm = () => {
    setShowConnectAccount(!showConnectAccount);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your CP Dashboard</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(accounts)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([platform, data]) => (
            <AccountCard
              key={platform}
              platform={platform}
              data={data}
              onRemove={handleRemoveAccount}
            />
          ))}
        
        {!showConnectAccount && Object.keys(accounts).length < 3 && (
          <div
            onClick={toggleConnectAccountForm}
            className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
          >
            <h2 className="text-2xl font-bold">Connect New Account</h2>
            <p className="text-sm">Click here to connect a new account</p>
          </div>
        )}

        {showConnectAccount && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <ConnectAccountForm
              onConnect={handleAccountConnect}
              connectedAccounts={Object.keys(accounts)}
            />
          </div>
        )}
      </div>
      {Object.keys(accounts).length > 0 && (
        <div className="mt-8">
          <Link to="/practice">
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300">
              <h2 className="text-2xl font-bold">Practice</h2>
              <p className="text-sm">Click here to practice recommended problems</p>
            </div>
          </Link>
        </div>
      )}
      {Object.keys(accounts).length > 0 && (
        <div className="mt-8">
          <Link to="/solvedproblems">
            <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md hover:bg-purple-600 transition-colors duration-300">
              <h2 className="text-2xl font-bold">View Solved Problems</h2>
              <p className="text-sm">Click here to view all solved problems</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
