import React, { Component } from 'react';
import './Profile.css';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: this.props.user.name || '',
			age: this.props.user.age || '',
			pet: this.props.user.pet || ''
		}
	}

	onFormChange = (event) => {
		switch(event.target.name) {
			case 'user-name':
				this.setState({ name: event.target.value })
				break;
			case 'user-age':
				this.setState({ age: event.target.value })
				break;
			case 'user-pet':
				this.setState({ pet: event.target.value })
				break;
			default: break;
		}
	}

	onSaveSubmit = (data) => {
		fetch(`http://localhost:3000/profile/${this.props.user.id}`, {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ formInput: data })
		})
			.then(resp => {
				this.props.toggleModal();
				this.props.loadUser({ ...this.props.user, ...data});
			})
			.catch(console.log);
	}

	render() {
		const { toggleModal, user } = this.props;
		const { name, age, pet } = this.state;
		return (
			<div className='profile-modal'>
				<article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'>
					<main className="pa4 black-80">
						<img src="http://tachyons.io/img/logo.jpg"
							className="h3 w3 dib" alt="avatar" />
						<h1>{name}</h1>
						<h4>{`Images submitted: ${user.entries}`}</h4>
						<p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
						<hr />
				        <label className="mt2 fw6" htmlFor="user-name">Name:</label>
				        <input
				        	className="pa2 ba w-100"
				        	type="text"
				        	placeholder={user.name}
				        	name="user-name"
				        	id="user-name"
				        	onChange={this.onFormChange}
				        />
				        <label className="mt2 fw6" htmlFor="user-age">Age:</label>
				        <input
				        	className="pa2 ba w-100"
				        	type="text"
				        	placeholder={user.age}
				        	name="user-age"
				        	id="user-age"
				        	onChange={this.onFormChange}
				        />
				        <label className="mt2 fw6" htmlFor="user-pet">Pet:</label>
				        <input
				        	className="pa2 ba w-100"
				        	type="text"
				        	placeholder={user.pet}
				        	name="user-pet"
				        	id="user-pet"
				        	onChange={this.onFormChange}
				        />
				        <div className="mt4" style={{ display: 'flex', justifyContent: 'space-evenly' }}>
				        	<button className='b pa2 grow pointer hover-white w-40 bg-light-green b--black-20' onClick={() => { this.onSaveSubmit({name, age, pet}) }} >Save</button>
				        	<button className='b pa2 grow pointer hover-white w-40 bg-light-red b--black-20' onClick={toggleModal}>Cancel</button>
				        </div>
					</main>
					<button onClick={toggleModal} className="modal-close">&times;</button>
				</article>
			</div>
		);
	};
}

export default Profile;
