import request from '@/utils/request'

// 上传
export function uploadFile(data) {
    return request({
        url: '/customs/upload/file',
        method: 'post',
        data: data
    })
}

//文件集合
export function filelist(data) {
    return request({
        url: '/customs/upload/fileList',
        method: 'post',
        data: data
    })
}

// 下载
export function downLoad(data) {
    return request({
        url: '/customs/download/file',
        method: 'get',
        data: data
    })
}

// 获取URL
export function getUrl(data){
    return request({
        url: 'custom/getObject',
        method: 'get',
        data:data
    })
}

