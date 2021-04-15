import React from "react";

class MkDir extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ name: e.target.value });
  }
  handleSubmit(e) {
    this.props.onSubmit(this.state.name);
  }
  render() {
    return (
      <div className="container">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nombre de la carpeta
          </label>
          <input
            type="text"
            className="form-control col-6"
            id="name"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary mb-3"
          onClick={this.handleSubmit}
        >
          Crear carpeta
        </button>
      </div>
    );
  }
}
export default MkDir;
