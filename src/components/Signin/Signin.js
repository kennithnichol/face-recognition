import React, { Component } from 'react';

class Signin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signInEmail: '',
			signInPassword: ''
		}
	}

	onSigninSubmit = (event) => {
		const { apiUrl } = this.props;

		fetch(`${apiUrl}/signin`, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})
		})
		.then(resp => resp.json())
		.then(session => {
			if (session.userId && 'true' === session.success) {
				this.saveAuthTokenInSession(session.token);
				fetch(`${apiUrl}/profile/${session.userId}`, {
					method: 'get',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': session.token
					}
				})
				.then(resp => resp.json())
				.then(user => {
					if (user && user.email) {
						this.props.loadUser(user);
						this.props.onRouteChange('home');
					}
				})
			}
		})
		.catch(err => console.log(err));
	}

	onEmailChange = (event) => {
		this.setState({signInEmail: event.target.value});
	}

	onPasswordChange = (event) => {
		this.setState({signInPassword: event.target.value});
	}

	saveAuthTokenInSession = (token) => {
		window.sessionStorage.setItem('token', token);
	}


	render() {
		const { onRouteChange } = this.props;
		return (
			<article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'>
				<main className="pa4 black-80">
				  <div className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input
				        	onChange={this.onEmailChange}
				        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
				        	type="email"
				        	name="email-address"
				        	id="email-address" />
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input
				        	onChange={this.onPasswordChange}
				        	className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
				        	type="password"
				        	name="password"
				        	id="password" />
				      </div>
				    </fieldset>
				    <div className="">
				      <button
				      	onClick={this.onSigninSubmit}
				      	className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
				      >
				      	Sign in
				      </button>
				    </div>
				    <div className="lh-copy mt3">
				      <a onClick={()=>onRouteChange('register')} href="#0" className="f6 link dim black db">Register</a>
				    </div>
				  </div>
				</main>
			</article>
		)
	}
}

export default Signin;
