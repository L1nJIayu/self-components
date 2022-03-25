<template>
    <div class="base-menu">
        <el-menu :default-active="$route.path" :router="true" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
            <base-menu-item v-for="(level1, index1) in menuList" :key="index1" :level="level1" :pathPrefix="pathPrefix">
                <base-menu-item v-for="(level2, index2) in level1.children" :key="index2" :level="level2" :pathPrefix="pathPrefix">
                    <base-menu-item v-for="(level3, index3) in level2.children" :key="index3" :level="level3" :pathPrefix="pathPrefix">
                        <base-menu-item v-for="(level4, index4) in level3.children" :key="index4" :level="level4" :pathPrefix="pathPrefix"></base-menu-item>
                    </base-menu-item>
                </base-menu-item>
            </base-menu-item>
        </el-menu>
    </div>
</template>

<script>
import BaseMenuItem from './BaseMenuItem.vue'
export default {
    name: 'BaseMenu',
    components: { BaseMenuItem },
    props: {
        pathPrefix: {
            type: String,
            default: ''
        },
        isCollapse: {
            type: Boolean,
            require: true,
            default: false
        },
        menuList: {
            type: Array,
            require: true,
            default: () => []
        }
    },
    data() {
        return {
            defaultActive: '',
            openNames: [],
        }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    mounted() {
        console.log(this.$route.path)
    }
    
}
</script>
<style lang="less" scoped>
    .base-menu {
        overflow: hidden;
        scrollbar-width: thin;
        .el-menu-vertical-demo:not(.el-menu--collapse) {
            min-width: 240px;
            min-height: 400px;
        }
    }
    .base-menu:hover {
        overflow-y: auto;
    }

    
</style>
<style lang="less">
    .base-menu {
        .iconfont {
            display: inline-block;
            margin-right: 8px;
        }
    }
</style>