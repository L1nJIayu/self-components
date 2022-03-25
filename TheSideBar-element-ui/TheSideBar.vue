<template>
    <div id="side-bar">
        <base-menu :menu-list="menuList" :isCollapse="isCollapse" :pathPrefix="pathPrefix"></base-menu>
        <div class="bottom">
            <span v-if="isCollapse" class="iconfont icon-toggle-right" @click="toggle"></span>
            <span v-else class="iconfont icon-toggle-left" @click="toggle"></span>
        </div>
    </div>
</template>

<script>
import BaseMenu from './components/BaseMenu.vue'
import menuList from './assets/menuList'
export default {
    name: 'TheSideBar',
    components: { BaseMenu },
    data() {
        return {
            menuList: menuList,
            isCollapse: false,
            pathPrefix: '/home'
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
    .base-menu {
        flex: auto;
    }
    .bottom {
        border-top: 1px solid #ccc;
        padding: 4px 18px;
        .icon-toggle-left, .icon-toggle-right {
            font-size: 24px;
            cursor: pointer;
        }
        .icon-toggle-right {
            color: rgb(45, 140, 240);
        }
    }
    
}

</style>