import React, { Component } from 'react';
import './App.css';
import { ArrowDropUp, ArrowDropDown } from '@material-ui/icons';

export default class Elevator extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div>
				<div className="UpArrow" style={{height: '150px', fontSize: '100px', lineHeight: '150px'}}>
					<ArrowDropUp
						style={{fontSize: '84px', position: 'absolute', top: 85, left: 534, color: this.props.direction === 'up' ? '#E71D36' : '#343434'}}
					/>
					<ArrowDropUp
						style={{color: '#343434'}}
						fontSize='inherit'
					/>
				</div>
				<div className="Center" style={{height: '300px'}}>
					<div 
						className="DoorsContainer"
						onMouseDown={
							() => {
								if(this.props.doors === 'closing') {
									this.props.changeDoors('stopped');
									setTimeout(
										function() {
											this.props.changeDoors('opening')
											setTimeout(
												function() {
													this.props.changeDoors('closing')
												}.bind(this),
											3000)
										}.bind(this), 
									500);
								} else if(this.props.doors === 'open') {
									this.props.changeDoors('closing')
								} else if(this.props.doors === 'closed' && this.props.direction === 'stopped') {
									this.props.changeDoors('opening')
								}
							}
						}
						style={{cursor: 'pointer', height: '-webkit-fill-available', margin: '20px', borderTop: '2px solid #343434', borderBottom: '2px solid #343434', backgroundColor: '#E71D36'}}
					>
						<div 
							className="LeftDoor" 
							style={{
								float: 'left',
								height: '256px',
								backgroundColor: '#EEE',
								width: this.props.doorWidth,
								borderLeft: '2px solid #343434',
								borderRight: '2px solid #343434'
							}}
						/>
						<div 
							className="RightDoor" 
							style={{
								float: 'right',
								height: '256px',
								backgroundColor: '#EEE',
								width: this.props.doorWidth,
								borderLeft: '2px solid #343434',
								borderRight: '2px solid #343434'
							}}
						/>
					</div>
				</div>
				<div className="DownArrow" style={{height: '150px', fontSize: '100px', lineHeight: '150px'}}>
					<ArrowDropDown
						style={{fontSize: '84px', position: 'absolute', top: 555, left: 534, color: this.props.direction === 'down' ? '#E71D36' : '#343434'}}
					/>
					<ArrowDropDown
						style={{color: '#343434'}}
						fontSize='inherit'
					/>
				</div>
			</div>
		)
	}

}