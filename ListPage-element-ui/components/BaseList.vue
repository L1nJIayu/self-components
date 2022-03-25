<template>
    <div class="base-list">
        <el-table :columns="tableColumns" :data="tableData" v-loading="tableLoading">
            
            <el-table-column
                v-for="(item, index) in tableColumns"
                :key="index"
                :prop="item.key"
                :label="item.title"
                :formatter="item.formatter">
            </el-table-column>
            <el-table-column
                v-if="tableAction.detail || tableAction.edit || tableAction.delete"
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="{row}">
                    <slot name="action" :row="row"></slot>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import TableAction from './table-action/TableAction.vue'
import TableActionItem from './table-action/TableActionItem.vue'
export default {
    name: 'BaseList',
    components: { TableAction, TableActionItem },
    props: {
        tableColumns: {
            type: Array,
            require: true,
            default: () => ({})
        },
        tableData: {
            type: Array,
            require: true,
            default: () => ({})
        },
        tableAction: {
            type: Object,
            default: {
                detail: false,
                edit: false,
                delete: false
            }
        },
        tableLoading: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style>

</style>