import React from "react";
import ApiFiles from "../../api/files";
import FilesForm from "./FilesForm";
import MkDir from "./MkDir";
import MkDirForm from "./MkDirForm";
import PathForm from "./PathForm";

class Files extends React.Component {
  constructor(props) {
    super(props);
    const mail = localStorage.getItem("mail");
    this.state = {
      directories: [],
      files: [],
      mail,
      path: mail,
      apiPath: mail,
    };
  }
  async LoadData(apiPath = this.state.apiPath, path = this.state.path) {
    const data = await ApiFiles.getContent(apiPath);
    if (data.success)
      this.setState({
        directories: data.content.directories,
        files: data.content.files,
        apiPath,
        path,
      });
  }
  componentDidMount() {
    this.LoadData();
  }
  reload() {
    this.LoadData();
  }
  handleFormPath = async (path, apiPath) => {
    console.log({ path, apiPath });
    await this.LoadData(apiPath, path);
  };
  handleAddPath = async (d) => {
    const newApiPath = this.state.apiPath + "--" + d;
    const newPath = this.state.path + "/" + d;
    await this.LoadData(newApiPath, newPath);
    console.log(this.state);
  };
  render() {
    return (
      <div className="container">
        <h1 className="mr-1">Archivos</h1>
        <h3>Path</h3>
        <PathForm path={this.state.path} handlePath={this.handleFormPath} />
        <h3>Carpetas</h3>
        {this.state.directories.map((d, index) => (
          <button
            className="btn btn-primary"
            key={index}
            onClick={() => this.handleAddPath(d)}
          >
            {d}
          </button>
        ))}
        <h3>Archivos</h3>
        {this.state.files.map((d, index) => (
          <p key={index}>{d}</p>
        ))}
        <h3>Crear Carpeta</h3>
        <MkDirForm path={this.state.apiPath} reload={() => this.reload()} />
        <h3>Subir Archivo</h3>
        <FilesForm uploadTo={this.state.apiPath} />
      </div>
    );
  }
}

export default Files;
