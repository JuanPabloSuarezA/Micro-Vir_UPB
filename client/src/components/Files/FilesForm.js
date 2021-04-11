import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Loading from "./Loading";
import Alert from "./Alert";
import ApiFiles from "../../api/files";

class FilesForm extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [], uploading: false, showAlert: false, alert: {} };
  }

  onChange(e) {
    console.log(e.target.files);
    this.setState({ files: e.target.files });
  }

  showAlert(alert) {
    if (this.state.showAlert) {
      return (
        <Alert
          alert={alert}
          onClose={() => this.setState({ showAlert: false })}
        />
      );
    }
  }

  async onSubmit(e) {
    this.setState({ uploading: true });
    let response = {};

    try {
      const data = new FormData();
      for (const file of this.state.files) {
        data.append("file", file);
      }
      response = await ApiFiles.uploadFiles(
        encodeURIComponent(this.props.uploadTo) || "",
        data
      );
    } catch (e) {
      response = e;
      console.log(e);
    }

    this.setState({ uploading: false, alert: response, showAlert: true });
  }

  render() {
    if (this.state.uploading) {
      return <Loading title="Uploading files..." text="Uploading" />;
    }
    return (
      <>
        {this.showAlert(this.state.alert)}
        <Form className="mb-3" onSubmit={(e) => this.onSubmit(e)}>
          <Form.Label>Upload File</Form.Label>
          <Form.File
            multiple
            className="mb-2"
            onChange={(e) => this.onChange(e)}
          />
          <Button variant="primary" type="submit">
            Upload
          </Button>
        </Form>
      </>
    );
  }
}

export default FilesForm;
