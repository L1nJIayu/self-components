<template>
    <div class="base-page">
        <Page :current="pageNum" :page-size="pageSize" :total="pageTotal" @on-change="changePage"></Page>
    </div>
</template>

<script>
export default {
    name: 'BasePage',
    props: {
        pageNum: {
            type: Number,
            require: true,
            default: 1
        },
        pageSize: {
            type: Number,
            require: true,
            default: 10
        },
        pageTotal: {
            type: Number,
            require: true,
            default: 0
        }
    },
    methods: {
        changePage(pageNum) {
            this.$emit('change-page', pageNum)
        }
    }
}
</script>

<style>

</style>