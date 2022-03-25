export default [
    {
        name: 'system',
        path: '/system',
        meta: { title: '系统管理', icon: 'icon-system' },
        component: 'system/System',
        children: [
            {
                name: 'system-account',
                path: '/system/account',
                meta: { title: '账号管理', icon: '' },
                component: 'system/account/Account',
                children: null
            },
        ]
    },
    {
        name: 'baseData',
        path: '/baseData',
        meta: { title: '基础数据', icon: 'icon-baseData' },
        component: 'baseData/BaseData',
        children: [
            {
                name: 'baseData-list',
                path: '/baseData/list',
                meta: { title: '数据列表', icon: '' },
                component: 'baseData/list/List',
                children: null
            },
            {
                name: 'baseData-check',
                path: '/baseData/check',
                meta: { title: '审查', icon: '' },
                component: 'baseData/check/Check',
                children: null
            },
        ]
    },
]