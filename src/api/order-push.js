import request from '@/utils/request'

//商城订单
export function getManual(data) {
	return request({
		url: `/order/orderReport/manual/${data.type}/${data.orderId}`,
		method: 'get',
		params:data
	})
}

//订单详情
export function getDetail(data) {
	return request({
		url: `/order/record/detail/${data.id}`,
		method: 'get',
		params:data
	})
}

//订单推送
export function getPush(data) {
	return request({
		url: '/order/record/list',
		method: 'get',
		params:data
	})
}

//订单状态
export function getStatus(data) {
	return request({
		url: '/order/orderReport/status',
		method: 'get',
		data:data
	})
}

//订单下拉状态
export function selectStatus(data) {
	return request({
		url: '/order/order/status',
		method: 'get',
		data:data
	})
}


