<template>
    <div class="base-page">
        <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="pageNum"
            :page-size="pageSize"
            :total="pageTotal"
            @size-change="changePageSize"
            @current-change="changePageNum">
        </el-pagination>
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
        changePageSize(pageSize) {
            this.$emit('change-page-size', pageSize)
        },
        changePageNum(pageNum) {
            this.$emit('change-page-num', pageNum)
        }
    }
}
</script>

<style>

</style>