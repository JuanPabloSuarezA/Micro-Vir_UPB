import {basePath} from './cofig'
import axios from "axios";

export function uploadImageApi(e) {
    e.preventDefault();
    const url = `${basePath}/upload`;
    const formData = new FormData();
    formData.append('image', e.image)

    axios.post(url, formData).then(res=>{
        console.log(res)
    }).catch(err=>{
        console.log(err)
    })
}