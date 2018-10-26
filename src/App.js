import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';

import './App.css';

const particlesOptions = {
  particles: {
	number: {
	  value: 80,
	  density: {
		enabled: true,
		value_area: 800
	  }
	}
  }
};

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
	id: '',
	name: '',
	email: '',
	entries: 0,
	joined: '',
	pet: '',
	age: ''
  }
}

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class App extends Component {
  constructor() {
	super();
	this.state = initialState;
  }

  componentDidMount() {
  	const token = window.sessionStorage.getItem('token');
	if (token) {
		fetch(`${apiUrl}/signin`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			}
		}).then(resp => resp.json())
		.then(data => {
			if (data && data.id) {
				fetch(`${apiUrl}/profile/${data.id}`, {
					method: 'get',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': token
					}
				})
				.then(resp => resp.json())
				.then(user => {
					if (user && user.email) {
						this.loadUser(user);
						this.onRouteChange('home');
					}
				})
			}
		}).catch(console.log);
	}
  }

  loadUser = (user) => {
	this.setState({
	  user: {
		id: user.id,
		name: user.name,
		email: user.email,
		entries: user.entries,
		joined: user.joined,
		pet: user.pet,
		age: user.age,
	  }
	})
  }

  onInputChange = (event) => {
	this.setState({input: event.target.value});
  }

  onSubmit = () => {
	this.setState({imageUrl: this.state.input})
	fetch(`${apiUrl}/imageurl`, {
	  method: 'post',
	  headers: { 
	  	'Content-Type': 'application/json',
	  	'Authorization': window.sessionStorage.getItem('token')
	  },
	  body: JSON.stringify({
		input: this.state.input
	  })
	})
	  .then(response => response.json())
	  .then(response => {
		if (response) {
		  fetch(`${apiUrl}/image`,
		  {
			method: 'put',
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': window.sessionStorage.getItem('token')
			},
			body: JSON.stringify({
			  id: this.state.user.id
			})
		  })
		  .then(response => response.json())
		  .then(count => {
			this.setState({user: Object.assign(this.state.user, { entries: count }) })
		  })
		  .catch(console.log)
		}
		this.displayFaceBoxes(this.calculateFaceLocations(response))
	  })
	  .catch(console.log)
  }

  calculateFaceLocations = (data) => {
  	if (!data || !data.outputs)
  		return;

	return data.outputs[0].data.regions.map((region) => {
	  const clarifaiFace = region.region_info.bounding_box;
	  return {
		leftCol: `${clarifaiFace.left_col * 100}%`,
		topRow: `${clarifaiFace.top_row * 100}%`,
		rightCol: `${100 - clarifaiFace.right_col * 100}%`,
		bottomRow: `${100 - clarifaiFace.bottom_row * 100}%`
	  }
	});
  }

  displayFaceBoxes = (boxes) => {
	if (boxes)
		this.setState({boxes});
  }

  onRouteChange = (route) => {
		if (route === 'signout') {
		  return this.setState(initialState)
		} else if (route === 'home') {
		  this.setState({isSignedIn: true})
		}
		this.setState({route: route});
  }

  toggleModal = () => {
  	this.setState(prevState => ({
  		...prevState,
  		isProfileOpen: !prevState.isProfileOpen
  	}))
  }

  render() {
		const {isSignedIn, imageUrl, boxes, route, isProfileOpen, user} = this.state;
		return (
		  <div className="App">
			<Particles className="particles" params={particlesOptions} />
			<Navigation
				isSignedIn={isSignedIn}
				onRouteChange={this.onRouteChange}
				toggleModal={this.toggleModal}
			/>
			{
				isProfileOpen &&
					<Modal>
						<Profile apiUrl={apiUrl} loadUser={this.loadUser} ProfileOpen={isProfileOpen} toggleModal={this.toggleModal} user={user} />
					</Modal>
		  }
			{ route === 'home' ?
			  <div>
				  <Logo />
				  <Rank name={this.state.user.name} entries={this.state.user.entries} />
				  <ImageLinkForm
					onInputChange={this.onInputChange}
					onButtonSubmit={this.onSubmit}
				  />
				  <FaceRecognition imageUrl={imageUrl} boxes={boxes} />
				</div>
			  : ( route === 'signin' ?
				  <Signin apiUrl={apiUrl} loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
				:
				  <Register apiUrl={apiUrl} loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
				)
			  }
		  </div>
		);
  }
}

export default App;
