<template>
    <div>
        <MenuItem v-if="level.children == undefined || level.children.length == 0" :name="`${level.routerName}`" :to="{ name: level.routerName }">
            <span v-if="level.icon" class="iconfont" :class="level.icon"></span>
            {{ level.title }}
        </MenuItem>
        <Submenu v-else :name="`${level.routerName}`">
            <template slot="title">
                <span v-if="level.icon" class="iconfont" :class="level.icon"></span>
                {{ level.title }} 
            </template>
            <slot></slot>
        </Submenu>
    </div>
</template>

<script>
export default {
    name: 'BaseMenuItem',
    props: {
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

<style lang="less" scoped>
.iconfont {
    position: relative;
    right: 4px;
}
</style>