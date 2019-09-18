import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Elevator from './Elevator';
import Buttons from './Buttons';

export default class Main extends Component {

	constructor(props) {
		super(props)

		this.changeDoors = this.changeDoors.bind(this)
		this.scrolling = this.scrolling.bind(this)
		this.addToQueue = this.addToQueue.bind(this)
		this.shiftQueue = this.shiftQueue.bind(this)
		this.scrollQueue = this.scrollQueue.bind(this)
		this.doorWidth = this.doorWidth.bind(this)

		this.state = {
			direction: 'stopped', // stopped, up, down
			doors: 'closed', // closed, open, closing, opening, stopped
			doorWidth: 168,
			currentFloor: 1,
			queue: [], // 30-0 (0 => B)
			queuePos: [0, 160, 320, 480, 640, 800, 960, 1120, 1280, 1440, 1600, 1760, 1920, 2080, 2240, 2400, 2560, 2720, 2880, 3040, 3200, 3360, 3520, 3680, 3840, 4000, 4160, 4320, 4480, 4640],
			floors: [30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
			scrollPos: 4480, // 0-4640 (160 for each)
			scrollVel: 0, // (-) for up, (+) for down
			scrollQueueStep: 0,
			scrolling: false
		}

	}

	componentDidMount() {
		this.interval = setInterval(() => {
			this.doorWidth()
			this.scrollQueue()
		}, 10);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	changeDoors(status) {
		this.setState(() => ({ doors: status }))
	}

	scrolling() {
		if(this.state.scrolling) clearTimeout(this.state.scrolling)
		this.setState(prevState => ({
			scrolling: setTimeout( function() {
				this.setState({ scrolling: false })
			}.bind(this), 2000)
		}))
	}

	addToQueue(floor) {
		if(this.state.queue.includes(floor)) return;
		
		let floorPos = this.state.queuePos[this.state.floors.indexOf(floor)]

		if(this.state.direction === 'stopped') {
			this.setState(prevState => {
				let queue = prevState.queue;
				queue.push(floor);
				let direction = 'stopped';
				if(floor < prevState.currentFloor) direction = 'down';
				else if(floor > prevState.currentFloor) direction = 'up';
				return { queue, direction }
			})
		} else if(this.state.direction === 'up') {
			this.setState(prevState => {
				let queue = prevState.queue;
				if(floorPos > prevState.scrollPos) {
					let pushFound = false;
					for(let i = 0; i < queue.length; i++) {
						if(floor > queue[i]) {
							pushFound = true;
							queue.splice(i, 0, floor)
							break;
						}
					}
					if(!pushFound) queue.push(floor);
				}
				else if(floorPos < prevState.scrollPos) {
					let pushFound = false;
					for(let i = 0; i < queue.length; i++) {
						if(floor < queue[i]) {
							pushFound = true;
							queue.splice(i, 0, floor)
							break;
						}
					}
					if(!pushFound) {
						queue.splice(queue.indexOf(Math.max(...queue)) + 1, 0, floor);
					}
				}
				return { queue }
			})
		} else if(this.state.direction === 'down') {
			this.setState(prevState => {
				let queue = prevState.queue;
				if(floorPos > prevState.scrollPos) {
					let pushFound = false;
					for(let i = 0; i < queue.length; i++) {
						if(floor > queue[i]) {
							pushFound = true;
							queue.splice(i, 0, floor)
							break;
						}
					}
					if(!pushFound) {
						queue.splice(queue.indexOf(Math.min(...queue)) + 1, 0, floor);
					}
				}
				else if(floorPos < prevState.scrollPos) {
					let pushFound = false;
					for(let i = 0; i < queue.length; i++) {
						if(floor < queue[i]) {
							pushFound = true;
							queue.splice(i, 0, floor)
							break;
						}
					}
					if(!pushFound) queue.push(floor);
				}
				return { queue }
			})
		}
	}

	shiftQueue() {
		this.setState(prevState => {
			let queue = prevState.queue;
			queue.shift();
			if(queue.length === 0) {
				return { queue: [], direction: 'stopped' }
			} else if(this.state.scrollPos > this.state.queuePos[this.state.floors.indexOf(queue[0])] && this.state.scrollPos > this.state.queuePos[this.state.floors.indexOf(queue[queue.length - 1])]) {
				return { queue, direction: 'up' }
			} else if(this.state.scrollPos < this.state.queuePos[this.state.floors.indexOf(queue[0])] && this.state.scrollPos < this.state.queuePos[this.state.floors.indexOf(queue[queue.length - 1])]) {
				return { queue, direction: 'down' }
			}
			return { queue }
		})
	}

	scrollQueue() {
		// speed up, move, slow down, stop, wait 1s, open, wait 2s, close, wait 1s
		// |----------- Step 0 -----------||--------------- Step 1 --------------||- Step 2 -|

		if(!this.state.scrolling)
			document.getElementById("ScrollQueueContainer").scrollTop = this.state.scrollPos;

		let nextUp = this.state.queuePos[this.state.floors.indexOf(this.state.queue[0])];
		let step = this.state.scrollQueueStep;

		if(nextUp) {
			if(step === 0) {
				this.setState(prevState => {
					if(prevState.scrollPos >= nextUp - 2 && prevState.scrollPos <= nextUp + 2) {
						return { scrollPos: nextUp, scrollVel: 0, scrollQueueStep: 1 }
					} else {
						let scrollVel = prevState.scrollVel;
						if(this.state.direction === 'up') {
							if(prevState.scrollPos <= nextUp + 60 && prevState.scrollPos >= nextUp) {
								scrollVel = Math.min(scrollVel + 0.01, -0.2)
							} else if(prevState.scrollVel > -1) {
								scrollVel = Math.max(scrollVel - 0.01, -1)
							}
						} else if(this.state.direction === 'down') {
							if(prevState.scrollPos >= nextUp - 60 && prevState.scrollPos <= nextUp) {
								scrollVel = Math.max(scrollVel - 0.01, 0.2)
							} else if(prevState.scrollVel < 1) {
								scrollVel = Math.min(scrollVel + 0.01, 1)
							}
						}
						return { scrollPos: prevState.scrollPos + scrollVel, scrollVel }
					}
				})
			} else if(step === 1) {
				this.setState({ scrollQueueStep: 2, currentFloor: this.state.queue[0] }, () => {
					this.shiftQueue();
					setTimeout( function() {
						this.changeDoors('opening');
						setTimeout( function() {
								this.changeDoors('closing');
						}.bind(this), 4000);
					}.bind(this), 1000);
				})	
			} else if(step === 2) {
				setTimeout( function() {
					if(this.state.doors === 'closed') {
						this.setState({ scrollQueueStep: 0 })
					}
				}.bind(this), 1500)
			}

		}

	}

	doorWidth() {

		// min = 38px
		// max = 168px

		let dw = this.state.doorWidth;

		if(this.state.doors === 'closed' && dw !== 168) dw = 168;
		else if(this.state.doors === 'open' && dw !== 38) dw = 38;
		else if(this.state.doors === 'closing' && dw < 168) {
			dw += 1;
			if(dw >= 168) {
				this.changeDoors('closed')
			}
		}
		else if(this.state.doors === 'opening' && dw > 38) {
			dw -= 1;
			if(dw <= 38) {
				this.changeDoors('open')
			}
		}

		this.setState(
			prevState => { 
				if(prevState.doorWidth !== dw)
					return { doorWidth: dw }
			}
		)

	}

	render() {
		return(
			<div 
				style={{
					width: '1536px', 
					height: '610px', 
					padding: '56px 0px',
					backgroundImage: 'radial-gradient(circle, #777, white)'
				}}
			>
				<div 
					style={{
						width: '768px', 
						height: '600px', 
						margin: '0 auto', 
						border: '5px outset #999',
						backgroundColor: '#727272',
						boxShadow: '0px 0px 0px 0.5px #222'
					}}
				>
					<div
						style={{
							float: 'left',
							width: '50%',
							height: '100%'
						}}
					>
						<Elevator
							direction={this.state.direction}
							doors={this.state.doors}
							doorWidth={this.state.doorWidth}
							changeDoors={this.changeDoors}
						/>
					</div>
					<div
						style={{
							float: 'left',
							width: '50%',
							height: '100%'
						}}
					>
						<Buttons
							floors={this.state.floors}
							changeDoors={this.changeDoors}
							addToQueue={this.addToQueue}
							queue={this.state.queue}
							scrollPos={this.state.scrollPos}
							scrolling={this.scrolling}
						/>
					</div>
				</div>
			</div>
		);
	}

}