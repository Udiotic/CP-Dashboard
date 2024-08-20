// src/components/ConnectAccountForm.js
import React, { useState } from 'react';

const ConnectAccountForm = ({ onConnect, connectedAccounts }) => {
    const [platform, setPlatform] = useState('');
    const [username, setUsername] = useState('');
  
    const availablePlatforms = ['codeforces', 'leetcode', 'codechef'].filter(
      p => !connectedAccounts.includes(p)
    );
  
    if (availablePlatforms.length === 0) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConnect(platform, username);
    setPlatform('');
    setUsername('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Connect New Account</h2>
      <div className="flex flex-col space-y-4">
        <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="border p-2 rounded"
            required
        >
            <option value="">Select Platform</option>
            {availablePlatforms.map(p => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
        </select>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Connect Account
        </button>
      </div>
    </form>
  );
};

export default ConnectAccountForm;