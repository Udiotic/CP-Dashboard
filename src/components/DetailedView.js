import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDetailedData } from '../utils/apiUtils';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const DetailedView = () => {
  const { platform, username } = useParams();
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDetailedData(platform, username);
        console.log("Detailed data:", data);
        setDetailedData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch detailed data');
        setLoading(false);
      }
    };
    fetchData();
  }, [platform, username]);


  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  const defaultAvatar = 'https://example.com/default-avatar.png'; // Replace with your default avatar URL

  const transformSubmissionData = (submissionCalendar) => {
    return Object.entries(submissionCalendar).map(([timestamp, count]) => {
      // Ensure the timestamp is correctly parsed as a number
      const date = new Date(parseInt(timestamp) * 1000);
      if (isNaN(date.getTime())) {
        console.error(`Invalid timestamp: ${timestamp}`);
        return null;
      }
      return {
        date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        count: count,
      };
    }).filter(Boolean); // Filter out any null entries
  };
  
 
  
  

  const renderLeetCodeProfile = (data) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <p><strong>Ranking:</strong> {data.ranking || 'N/A'}</p>
        <p><strong>Total Solved:</strong> {data.totalSolved || 'N/A'}</p>
        <p><strong>Easy Solved:</strong> {data.easySolved || 'N/A'}</p>
        <p><strong>Medium Solved:</strong> {data.mediumSolved || 'N/A'}</p>
        <p><strong>Hard Solved:</strong> {data.hardSolved || 'N/A'}</p>
        <p><strong>Acceptance Rate:</strong> {data.acceptanceRate ? `${data.acceptanceRate.toFixed(2)}%` : 'N/A'}</p>
        <p><strong>Contribution Points:</strong> {data.contributionPoints || 'N/A'}</p>
        <p><strong>Reputation:</strong> {data.reputation || 'N/A'}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Contest Rating</h3>
        <p><strong>Contests Attended:</strong> {data.contestsAttended || 'N/A'}</p>
        <p><strong>Rating:</strong> {data.contestRating || 'N/A'}</p>
        <p><strong>Global Ranking:</strong> {data.contestGlobalRanking || 'N/A'}</p>
        <p><strong>Total Participants:</strong> {data.contestTotalParticipants || 'N/A'}</p>
        <p><strong>Top Percentage:</strong> {data.contestTopPercentage ? `${data.contestTopPercentage.toFixed(2)}%` : 'N/A'}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Language Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          {data.languageStats && data.languageStats.matchedUser.languageProblemCount.map((lang) => (
            <p key={lang.languageName}><strong>{lang.languageName}:</strong> {lang.problemsSolved}</p>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Skill Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          {data.skillStats && Object.entries(data.skillStats.data.matchedUser.tagProblemCounts).map(([level, tags]) => (
            <div key={level}>
              <h4 className="font-semibold capitalize">{level}</h4>
              {tags.map(tag => (
                <p key={tag.tagSlug}><strong>{tag.tagName}:</strong> {tag.problemsSolved}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Submission Calendar</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <CalendarHeatmap
            startDate={new Date('2024-01-01')}
            endDate={new Date('2024-12-31')}
            values={transformSubmissionData(data.submissionCalendar)}
            classForValue={(value) => {
              if (!value) return 'color-empty';
              return `color-github-${Math.min(value.count, 4)}`;
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderCodeforcesProfile = (data) => (
    <div className="grid grid-cols-2 gap-4">
      {data.rating && <p><strong>Current Rating:</strong> {data.rating}</p>}
      {data.maxRating && <p><strong>Max Rating:</strong> {data.maxRating}</p>}
      {data.rank && <p><strong>Rank:</strong> {data.rank}</p>}
      {data.maxRank && <p><strong>Max Rank:</strong> {data.maxRank}</p>}
      {data.contribution && <p><strong>Contribution:</strong> {data.contribution}</p>}
      {data.friendOfCount && <p><strong>Friend of:</strong> {data.friendOfCount}</p>}
      {data.lastOnline && <p><strong>Last Online:</strong> {data.lastOnline}</p>}
      {data.registrationDate && <p><strong>Registered:</strong> {data.registrationDate}</p>}
    </div>
  );

  const renderCodechefProfile = (data) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <p><strong>Current Rating:</strong> {data.currentRating || 'N/A'}</p>
        <p><strong>Highest Rating:</strong> {data.highestRating || 'N/A'}</p>
        <p><strong>Global Rank:</strong> {data.globalRank || 'N/A'}</p>
        <p><strong>Country Rank:</strong> {data.countryRank || 'N/A'}</p>
        <p><strong>Stars:</strong> {data.stars || 'N/A'}</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Submission Heatmap</h3>
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={`https://codechef-api.vercel.app/heatmap/${username}`}
              className="w-full h-full border-none"
              title="CodeChef Submission Heatmap"
              onError={(e) => {
                e.target.style.display = 'none';
                const errorMsg = document.createElement('p');
                errorMsg.textContent = 'Failed to load heatmap';
                e.target.parentNode.appendChild(errorMsg);
              }}
            ></iframe>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Rating Graph</h3>
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={`https://codechef-api.vercel.app/rating/${username}`}
              className="w-full h-full border-none"
              title="CodeChef Rating Graph"
              onError={(e) => {
                e.target.style.display = 'none';
                const errorMsg = document.createElement('p');
                errorMsg.textContent = 'Failed to load rating graph';
                e.target.parentNode.appendChild(errorMsg);
              }}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{platform.charAt(0).toUpperCase() + platform.slice(1)} Profile</h1>
      {detailedData && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <img 
              src={detailedData.avatar || defaultAvatar} 
              alt={`${detailedData.name || detailedData.username}'s avatar`} 
              className="w-24 h-24 rounded-full mr-4"
            />
            <div>
              <h2 className="text-2xl font-semibold">{detailedData.name || detailedData.username}</h2>
              {detailedData.country && <p className="text-gray-600">{detailedData.country}</p>}
            </div>
          </div>

          {platform === 'leetcode' && renderLeetCodeProfile(detailedData)}
          {platform === 'codeforces' && renderCodeforcesProfile(detailedData)}
          {platform === 'codechef' && renderCodechefProfile(detailedData)}
        </div>
      )}
    </div>
  );
};

export default DetailedView;
