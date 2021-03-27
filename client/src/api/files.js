import axios from 'axios';
import {basePath} from './cofig'

class Api {
  constructor() {
    this.api = axios.create({
      baseURL: basePath,
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
    return await this.apiCall(() => this.api.get(`/content/${path}`));
  }

  async uploadFiles(path, files) {
    return await this.apiCall(() => this.api.post(`/upload/${path}`, files));
  }

  async mkDir(path, name) {
    return await this.apiCall(() => this.api.post(`/dir/${path}`, { name }));
  }
}

const api = new Api();
export default api;
