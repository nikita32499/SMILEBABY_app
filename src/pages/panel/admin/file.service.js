import axios from "axios"


class _FileService_{
    upload_One=async({file})=>{
            
        



        const formData = new FormData()
        formData.append("image",file)
        let response
        try {
            response = await axios({
                method: 'post',
                url: `${window.location.origin}/api/smilebaby/loader/upload_One`,
                data: formData,
                headers: {
                    'Content-Type': `multipart/form-data;`,
                },
            });
        } catch (error) {
            response=error.response
        }
        if(response?.status===200 && response.data.imagePath){
            return response.data.imagePath
        }
    }



    getImageBlob=async({file})=>{
        let imageBuffer =  await new Promise((resolve,reject)=>{
            try {
                const reader = new FileReader();

                reader.onload = function (e) {
                    resolve(e.target.result)
                };
                
                reader.readAsArrayBuffer(file);
            } catch (error) {
                reject(error)
            }
        })
        const blob = new Blob([imageBuffer], { type: 'image/*' });

        const imageBlob = URL.createObjectURL(blob);

        return imageBlob
    }
    
}

const FileService = new _FileService_()

export default FileService

