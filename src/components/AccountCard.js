// src/components/AccountCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const platformLogos = {
  leetcode: 'leetcode.png',
  codeforces: 'codeforces.png',
  codechef: 'codechef.png',
};

const AccountCard = ({ platform, data, onRemove }) => {
  if (!data) return null;

  // Ensure username is displayed correctly
  const username = data.username || data.handle || 'Unknown';

  const renderPlatformData = () => {
    switch (platform) {
      case 'leetcode':
        return (
          <>
            <p>Total Solved: {data.totalSolved}</p>
            <p>Ranking: {data.ranking}</p>
          </>
        );
      case 'codeforces':
        return (
          <>
            <p>Rating: {data.rating}</p>
            <p>Rank: {data.rank}</p>
          </>
        );
      case 'codechef':
        return (
          <>
            <p>Rating: {data.currentRating} </p>
            {/* <p>Max Rating: {data.highestRating}</p> */}
            <p>Global Rank: {data.globalRank}</p>
            {/* <p>Country: {data.countryName}</p> */}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Link to={`/profile/${platform}/${username}`} className="block">
      <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <img src={platformLogos[platform]} alt={`${platform} logo`} className="w-8 h-8 mr-2" />
          <h3 className="text-xl font-bold capitalize">{platform}</h3>
        </div>
        <p className="font-semibold mb-2">Username: {username}</p>
        {renderPlatformData()}
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove(platform);
          }}
          className="mt-4 text-red-500 hover:text-red-700"
        >
          Remove Account
        </button>
      </div>
    </Link>
  );
};

export default AccountCard;