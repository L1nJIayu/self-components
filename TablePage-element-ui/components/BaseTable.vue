<template>
    <div class="base-list">
        <el-table :columns="tableColumns" :data="tableData" v-loading="tableLoading">
            
            <el-table-column
                v-for="(item, index) in tableColumns"
                :key="index"
                :prop="item.prop"
                :label="item.label">
                <template slot-scope="{ row }">
                    <span :class="setClassName(row[item.prop], item.formatter)">
                        <a v-if="item.type === 'link'" :target="item.linkTarget || '_blank'" :href="row[item.linkProp] || row[item.prop]">{{ row[item.prop] }}</a>
                        <span v-else>{{ row[item.prop] | handleFormatter(item.formatter) | handleNullValue }}</span>
                    </span>
                </template>
            </el-table-column>
            
            <el-table-column
                v-if="tableAction.show"
                fixed="right"
                label="操作"
                :width="tableAction.width || 100">
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
    filters: {
        handleFormatter(value, formatter) {
            
            if(formatter instanceof Array) {
                let target = formatter.find(item => item.value == value)
                if(target) {
                    return target.label
                } else {
                    return value
                }
            } else if (formatter instanceof Function) {
                return formatter(value)
            }
            return value
        },
        handleNullValue(value) {
            if(value == null || value == undefined || value == '') {
                return '- -'
            } else {
                return value
            }
        }
    },
    methods: {
        setClassName(value, formatter) {
            if(typeof formatter !== 'undefined' && formatter instanceof Array) {
                
                let target = formatter.find(item => item.value == value)
                if(target) {
                    return target.className
                } else {
                    return ''
                }
                
            } else {
                return ''
            }
        }
    }
}
</script>
