import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
export const constantRouterMap = [
	{
		path: '/login',
		component: () =>
			import('@/views/login/index'),
		hidden: true
	},

	{
		path: '/auth-redirect',
		component: () =>
			import('@/views/login/auth-redirect'),
		hidden: true
	},

	{
		path: '/401',
		component: () =>
			import('@/views/error-page/401'),
		hidden: true
	},
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		// meta: { role: ['123'] },
		children: [{
			path: 'dashboard',
			component: () =>
				import('@/views/Home/home'),
			name: 'Dashboard',
			meta: {
				title: 'administration',
				icon: '',
				// meta: { role: ['123'] },
				affix: true
			}
		}]

	},
	// {
	// 	path: '/',
	// 	component: Layout,
	// 	redirect: '/system-management/permission-group',
	// 	meta: { role: ['admin'] },
	// 	children: [
	// 		{
	// 			path: 'permission-group',
	// 			component: () =>
	// 				import('@/views/system-management/permission-group'),
	// 			name: 'PermissionGroup',
	// 			meta: { role: ['admin'] }
	// 		}]
	// },
	{
		path: '/404',
		component: () =>
			import('@/views/error-page/404'),
		hidden: true
	},
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRouterMap = [

	// 设备管理

	// 系统管理
	{
		path: '/systemManagement',
		component: Layout,
		redirect: '/systemManagement/permission-group',
		alwaysShow: true,
		name: 'systemManagement',

		meta: {
			title: 'sysmanagement',
			icon: 'system',
			name: '200001',
			// noCache: true,
		},
		children: [{
			path: 'permission-group',
			component: () =>
				import('@/views/system-management/permission-group'),
			name: 'PermissionGroup',
			meta: {
				title: 'pergroup',
				name: '200001-1',
			}
		},
		{
			path: 'user',
			component: () =>
				import('@/views/user/user-information'),
			name: 'userinformation',
			meta: {
				title: 'user',
				name: '200001-2',
			}
		},
		{
			path: 'employee-rights',
			component: () =>
				import('@/views/system-management/employee-rights'),

			name: 'EmployeeRights',
			meta: {
				title: 'emprights'
			},
			hidden: true
		},
		{
			path: 'auditor',
			component: () =>
				import('@/views/system-management/auditor'),
			name: 'Auditor',
			meta: {
				title: 'auditor'
			},
			hidden: true
		},
		{
			path: 'asset-access',
			component: () =>
				import('@/views/system-management/asset-access'),
			name: 'AssetAccess',
			meta: {
				title: 'assexport'
			},
			hidden: true
		}

		]
	},
	// //首页
	// {
	// 	path: '/dashboard', // businessManagement
	// 	component: () =>
	// 				import('@/views/Home/home'),
	// 	redirect: '/dashboard',
	// 	alwaysShow: true,
	// 	name: 'dashboard',
	// 	meta: {
	// 		title: 'busmanagement',
	// 		icon: 'business',
	// 		name: '00000'
	// 	},
	// },

	// 商家管理
	{
		path: '/businessManagement', // businessManagement
		component: Layout,
		redirect: '/businessManagement/business-inquiry',
		alwaysShow: true,
		name: 'businessManagement',
		meta: {
			title: 'busmanagement',
			icon: 'business',
			name: '00001'
		},
		children: [
			{
				path: 'business-inquiry', // Business inquiry
				component: () =>
					import('@/views/business-management/business-inquiry'),
				name: 'businessInquiry',
				meta: {
					title: 'businquiry',
					name: '00003',
					noCache: true
				}
			},
			{
				path: 'business-audit', // Business audit
				component: () =>
					import('@/views/business-management/business-audit'),
				name: 'businessAudit',
				meta: {
					title: 'busaudit',
					name: '00002',
					noCache: true
				}
			}

		]
	},

	// 备案管理
	{
		path: '/recordManagement', // Record management
		component: Layout,
		redirect: '/recordManagement/commodity-record',
		alwaysShow: true,
		name: 'recordManagement',
		meta: {
			title: 'recmanagement',
			icon: 'record',
			name: '002'
		},
		children: [
			{
				path: 'commodity-record', // Commodity record
				component: () =>
					import('@/views/record-management/commodity-record'),
				name: 'commodityRecord',
				meta: {
					title: 'comrecord',
					name: '002-1',
					noCache: true
				}
			}
		]
	},

	// 推送管理
	{
		path: '/pushManagement', // Push management
		component: Layout,
		redirect: '/pushManagement/order-push',
		alwaysShow: true,
		name: 'pushManagement',

		meta: {
			title: 'pushManagement',
			icon: 'push',
			name: '003'
		},
		children: [
			{
				path: 'order-push', // Order push
				component: () =>
					import('@/views/push-management/order-push'),
				name: 'orderPush',
				meta: {
					title: 'ordPush',
					name: '003-1',
					noCache: false
				}
			},
			{
				path: 'order-details', // Order push
				component: () =>
					import('@/views/push-management/order-details'),
				name: 'orderDetails',
				hidden: true,
				meta: {
					title: 'ordDetails',
					noCache: false
				}


			},

		]
	},

	// 税费管理
	{
		path: '/taxManagement', // Tax management
		component: Layout,
		redirect: '/taxManagement/tax-inquiry',
		alwaysShow: true,
		name: 'taxManagement',
		meta: {
			title: 'taxManagement',
			icon: 'tax',
			name: '004'
		},
		children: [
			{
				path: 'tax-inquiry', // Tax inquiry
				component: () =>
					import('@/views/tax-management/tax-inquiry'),
				name: 'taxInquiry',
				meta: {
					title: 'taxInquiry',
					name: '004-1'
				}
			},
			{
				path: 'cc-category', // CC category
				component: () =>
					import('@/views/tax-management/cc-category'),
				name: 'ccCategory',
				meta: {
					title: 'ccCategory',
					name: '004-2'
				}
			},
			{
				path: 'bc-category', // BC category
				component: () =>
					import('@/views/tax-management/bc-category'),
				name: 'bcCategory',
				meta: {
					title: 'bcCategory',
					name: '004-3'
				}
			},
			{
				path: 'bbc-category', // BBC category
				component: () =>
					import('@/views/tax-management/bbc-category'),
				name: 'bbcCategory',
				meta: {
					title: 'bbcCategory',
					name: '004-4'
				}
			}
		]
	},

	// 限制品管理
	{
		path: '/restrictedManagement', // Tax management
		component: Layout,
		redirect: '/restrictedManagement/list-restricted',
		alwaysShow: true,
		name: 'restrictedManagement',
		meta: {
			title: 'resManagement',
			icon: 'restricted',
			name: '005'
		},
		children: [
			{
				path: 'list-restricted', // Tax inquiry
				component: () =>
					import('@/views/restricted-management/list-restricted'),
				name: 'listRestricted',
				meta: {
					title: 'listRestricted',
					name: '005-3'
				}
			}
			// {
			// 	path: 'add-restricted', // CC category
			// 	component: () =>
			// 		import('@/views/restricted-management/add-restricted'),
			// 	name: 'addRestricted',
			// 	meta: {
			// 		title: 'addRestricted',
			// 		name: '00502'
			// 	}
			// }
		]

	},

	// 通道管理
	{
		path: '/channelManagement', // Tax management
		component: Layout,
		redirect: '/channelManagement/channel-list',
		alwaysShow: true,
		name: 'channelManagement',
		meta: {
			title: 'chaManagement',
			icon: 'channel',
			name: '006'
		},
		children: [
			{
				path: 'channel-list', // Tax inquiry
				component: () =>
					import('@/views/channel-management/channel-list'),
				name: 'channelList',
				meta: {
					title: 'chaList',
					name: '006-1'
				}
			}
		]

	}

]

const createRouter = () => new Router({
	// mode: 'history', // require service support
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router
