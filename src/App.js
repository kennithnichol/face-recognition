import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enabled: true,
        value_area: 700
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
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: new Date()
  }
}

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
console.log(process.env);
console.log(apiUrl);

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined
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
      headers: { 'Content-Type': 'application/json' },
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
            headers: { 'Content-Type': 'application/json' },
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
    if (data.outputs[0].data.length < 1) {
      return false;
    }

    const regions = data.outputs[0].data.regions;
    return regions.map(this.calculateFaceLocation);
  }

  calculateFaceLocation = (region) => {
    if (!region.region_info) {
      return {};
    }

    const clarifaiFace = region.region_info.bounding_box;

    return {
      leftCol: `${clarifaiFace.left_col * 100}%`,
      topRow: `${clarifaiFace.top_row * 100}%`,
      rightCol: `${100 - clarifaiFace.right_col * 100}%`,
      bottomRow: `${100 - clarifaiFace.bottom_row * 100}%`
    }
  }

  displayFaceBoxes = (boxes) => {
    this.setState({boxes});
  }

  onRouteChange =(route)=> {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageUrl, boxes, route} = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
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
          : ( route === 'signin' || route === 'signout' ?
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
