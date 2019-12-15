import axios from 'axios'
import { stringify } from 'qs'
import md5 from 'js-md5';
import { Toast } from 'vant';
function getUrlKey(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}
let token = getUrlKey('chatid')
if(!token){
    token = 1;
}else{
    token = md5(token)
}


const baseURL = process.env.NODE_ENV == 'development' ? '/api/' : 'http://47.96.112.218:8020/'
axios.defaults.baseURL = baseURL;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.interceptors.request.use(config => {
    config.headers['sign'] = 4;
    config.headers['token'] = token
    // config.headers['token'] = '31cc91d9cdc44b41b2073d73ee74c759'
    return config
}, err => {
    return Promise.error(err)
})


axios.interceptors.response.use(response => {
    const { code } = response.data;
    if(code===500){
        alert('系统错误')
        return Promise.reject(response);
    }
   
    if (response.status === 200) {
        return Promise.resolve(response.data);
    } else {
        return Promise.reject(response);
    }
}, err => {
    return Promise.reject(err) 
})



export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err)
        })
    });
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, stringify(params)).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

export default {
    getUploadToken(prams) {
        return get('/chat/qiniu/getUploadToken', prams)
    },
    Upload(prams, config) {
        return post('https://upload.qiniup.com', prams, config)
    },

    //  发送消息
    sendNews(params) {
        return post('chat/shuiyu/chatNews/sendNews', params)
    },

    // 删除某条消息
    delNews(params) {
        return post('chat/shuiyu/chatNews/delNewsById', params)
    },
    // 撤回某条消息
    withdraw(params) {
        return post('chat/shuiyu/chatNews/withdrawMessage', params)
    },
    // 查看消息
    Messages() {
        return get('chat/shuiyu/chatNews/getUnreadMessages')
    },
    // 查看历史消息
    getHistory(params = {}) {
        return get('/chat/shuiyu/chatNews/getHistoryNewsByUserId', params)
    }

}