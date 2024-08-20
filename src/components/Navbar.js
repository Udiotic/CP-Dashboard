import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
    const { currentUser, logOut } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">CP Dashboard</Link>
                <div>
                    {currentUser ? (
                        <div>
                            <span>{currentUser.displayName || currentUser.email}</span>
                            <button onClick={logOut} className="navbar-button signout">
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <Link to="/signin" className="navbar-button signin">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
