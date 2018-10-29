import React, { Component } from 'react';

class Rank extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emoji: ''
		}
	}

	componentDidMount() {
		this.updateEmoji();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.entries === this.props.entries && prevProps.name === this.props.name) {
			return null;
		}
		this.updateEmoji();
	}

	updateEmoji() {
		this.generateEmoji(this.props.entries);
	}

	generateEmoji = (entries) => {
		fetch(`https://g29qd812gg.execute-api.us-west-2.amazonaws.com/prod/rank?rank=${entries}`)
			.then(response => response.json())
			.then(data => {
				this.setState({ emoji: data.input})
			})
			.catch(console.log)
	}

	render() {
		const {name, entries} = this.props;
		return (
			<div>
				<div className="white f3">
					{ `${name}, your current entry count is...`}
				</div>
				<div className="white f1">
					{ entries }
				</div>
				<div className="white f3">
					{ `Rank Badge: ${this.state.emoji}` }
				</div>
			</div>
		);
	}
}

export default Rank;
