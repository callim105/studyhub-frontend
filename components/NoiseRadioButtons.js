import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

export default class NoiseRadioButtons extends Component {
	state = {
		value: null,
	};

	render() {
		const { options } = this.props;
		const { value } = this.state;

		return (
			<View style={{flexDirection:'row', justifyContent: 'space-around'}}>
				{options.map(item => {
					return (
						<View key={item.key} style={styles.buttonContainer}>
							<Text>{item.text}</Text>
							<TouchableOpacity
								style={styles.circle}
								onPress={async () => {
									await this.setState({
										value: item.key,
                                    });
                                    this.props.setNoiseLevel(this.state.value)
								}}
							>
								{value === item.key && <View style={styles.checkedCircle} />}
							</TouchableOpacity>
						</View>
					);
				})}
			</View>
		);
	}
}


//NEED VALIDATIONS FOR HUB SUBMIT

const styles = StyleSheet.create({
	buttonContainer: {
		justifyContent: 'space-between',
		alignItems: 'center',
	
	},

	circle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ACACAC',
		alignItems: 'center',
		justifyContent: 'center',
	},
  
	checkedCircle: {
		width: 14,
		height: 14,
		borderRadius: 7,
		backgroundColor: '#794F9B',
	},
});