import request from '@/utils/request'

//海关下拉列表
export function channelList(data) {
    return request({
        url: '/channel/list/selected',
        method: 'get',
        data:data
    })
}

// 广州商品备案详情
export function gzDetails(data) {
    return request({
        url: `/record/deatil/gz/${data.merchantCode}/${data.goodsNo}`,
        method: 'get',
        data: data
    })
}

// 深圳商品备案详情
// export function szDetails(data) {
//     return request({
//         url: `/record/deatil/sz/${data.merchantCode}/${data.goodsNo}`,
//         method: 'get',
//         data: data
//     })
// }

//商品备案列表
export function filingList(data) {
    return request({
        url: `record/list/${data.pageNum}/${data.pageSize}`,
        method: 'get',
        params: data
    })
}

//备案状态下拉列表
export function statusList(data) {
    return request({
        url: '/record/list/status',
        method: 'get',
        data:data
    })
}

// 备案
export function record(data) {
    return request({
        url: `/record/record/${data.id}`,
        method: 'get',
        data:data
    })
}

