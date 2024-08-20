import React from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const { currentUser } = useAuth();

    return (
        <div className="container">
            <div className="landing-page">
                {currentUser ? (
                    <div>Hello User!</div>
                ) : (
                    <div className="text-center">
                        <h1 className="landing-title">
                            Welcome to <span>The CP Dashboard!</span>
                        </h1>
                        <p className="landing-subtitle">
                            Your Personal Competitive Programming Dashboard
                        </p>
                        <div className="mt-5 flex justify-center space-x-4">
                            <Link to="/signup" className="quiz-card-button">
                                Get started
                            </Link>
                            <Link to="/signin" className="quiz-card-button">
                                Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;
