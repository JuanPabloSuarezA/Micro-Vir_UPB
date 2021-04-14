import axios from "axios";
import { fileServer } from "./cofig";

class ApiFiles {
  constructor() {
    this.api = axios.create({
      baseURL: fileServer,
    });
  }

  async apiCall(request) {
    try {
      return (await request()).data;
    } catch (e) {
      console.log(e);
      return e.response.data;
    }
  }

  async getContent(path) {
    path = encodeURIComponent(path);
    return await this.apiCall(() => this.api.get(`/content/${path}`));
  }

  async uploadFiles(path, files) {
    path = encodeURIComponent(path);
    return await this.apiCall(() => this.api.post(`/upload/${path}`, files));
  }

  async mkDir(path, name) {
    path = encodeURIComponent(path);
    return await this.apiCall(() => this.api.post(`/dir/${path}`, { name }));
  }
  async download(path) {
    path = encodeURIComponent(path);
    window.open(`${fileServer}/download/${path}`)
  }
}

const api = new ApiFiles();
export default api;
