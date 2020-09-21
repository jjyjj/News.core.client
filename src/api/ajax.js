/*
ajax请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */
import axios from 'axios'
export default function ajax(url, data = {}, type = 'get') {

    return new Promise(function(resolve, reject) {
        // 执行异步ajax请求
        let promise
        switch (type) {
            case 'get':
                // 准备url query参数数据
                let dataStr = '' //数据拼接字符串
                Object.keys(data).forEach(key => {
                    dataStr += key + '=' + data[key] + '&'
                })
                if (dataStr !== '') {
                    dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
                    url = url + '?' + dataStr
                }
                // 发送get请求
                promise = axios.get(url)
                break;
            case 'post':
                // 发送post请求
                promise = axios.post(url, data)
            case 'update':
                // 发送post请求
                promise = axios.update(url, data)
            case 'delete':
                // 准备url query参数数据
                let dataStrs = '' //数据拼接字符串
                Object.keys(data).forEach(key => {
                    dataStrs += key + '=' + data[key] + '&'
                })
                if (dataStrs !== '') {
                    dataStrs = dataStrs.substring(0, dataStrs.lastIndexOf('&'))
                    url = url + '?' + dataStrs
                }
                // 发送get请求
                promise = axios.delete(url)
            default:
                break;
        }


        // if (type === 'GET') {
        //     // 准备url query参数数据
        //     let dataStr = '' //数据拼接字符串
        //     Object.keys(data).forEach(key => {
        //         dataStr += key + '=' + data[key] + '&'
        //     })
        //     if (dataStr !== '') {
        //         dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        //         url = url + '?' + dataStr
        //     }
        //     // 发送get请求
        //     promise = axios.get(url)
        // } else {
        //     // 发送post请求
        //     promise = axios.post(url, data)
        // }
        promise.then(function(response) {
            // 成功了调用resolve()
            resolve(response)
        }).catch(function(error) {
            //失败了调用reject()
            reject(error)
        })
    })
}

/*
const response = await ajax()
const result = response.data

const resule = await ajax()
 */