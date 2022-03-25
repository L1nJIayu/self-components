<template>
    <div class="list-page">

        <!-- 搜索 -->
        <base-search
            v-if="searchFormList.length !== 0"
            :search-form-list="searchFormList"
            :search-form-clearable="searchFormClearable"
            :search-form-filterable="searchFormFilterable"
            @search="search">
        </base-search>

        <!-- 列表顶部 -->
        <div class="list-header">
            <div class="list-name">{{ listName }}</div>
            <div class="actions">
                <Button type="primary" @click="showAddModal" icon="md-add">新增</Button>
            </div>
        </div>

        <!-- 列表 -->
        <base-list :table-columns="tableColumns" :table-data="tableData" :table-loading="tableLoading">
            <template #action="{row}">
                <table-action>
                    <table-action-item title="详情" icon="md-eye" @take-action="showDetailModal(row)"></table-action-item>
                    <table-action-item title="编辑" icon="ios-create-outline" @take-action="showEditModal(row)"></table-action-item>
                    <table-action-item title="删除" icon="ios-trash" @take-action="showDeleteModal(row)"></table-action-item>
                </table-action>
            </template>
        </base-list>

        <!-- 分页控件 -->
        <base-page :page-num="_pageNum" :page-size="_pageSize" :page-total="pageTotal" @change-page="changePage"></base-page>

        <!-- 新增 -->
        <Modal v-model="addModal" title="新增" :mask-closable="false" width="750" footer-hide>
            <base-add
                v-if="addModal"
                :add-api="addApi"
                :form-list="addFormList"
                :form-rules="addFormRules"
                @success="handleAddSuccess"
                @cancel="addModal=false">
            </base-add>
        </Modal>

        <!-- 修改 -->
        <Modal v-model="editModal" title="修改" :mask-closable="false" width="750" footer-hide>
            <base-edit
                v-if="editModal"
                :id="currentActionId"
                :edit-api="editApi"
                :detail-api="detailApi"
                :form-list="editFormList"
                :form-rules="editFormRules"
                @success="handleEditSuccess"
                @cancel="editModal=false">
            </base-edit>
        </Modal>

        <!-- 详情 -->
        <Modal v-model="detailModal" title="详情" width="1100" footer-hide>
            <base-detail
                v-if="detailModal"
                :id="currentActionId"
                :detail-api="detailApi"
                :detail-list="detailList"
                :detail-format="detailFormat">
            </base-detail>
        </Modal>


    </div>
</template>

<script>
import BaseSearch from './components/BaseSearch.vue'
import BaseList from './components/BaseList.vue'
import BasePage from './components/BasePage.vue'
import TableAction from './components/table-action/TableAction.vue'
import TableActionItem from './components/table-action/TableActionItem.vue'
import BaseAdd from './components/BaseAdd.vue'
import BaseEdit from './components/BaseEdit.vue'
import BaseDetail from './components/BaseDetail.vue'
export default {
    name: 'ListPage',
    components: { BaseSearch, BaseList, BasePage, TableAction, TableActionItem, BaseAdd, BaseEdit, BaseDetail },
    props: {
        listName: {
            type: String,
            default: '列表'
        },
        /* 接口API */
        listApi: { type: Function, require: true, default: function() {} },
        addApi: { type: Function, require: true, default: function() {} },
        editApi: { type: Function, require: true, default: function() {} },
        detailApi: { type: Function, require: true, default: function() {} },
        deleteApi: { type: Function, require: true, default: function() {} },
        /* 搜索组建 */
        searchFormList: {
            type: Array,
            default: () => []
        },
        searchFormFilterable: {
            type: Boolean,
            default: undefined
        },
        searchFormClearable: {
            type: Boolean,
            default: undefined
        },
        /* 列表组件 */
        tableColumns: {
            type: Array,
            require: true,
            default: () => []
        },
        /* 分页组件 */
        pageNum: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 10
        },
        /* 详情 */
        detailList: {
            type: Array,
            default: () => []
        },
        detailFormat: {
            type: Object,
            default: () => ({})
        },

        /* 添加 */
        addFormList: {
            type: Array,
            default: () => []
        },
        addFormRules: {
            type: Object,
            default: () => ({})
        },

        /* 编辑 */
        editFormList: {
            type: Array,
            default: () => []
        },
        editFormRules: {
            type: Object,
            default: () => ({})
        },

        /* 删除 */
        deleteLabel: String
    },
    data() {
        return {
            searchObj: {},
            
            tableData: [],
            tableLoading: false,

            _pageNum: 1,
            _pageSize: 10,
            pageTotal: 0,

            /* 新增相关 */
            addModal: false,

            /* 修改相关 */
            editModal: false,

            /* 详情相关 */
            detailModal: false,

            currentActionId: -1

        }
    },
    methods: {
        // 搜索
        search(searchObj) {
            this.searchObj = searchObj
            this._pageNum = 1
            this.getList()

            // console.log('searchObj', searchObj)
        },
        // 列表获取
        async getList() {
            try {
                this.tableLoading = true
                let params = {
                    pageNum: this._pageNum,
                    pageSize: this._pageSize,
                    ...this.searchObj
                }
                
                let res = await this.listApi(params)
                if(res) {
                    const { data: { list, total } } = res
                    this.tableData = list
                    this.pageTotal = total
                } else {
                    console.error(res)
                }
            } catch (err) {
                console.error(err)
            }

            this.tableLoading = false
        },
        // 换页
        changePage(pageNum) {
            this._pageNum = pageNum
            this.getList()
        },

        /* 新增相关 */
        showAddModal() {
            this.addModal = true
        },
        handleAddSuccess() {
            this.addModal = false
            this.getList()
        },

        /* 详情相关 */
        async showDetailModal({ id }) {
            this.detailModal = true
            this.currentActionId = id
        },

        /* 修改相关 */
        showEditModal({ id }) {
            this.editModal = true
            this.currentActionId = id
        },
        showDeleteModal(row) {
            const deleteLabel = this.deleteLabel ? row[this.deleteLabel] : ''
            this.$Modal.confirm({
                title: '删除',
                content: `你确定要删除${ deleteLabel }吗？`,
                onOk: async () => {
                    try {
                        await this.deleteApi({ id: row.id })
                        this.$Message.success('删除成功')
                        this.getList()
                    } catch (err) {
                        this.$Message.error('删除失败')
                        console.error(err)
                    }
                }
            })
        },
        handleEditSuccess() {
            this.editModal = false
            this.getList()
        }
    },
    created() {
        // 初始化
        this._pageNum = this.pageNum
        this._pageSize = this.pageSize
    },
    mounted() {
        this.getList()
    }
}
</script>

<style lang="less" scoped>
.list-page {
    .list-header {
        min-height: 64px;
        padding: 0 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .list-name {
            font-size: 16px;
            font-weight: 600;
        }
        .action {

        }
    }
    .base-page {
        text-align: right;
        margin-top: 24px;
    }
}
</style>