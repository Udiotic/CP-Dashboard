// src/utils/recommendationUtils.js
import axios from 'axios';

export const calculateEquivalentRating = (accounts) => {
    let codeforcesRating = accounts.codeforces?.rating || 0;
    let leetcodeRating = (accounts.leetcode?.contestRating || 0) - 400;
    let codechefRating = (accounts.codechef?.currentRating || 0) - 400;
  
    return Math.max(codeforcesRating, leetcodeRating, codechefRating);
  };
  
  export const fetchRecommendedProblems = async (equivalentRating) => {
    try {
      const response = await axios.get('https://codeforces.com/api/problemset.problems');
      const problems = response.data.result.problems;
  
      const recommendedProblems = problems.filter(problem => 
        problem.rating && Math.abs(problem.rating - equivalentRating) <= 200
      );
  
      return recommendedProblems.slice(0, 20);
    } catch (error) {
      console.error('Error fetching recommended problems:', error);
      throw error;
    }
  };
  