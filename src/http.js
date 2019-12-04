import axios from 'axios'
import { stringify } from 'qs'
axios.defaults.baseURL = 'http://47.96.112.218:8020/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

axios.interceptors.response.use(response=>{
    if (response.status === 200) {            
        return Promise.resolve(response.data);        
    } else {            
        return Promise.reject(response);        
    }    
},err=>{
    return Promise.reject(err)
})


export function get(url, params){    
    return new Promise((resolve, reject) =>{        
        axios.get(url, {            
            params: params        
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err)        
    })    
});}

export function post(url,params,config={}) {
    return new Promise((resolve,reject)=>{
        axios.post(url,stringify(params),config).then(res=>{
            resolve(res.data)
        }).catch(err=>{
            reject(err)
        })
    })
}

export default {
    
     getUploadToken (prams) {
        return get('/chat/qiniu/getUploadToken' ,prams)
     },
     Upload(prams,config){
         console.log(config)
        return post('https://upload.qiniup.com',prams,config)
     }
}