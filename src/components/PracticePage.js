import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { fetchRecommendedProblems, calculateEquivalentRating } from '../utils/recommendationUtils';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const PracticePage = () => {
  const { currentUser } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [showTags, setShowTags] = useState({});

  useEffect(() => {
    const fetchProblems = async () => {
      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          const userAccounts = docSnap.data().accounts || {};
          const solvedProblems = docSnap.data().solvedProblems || [];
          const equivalentRating = calculateEquivalentRating(userAccounts);
          const recommendedProblems = await fetchRecommendedProblems(equivalentRating, 20); // Fetch more problems
          
          // Filter out solved problems
          const unsolvedProblems = recommendedProblems.filter(problem =>
            !solvedProblems.some(solvedProblem =>
              solvedProblem.contestId === problem.contestId && solvedProblem.index === problem.index
            )
          );

          setProblems(unsolvedProblems);
        }
        setLoading(false);
      }
    };
    fetchProblems();
  }, [currentUser]);

  const handleMarkAsDone = async (problem) => {
    if (currentUser) {
      const userDoc = doc(db, 'users', currentUser.uid);
      await updateDoc(userDoc, {
        solvedProblems: arrayUnion(problem)
      });
      // Remove the marked problem from the problems array
      setProblems((prevProblems) => prevProblems.filter(p => p.contestId !== problem.contestId || p.index !== problem.index));

      // Fetch more problems if the list gets too short
      if (problems.length < 5) {
        await loadMoreProblems();
      }
    }
  };

  const loadMoreProblems = async () => {
    if (fetchingMore || !currentUser) return;
    setFetchingMore(true);

    const userDoc = doc(db, 'users', currentUser.uid);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      const userAccounts = docSnap.data().accounts || {};
      const solvedProblems = docSnap.data().solvedProblems || [];
      const equivalentRating = calculateEquivalentRating(userAccounts);
      const moreProblems = await fetchRecommendedProblems(equivalentRating, 20); // Fetch additional problems
      
      // Filter out solved problems
      const unsolvedProblems = moreProblems.filter(problem =>
        !solvedProblems.some(solvedProblem =>
          solvedProblem.contestId === problem.contestId && solvedProblem.index === problem.index
        )
      );

      setProblems((prevProblems) => [...prevProblems, ...unsolvedProblems]);
    }
    setFetchingMore(false);
  };

  const toggleTagsVisibility = (index) => {
    setShowTags(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Practice Problems</h1>
      {problems.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {problems.map((problem, index) => (
            <li key={`${problem.contestId}-${problem.index}`} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <a
                    href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {problem.name} [{problem.rating}]
                  </a>
                  <button
                    onClick={() => toggleTagsVisibility(index)}
                    className="ml-4 text-sm text-gray-600 hover:text-gray-800"
                  >
                    {showTags[index] ? 'Hide Tags' : 'Show Tags'}
                  </button>
                  {showTags[index] && (
                    <p className="text-sm text-gray-600 mt-2">{problem.tags.join(', ')}</p>
                  )}
                </div>
                <button
                  onClick={() => handleMarkAsDone(problem)}
                  className="bg-green-500 text-white p-2 rounded-lg"
                >
                  Mark as Done
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500">No recommended problems found.</div>
      )}
      {fetchingMore && <div className="text-center text-gray-500 mt-4">Loading more problems...</div>}
    </div>
  );
};

export default PracticePage;
