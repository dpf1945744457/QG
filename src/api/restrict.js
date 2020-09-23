import request from '@/utils/request'

import request1 from '@/utils/ei'
export function addRestrict(data) {
    return request({
        url:'/cont/add',
        method: 'post',
        data: data
    })
}

export function delRestrict(data) {
    return request({
        url:'/cont/del',
        method: 'delete',
        params: data
    })
}

export function editRestrict(data) {
    return request({
        url:'/cont/edit',
        method: 'put',
        data: data
    })
}

// 导出
export function exportRestrict() {
    return process.env.VUE_APP_BASE_API+'/cont/excel/template/export'
}

// 导入
export function importRestrict(data) {
    return request({
        url:'/cont/excel/template/import',
        method: 'post',
        data: data
    })
}

// 获取违禁数据
export function getRestrict(data) {
    return request({
        url: `/cont/list/${data.pageNum}/${data.pageSize}`,
        method: 'get',
        params:data
    })
   
}

// 下拉数据类型
export function restrictType(data) {
    return request({
        url:'/cont/list/type',
        method: 'get',
        data: data
    })
}