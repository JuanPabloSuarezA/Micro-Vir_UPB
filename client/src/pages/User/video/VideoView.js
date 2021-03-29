import React, { Component } from "react";

export default class VideoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idVideo: this.props.match.params.idVideo,
      videoInfo: {},
    };
  }
  async componentDidMount() {
    try {
      const res = await fetch(
        `http://localhost:4000/videos/${this.state.idVideo}/videoInfo`
      ).then((response) => {
        return response.json();
      });
      this.setState({ videoInfo: res });
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div style={{ border: "solid black 1px" }}>
            <video
              controls
              autoPlay
              style={{ height: "350px", width: "600px" }}
            >
              <source
                src={`http://localhost:4000/videos/${this.state.idVideo}`}
                type="video/mp4"
              ></source>
            </video>
            <h6>{this.state.videoInfo.name}</h6>
          </div>
        </header>
      </div>
    );
  }
}
