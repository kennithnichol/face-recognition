import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';

const app = new Clarifai.App({
  apiKey: '12b8d911c29948be8a4e76f008056c43'
});

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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(console.log)
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    return {
      leftCol: `${clarifaiFace.left_col * 100}%`,
      topRow: `${clarifaiFace.top_row * 100}%`,
      rightCol: `${100 - clarifaiFace.right_col * 100}%`,
      bottomRow: `${100 - clarifaiFace.bottom_row * 100}%`
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box});
  }

  onRouteChange =(route)=> {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageUrl, box, route} = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' ?
          <div>
              <Logo />
              <Rank />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onSubmit}
              />
              <FaceRecognition imageUrl={imageUrl} box={box} />
            </div>
          : ( route === 'signin' || route === 'signout' ?
              <Signin onRouteChange={this.onRouteChange} />
            :
              <Register onRouteChange={this.onRouteChange} />
            )
          }
      </div>
    );
  }
}

export default App;
