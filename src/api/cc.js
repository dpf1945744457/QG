import request from '@/utils/request'

 // 添加
export function getAdd(data) {
	return request({
		url: '/ccTax/add',
		method: 'post',
		data:data
	})
}

 // 删除
 export function getDelete(data) {
	return request({
		url: `/ccTax/delete/${data.id}`,
		method: 'delete',
		params:data
	})
}

// 导出
export function exportRestrict() {
    return process.env.VUE_APP_BASE_API+'/ccTax/importTem/export'
}
// 导入
export function importRestrict(data) {
    return request({
        url:'/ccTax/import',
        method: 'post',
        data: data,
    })
}

// 例表
export function getDataList(data) {
	return request({
		url: '/ccTax/list',
		method: 'get',
		params:data
	})
}   

// 更新
export function getEdit(data) {
	return request({
		url: '/ccTax/update',
		method: 'post',
		data:data
	})
}   

