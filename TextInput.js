import React, { PureComponent } from 'react';
import { TextInput } from 'react-native';

// pass in an onChangeText function that accepts the current text as param.
// This will be called every 100ms if text has changed since last check.
export class TextInputPoll extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      text: props.defaultText,
      interval: null,
      previousText: null,
    };
  }

  saveTextToReduxState() {
    if (this.state.previousText !== this.state.text) {
      this.setState({ previousText: this.state.text });
      this.props.onChangeText(this.state.text);
    }
  }

  startUpdatingStateOnInterval() {
    if (!this.state.interval) {
      this.setState({
        interval: setInterval(() => {
          this.saveTextToReduxState();
        }, 100),
      });
    }
  }

  stopUpdatingStateOnInterval() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
      this.setState({ interval: null });
    }
  }

  render() {
    return (
      <TextInput
        value={this.state.text}
        onEndEditing={() => {
          this.stopUpdatingStateOnInterval();
          this.saveTextToReduxState();
        }}
        onChangeText={(text) => {
          this.setState({ text });
          this.startUpdatingStateOnInterval();
        }}
      />
    );
  }
}
