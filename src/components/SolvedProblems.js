// src/components/SolvedProblemsPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';

const SolvedProblems = () => {
  const { currentUser } = useAuth();
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setSolvedProblems(docSnap.data().solvedProblems || []);
        }
        setLoading(false);
      }
    };
    fetchSolvedProblems();
  }, [currentUser]);

  const handleRemoveFromSolved = async (problem) => {
    if (currentUser) {
      const userDoc = doc(db, 'users', currentUser.uid);
      await updateDoc(userDoc, {
        solvedProblems: arrayRemove(problem)
      });
      setSolvedProblems((prevProblems) =>
        prevProblems.filter(
          (p) => p.contestId !== problem.contestId || p.index !== problem.index
        )
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Solved Problems</h1>
      {solvedProblems.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {solvedProblems.map((problem, index) => (
            <li key={`${problem.contestId}-${problem.index}`} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <a
                  href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {problem.name} [{problem.rating}]
                </a>
                <p className="text-sm text-gray-600 mt-2">{problem.tags.join(', ')}</p>
              </div>
              <button
                onClick={() => handleRemoveFromSolved(problem)}
                className="bg-red-500 text-white p-2 rounded-lg"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500">No solved problems found.</div>
      )}
    </div>
  );
};

export default SolvedProblems;
