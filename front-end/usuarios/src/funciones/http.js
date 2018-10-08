import axios from 'axios'

export default function http(ruta, datos, callback, callbackError) {
    let settings = {
        responseType: 'json',
        responseEncoding: 'utf8',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    axios.post('http://142.44.242.71/' + (ruta != null ? ruta : ''), datos, settings)
        .then(result => {
            callback(result.data)
        }).catch(err => {
            console.log(err)
            let error = err.message
            if(err.response){
                if(err.response.data){
                    err = err.response.data.mensaje
                }
            }
            callbackError(error)
        })
}
