import React, {useState} from 'react';
import axios from 'axios';

//Imports Antd
import 'antd/lib/notification/style/css'
import {notification} from 'antd'
import {SmileOutlined} from '@ant-design/icons'

export default function UploadImages() {
    
   
    const [newImage, setNewImage] = useState({
        title: '',
        image: ''
    })
    
    const uploadImagenApi = (e) =>{
        e.preventDefault();
        if (newImage.title === '' || newImage.image === ''){
            notification.open({
                icon: <SmileOutlined rotate={180}/>,
                message: 'Error',
                description: 'Debes diligenciar los campos'
            })
        }else{
            const formData = new FormData();
            formData.append('image', newImage.image)
            formData.append('title', newImage.title)

            axios.post('http://localhost:4000/upload', formData).then(res=>{
                notification.open({
                    icon: <SmileOutlined/>,
                    message: 'Éxito',
                    description: 'La imagen fue compartida correctamente'
                })
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        }
        
    }
    
    
    const handleImage = (e)=>{
        setNewImage({
            ...newImage,
            image: e.target.files[0]
        })
    }
    const handleTitle = async (e)=>{
        await setNewImage({
            ...newImage,
            title: e.target.value
        })
    }
    
    return (
        <div>
            <div style={{marginTop: 95, marginLeft: 500}} className="input-group">
                <form onSubmit={uploadImagenApi} encType="multipart/form-data">
                    <div className="mb-3">
                        <label className="form-label">Título</label>
                        <input onChange={handleTitle} type="text" className="form-control"/>
                    </div>
                    <input type="file" onChange={handleImage} name="image" className="form-control mb-3"/>
                    <button className="btn btn-outline-success" type="submit" id="inputGroupFileAddon04">Subir Imagen</button>
                </form>
            </div>
        </div>
    )
}