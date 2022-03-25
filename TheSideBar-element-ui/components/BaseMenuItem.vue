<template>
    <el-menu-item  v-if="level.children == undefined || level.children.length == 0" :index="pathPrefix + level.path">
        <i v-if="level.meta.icon" class="iconfont" :class="level.meta.icon"></i>
        <span slot="title">{{ level.meta.title }}</span>
    </el-menu-item>
    <el-submenu v-else :index="pathPrefix + level.path">
        <template slot="title">
            <i v-if="level.meta.icon" class="iconfont" :class="level.meta.icon"></i>
            <span slot="title">{{ level.meta.title }}</span>
        </template>
        <slot></slot>
    </el-submenu>
</template>

<script>
export default {
    name: 'BaseMenuItem',
    props: {
        pathPrefix: {
            type: String,
            default: ''
        },
        level: {
            type: Object,
            require: true,
            default: () => ({})
        }
    },
    data() {
        return {

        }
    }
}
</script>
