import axios from 'axios';

const LEETCODE_API_URL = 'https://alfa-leetcode-api.onrender.com';
const CODECHEF_API_URL = 'https://codechef-api.vercel.app/handle';

export const fetchLeetCodeData = async (username) => {
  try {
    const profileResponse = await axios.get(`${LEETCODE_API_URL}/${username}`);
    console.log('Profile Response:', profileResponse.data);

    const fullprofileResponse = await axios.get(`${LEETCODE_API_URL}/userProfile/${username}`);
    console.log('Detailed Profile Response:', fullprofileResponse.data);

    const solvedResponse = await axios.get(`${LEETCODE_API_URL}/${username}/solved`);
    console.log('Solved Response:', solvedResponse.data);

    const contestResponse = await axios.get(`${LEETCODE_API_URL}/${username}/contest`);
    console.log('Contest Response:', contestResponse.data);

    const calendarResponse = await axios.get(`${LEETCODE_API_URL}/${username}/calendar`);
    console.log('Calendar Response:', calendarResponse.data);

    const skillStatsResponse = await axios.get(`${LEETCODE_API_URL}/skillStats/${username}`);
    console.log('Skill Stats Response:', skillStatsResponse.data);

    const languageStatsResponse = await axios.get(`${LEETCODE_API_URL}/languageStats?username=${username}`);
    console.log('Language Stats Response:', languageStatsResponse.data);

    const profile = profileResponse.data;
    const fullprofile = fullprofileResponse.data;
    const solved = solvedResponse.data;
    const contest = contestResponse.data;
    const calendar = calendarResponse.data;
    const skillStats = skillStatsResponse.data;
    const languageStats = languageStatsResponse.data;
    const totalSubmissionsCount = fullprofile.totalSubmissions.reduce((sum, submission) => sum + submission.submissions, 0);
    const acceptanceRate = (totalSubmissionsCount === 0) ? 0 : ((solved.solvedProblem / totalSubmissionsCount) * 100);
    return {
      username: profile.username,
      name: profile.name,
      avatar: profile.avatar,
      ranking: profile.ranking,
      totalSolved: solved.solvedProblem,
      easySolved: solved.easySolved,
      mediumSolved: solved.mediumSolved,
      hardSolved: solved.hardSolved,
      acceptanceRate: Number(acceptanceRate.toFixed(2)),
      contributionPoints: fullprofile.contributionPoint,
      reputation: fullprofile.reputation || '0',
      contestsAttended: contest.contestAttend,
      contestRating: contest.contestRating.toFixed(0),
      contestGlobalRanking: contest.contestGlobalRanking,
      contestTotalParticipants: contest.totalParticipants,
      contestTopPercentage: contest.contestTopPercentage,
      skillStats: skillStats,
      languageStats: languageStats,
      submissionCalendar: calendar
    };
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    throw error;
  }
};



export const fetchCodeforcesData = async (username) => {
  try {
    const CODEFORCES_API_URL = `https://codeforces.com/api/user.info?handles=${username}`;
    console.log('Fetching data from:', CODEFORCES_API_URL);

    const response = await axios.get(CODEFORCES_API_URL);
    const userData = response.data.result[0];

    // Ensure no undefined values are passed to Firestore
    const safeUserData = {
      username: userData.handle || 'N/A',
      avatar: userData.avatar || '',
      country: userData.country || false,
      rating: userData.rating || 0,
      maxRating: userData.maxRating || 0,
      rank: userData.rank || 'N/A',
      maxRank: userData.maxRank || 'N/A',
      contribution: userData.contribution || '0',
      friendOfCount: userData.friendOfCount || '0',
      lastOnline: userData.lastOnlineTimeSeconds ? new Date(userData.lastOnlineTimeSeconds * 1000).toLocaleString() : 'Unknown',
      registrationDate: userData.registrationTimeSeconds ? new Date(userData.registrationTimeSeconds * 1000).toLocaleString() : 'Unknown',
    };

    return safeUserData;
  } catch (error) {
    console.error('Error fetching Codeforces data:', error);
    if (error.response) {
      console.error('Response Data:', error.response.data);
    }
    throw error;
  }
};


export const fetchCodeChefData = async (username) => {
  try {
    const response = await axios.get(`${CODECHEF_API_URL}/${username}`);
    console.log('Codechef Response:', response.data);
    const userData = response.data;
    return {
      username: username,
      name: userData.name,
      country: userData.countryName,
      avatar: userData.profile,
      currentRating: userData.currentRating,
      highestRating: userData.highestRating,
      globalRank: userData.globalRank,
      countryRank: userData.countryRank,
      stars: userData.stars,
    };
  } catch (error) {
    console.error('Error fetching CodeChef data:', error);
    throw error;
  }
};

export const fetchDetailedData = async (platform, username) => {
  switch (platform) {
    case 'leetcode':
      return fetchLeetCodeData(username);
    case 'codeforces':
      return fetchCodeforcesData(username);
    case 'codechef':
      return fetchCodeChefData(username);
    default:
      throw new Error('Unsupported platform');
  }
};


