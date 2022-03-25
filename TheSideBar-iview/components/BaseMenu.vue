<template>
    <div class="base-menu">
        <Menu mode="vertical" theme="light" :active-name="activeName" :open-names="openNames" width="260px">

            <base-menu-item v-for="(level1, index1) in menuList" :key="index1" :level="level1">
                <base-menu-item v-for="(level2, index2) in level1.children" :key="index2" :level="level2">
                    <base-menu-item v-for="(level3, index3) in level2.children" :key="index3" :level="level3">
                        <base-menu-item v-for="(level4, index4) in level3.children" :key="index4" :level="level4"></base-menu-item>
                    </base-menu-item>
                </base-menu-item>
            </base-menu-item>

        </Menu>
    </div>
</template>

<script>
import BaseMenuItem from './BaseMenuItem.vue'
export default {
    name: 'BaseMenu',
    components: { BaseMenuItem },
    props: {
        menuList: {
            type: Array,
            require: true,
            default: () => []
        }
    },
    data() {
        return {
            activeName: '',
            openNames: [],
        }
    }
}
</script>
<style lang="less" scoped>
    .base-menu {
        overflow: hidden;
        scrollbar-width: thin;
    }
    .base-menu:hover {
        overflow-y: auto;
    }
</style>