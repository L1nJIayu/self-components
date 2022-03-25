<template>
    <div class="base-list">
        <Table :columns="tableColumns" :data="tableData" :loading="tableLoading">
            <template slot="action" slot-scope="{ row }">
                <slot name="action" :row="row"></slot>
            </template>
        </Table>
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
        tableLoading: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style>

</style>