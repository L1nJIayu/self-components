<template>
    <div class="base-detail">
        <el-row>
            <el-col
                :sm="sm"
                v-for="(item, index) in detailList" :key="index">
                <div class="detail-item">
                    <div class="label">{{ item.label }}：</div>
                    <div class="value">{{ detail[item.prop] }}</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: Number,
            require: true,
            default: -1
        },
        detailApi: { type: Function, require: true, default: function() {} },
        detailList: {
            type: Array,
            require: true,
            default: () => []
        },
        detailFormat: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            sm: 12,
            detail: {}
        }
    },
    methods: {
        initDetail() {
            this.detailList.forEach(item => {
                this.detail[item.prop] = null
            })
        },
        async getDetail() {

            try {
                const { data, errorCode, errorMsg } = await this.detailApi({ id: this.id })
                if(errorCode === 2000) {
                    this.detail = data
                    this.formatPropValue()  // 格式转化，如1-管理员；2-普通用户
                } else {
                    this.$message({ type: 'error', message: `${ errorCode }：详情数据获取失败：${ errorMsg || '未知' }` })
                }
                
            } catch (err) {
                console.error(err)
            }
        },
        formatPropValue() {
            this.detailList.forEach(({ prop, format }) => {


                const formatter = this.detailFormat[format]
                if(format && formatter) {
                    
                    if(formatter instanceof Array) {   // Array
                        const _target = formatter.find(item => item.value == this.detail[prop])
                        if(_target) {
                            this.detail[prop] = _target.label
                        }
                    } else if (formatter instanceof Function) {    // Function
                        this.detail[prop] = formatter(this.detail[prop])
                    }
                }
            })
        }
    },
    created() {
        },
    mounted() {
        this.initDetail()
        this.getDetail()
    }
}
</script>

<style lang="less" scoped>
.base-detail {
    width: 95%;
    margin: 0 auto;
    margin-bottom: 48px;
    .detail-item {
        display: flex;
        font-size: 16px;
        margin: 12px;
        .label {
            font-weight: 600;
            min-width: 120px;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
        }
        .value {
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
        }
    }
}
</style>