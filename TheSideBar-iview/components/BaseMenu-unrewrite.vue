<template>
    <Menu
        mode="vertical"
        theme="light"
        :active-name="activeName"
        :open-names="openNames">
            <!-- 一级 -->
            <template v-for="(level1, index1) in menuList">
                <MenuItem v-if="level1.children == undefined || level1.children.length == 0" :name="`${level1.routerName}`" :to="{ name: level1.routerName }" :key="index1">
                    {{ level1.title }}
                </MenuItem>
                <Submenu v-else :name="`${level1.routerName}`" :key="index1">
                    <template slot="title">
                        {{ level1.title }} 
                    </template>
                    <!-- 二级 -->
                    <template v-for="(level2, index2) in level1.children">
                        <MenuItem v-if="level2.children == undefined || level2.children.length == 0" :name="`${level2.routerName}`" :to="{ name: level2.routerName }" :key="index2">
                            {{ level2.title }} 
                        </MenuItem>
                        <Submenu v-else :name="`${level2.routerName}`" :key="index2">
                            <template slot="title">
                                {{ level2.title }} 
                            </template>
                            <!-- 三级 -->
                            <template v-for="(level3, index3) in level2.children">
                                <MenuItem v-if="level3.children == undefined || level3.children.length == 0" :name="`${level3.routerName}`" :to="{ name: level3.routerName }" :key="index3">
                                    {{ level3.title }} 
                                </MenuItem>
                                <Submenu v-else :name="`${level3.routerName}`" :key="index3">
                                    <template slot="title">
                                        {{ level3.title }} 
                                    </template>
                                    <!-- 四级 -->
                                    <template v-for="(level4, index4) in level3.children">
                                        <MenuItem v-if="level4.children == undefined || level4.children.length == 0" :name="`${level4.routerName}`" :to="{ name: level4.routerName }" :key="index4">
                                            {{ level4.title }} 
                                        </MenuItem>
                                    </template>
                                </Submenu>
                            </template>
                        </Submenu>
                    </template>
                </Submenu>
            </template>
    </Menu>
</template>

<script>
export default {
    name: 'BaseMenu',
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

<style>

</style>