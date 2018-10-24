import React from 'react';
import ProfileIcon from '../Profile/ProfileIcon';

const Navigation = ({onRouteChange, isSignedIn}) => {
	if (isSignedIn) {
		return (
			<nav className="flex justify-end">
				<ProfileIcon onRouteChange={onRouteChange} />
			</nav>
		)
	} else {
		return (
			<nav className="flex justify-end">
				<p onClick={() => onRouteChange('signin')} className="f3 link dim black underline pa3 pointer">Sign In</p>
				<p onClick={() => onRouteChange('register')} className="f3 link dim black underline pa3 pointer">Register</p>
			</nav>
		)
	}
};

export default Navigation;
