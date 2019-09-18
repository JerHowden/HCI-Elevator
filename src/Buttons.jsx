import React, { Component } from 'react';
import './App.css';
import { ChevronRight } from '@material-ui/icons';

export default class Buttons extends Component {

	constructor(props) {
		super(props)

		this.ordinal = this.ordinal.bind(this)

	}

	ordinal(num) {
	    let ones = num % 10
	    if (ones == 1 && num != 11) {
	        return num + "st";
	    }
	    if (ones == 2 && num != 12) {
	        return num + "nd";
	    }
	    if (ones == 3 && num != 13) {
	        return num + "rd";
	    }
	    return num + "th";
	}

	render() {
		return(
			<div style={{margin: '16px 20px', height: 564, width: 344, overflow: 'hidden', position: 'relative'}}>
				<div
					id="ScrollQueueContainer"
					style={{
						borderTop: '2px solid #343434', borderBottom: '2px solid #343434', 
						position: 'absolute', top: 0, bottom: 0, left: 0, right: -17, overflowY: 'scroll'
					}}
					onWheel={this.props.scrolling}
				>
					<ChevronRight
						style={{position: 'absolute', top: this.props.scrollPos + 255 + 'px', left: -18, fontSize: 50, zIndex: 1, color: '#343434'}}
					/>
					<div style={{height: 200}} />
					{
						this.props.floors.map(floor => {
							let floorText = floor > 0 ? this.ordinal(floor) + ' Floor' : 'Basement'
							let color = this.props.queue.includes(floor) ? '#E71D36' : 'white'
							return(
								<div
									style={{
										color: color,
										font: '32px roboto, sans-serif', textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', 
										width: 344, height: 160, lineHeight: '160px', textAlign: 'center'
									}}
									onClick={() => this.props.addToQueue(floor)}
								>
									{floorText}
								</div>
							)
						})
					}
					<div style={{height: 200}} />
				</div>
			</div>
		)
	}

}