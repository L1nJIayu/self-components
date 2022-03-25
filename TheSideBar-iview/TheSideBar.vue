<template>
    <div id="side-bar">
        <transition name="menu">
            <base-menu v-show="!isCollapse" :menu-list="menuList"></base-menu>
        </transition>
        <base-icon-menu v-show="isCollapse"></base-icon-menu>
        <div class="bottom">
            <span v-if="isCollapse" class="iconfont icon-toggle-right" @click="toggle"></span>
            <span v-else class="iconfont icon-toggle-left" @click="toggle"></span>
        </div>
    </div>
</template>

<script>
import BaseMenu from './components/BaseMenu.vue'
import BaseIconMenu from './components/BaseIconMenu.vue'
export default {
    name: 'TheSideBar',
    components: { BaseMenu, BaseIconMenu },
    data() {
        return {
            menuList: [
                // 系统管理
                {
                    title: '系统管理',
                    routerName: 'System',
                    icon: 'icon-system',
                    children: [
                        { title: '账号管理', routerName: 'System_Account', icon: '' },
                        { title: '应用管理', routerName: 'System_Application', icon: '' },
                    ]
                },
                // 专业应用
                {
                    title: '专业应用',
                    routerName: 'ProApp',
                    icon: 'icon-profession',
                    children: [
                        // 应用服务管理
                        {
                            title: '应用服务管理',
                            routerName: 'ProApp_AppServiceManage',
                            icon: '',
                            children: [
                                { title: '展示系统应用服务', routerName: 'ProApp_AppServiceManage_DisplaySystem', icon: '' },
                            ]
                        },
                        // AI开发
                        {
                            title: 'AI开发',
                            routerName: 'ProApp_AlgDevelopment',
                            icon: '',
                            children: [
                                { title: '算法建模管理', routerName: 'ProApp_AlgDevelopment_AlgModeling', icon: '' },
                            ]
                        }
                    ]
                },
            ],
            isCollapse: false
        }
    },
    methods: {
        toggle() {
            this.isCollapse = !this.isCollapse
        }
    }
}
</script>
<style lang="less" scoped>
#side-bar {
    height: 100%;
    background-color: #fff;

    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    .base-menu, .base-menu-icon {
        flex: auto;
    }
    .bottom {
        border-top: 1px solid #ccc;
        padding: 4px 8px;
        .icon-toggle-left, .icon-toggle-right {
            font-size: 24px;
            cursor: pointer;
        }
        .icon-toggle-right {
            color: rgb(45, 140, 240);
        }
    }
    
    /* 菜单收缩动画 */
    .menu-enter-active, .menu-leave-active {
        transition: width .3s ease-in-out, opacity .3s ease;
    }
    .menu-enter, .menu-leave-to {
        opacity: 0;
        width: 0;
    }
    .menu-leave, .menu-enter-to {
        opacity: 1;
        // width: 240px;
    }
}

</style>

<style lang="less">
    .ivu-menu-vertical .ivu-menu-submenu-title-icon {
        right: 0 !important;
    }
</style>