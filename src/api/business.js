import request from '@/utils/request'

// 商家列表
export function getList(data) {
	return request({
		url: '/merchantMag/getMerchantList',
		method: 'post',
		data:data
	})
}

// 商家待审核列表
export function getAuditList(data) {
	return request({
		url: '/merchantMag/getAuditMerchantList',
		method: 'post',
		data:data
	})
}

// 新增
export function addMer(query) {
	return request({
		url: '/merchantMag/addMerchant',
		method: 'post',
		data: query
	})
}

// 审核
export function auditMer(query) {
	return request({
		url: '/merchantMag/auditMerchant',
		method: 'post',
		data: query
	})
}

// 删除
export function deleteMer(query) {
	return request({
		url: '/merchantMag/delMerchant',
		method: 'post',
		data: query
	})
}

// 详情
export function getDetailMer(query) {
	return request({
		url: '/merchantMag/detailMerchant',
		method: 'post',
		params: query
	})
}

// 编辑
export function editMer(query) {
	return request({
		url: '/merchantMag/editMerchant',
		method: 'post',
		data: query
	})
}

//照片上传
export function  uploadFile(query) {
	return request({
		url: '/customs/upload/file',
		method: 'post',
		data: query
	})
}

// 状态下拉例表
export function getListStatus(query) {
	return request({
		url: '/merchantMag/list/status',
		method: 'get',
		data: query
	})
}