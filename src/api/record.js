
import request from '@/utils/request'

export function recordList(data) {
    return request({
        url: `/record/list/${data.pageNum}/${data.pageSize}`,
        method: 'get',
        params: data
    })
}
export function recordstatus() {
    return request({
        url: `/record/list/status`,
        method: 'get'

    })
}
export function recordids(id) {
    return request({
        url: `/record/record/${id}`,
        method: 'put'

    })
}

export function recorddeatil(id) {
    return request({
        url: `/record/deatil/${id}`,
        method: 'get'
    })
}
