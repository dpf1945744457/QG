import request from '@/utils/request'

// 税费列表
export function getDataList(data) {
	return request({
		url: '/taxLimit/list',
		method: 'get',
		data:data
	})
}


export function getEdit(data) {
	return request({
        url: '/taxLimit/edit',
		method: 'post',
		data:data
	})
}