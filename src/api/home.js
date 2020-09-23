import request from '@/utils/request'

//首页
export function getDashboard(data) {
	return request({
		url: '/index/dashboard',
		method: 'get',
		data:data
	})
}
