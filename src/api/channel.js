import request from '@/utils/request'
export function channelLists(data) {
    return request({
        url: `/channel/list/${data.pageNum}/${data.pageSize}`,
        method: 'get',
        params: data
    })
}
export function channeladd(data) {
    return request({
        url: `/channel/add`,
        method: 'post',
        data: data
    })
}
export function channeledit(data) {
    return request({
        url: `/channel/edit`,
        method: 'put',
        data: data
    })
}
