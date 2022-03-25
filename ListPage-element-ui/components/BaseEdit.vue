<template>
    <div class="base-edit" v-if="isFormInit">
        <div class="form">
            <el-form ref="form" :model="formData" :rules="formRules" :label-width="formLabelWidth" label-colon>
                <el-form-item
                    v-for="(item, index) in formList"
                    :key="index"
                    :label="item.label"
                    :prop="item.prop">

                    <!-- text -->
                    <el-input
                        v-if="typeof item.type === 'undefined' || item.type === 'text'"
                        v-model="formData[item.prop]"
                        :placeholder="setPlaceholder(item)">
                    </el-input>

                    <!-- textarea -->
                    <el-input
                        v-else-if="item.type === 'textarea'"
                        type="textarea"
                        v-model="formData[item.prop]"
                        :placeholder="setPlaceholder(item)"
                        :autosize="{ minRows: 5, maxRows: 10 }"
                    ></el-input>

                    <!-- select -->
                    <el-select
                        v-else-if="item.type === 'select'"
                        v-model="formData[item.prop]">
                            <el-option
                                v-for="(selectItem, selectIndex) in item.selectList"
                                :key="selectIndex"
                                :value="selectItem.value"
                                :label="selectItem.label">
                            </el-option>
                    </el-select>

                    <!-- radio -->
                    <el-radio-group
                        v-else-if="item.type === 'radio'"
                        v-model="formData[item.prop]">
                        <el-radio
                            v-for="(radioItem, radioIndex) in item.radioList"
                            :key="radioIndex"
                            :label="radioItem.value">
                            {{ radioItem.label }}
                        </el-radio>
                    </el-radio-group>

                    <!-- checkbox -->
                    <el-checkbox-group 
                        v-else-if="item.type === 'checkbox'"
                        v-model="formData[item.prop]">
                        <el-checkbox
                            v-for="(chkItem, chkIndex) in item.checkboxList"
                            :key="chkIndex"
                            :label="chkItem.value">
                            {{ chkItem.label }}
                        </el-checkbox>
                    </el-checkbox-group>

                </el-form-item>
            </el-form>
        </div>
        <div class="btn-group">
            <el-button type="primary" @click="submit" :loading="submitLoading">提交</el-button>
            <el-button type="default" @click="cancel">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        detailApi: { type: Function, require: true, default: function() {} },
        editApi: { type: Function, require: true, default: function() {} },
        id: {
            type: Number,
            require: true,
            default: -1
        },
        formList: {
            type: Array,
            default: () => []
        },
        formRules: {
            type: Object,
            default: () => ({})
        },
        formLabelWidth: {
            type: String,
            default: '80px'
        }
    },
    data() {
        return {
            isFormInit: false,
            formData: {},
            detail: {},
            
            submitLoading: false,
        }
    },
    methods: {
        initForm() {
            let formData = {}
            this.formList.forEach(item => {
                const { type, prop } = item
                if(type == 'checkbox') {
                    formData[prop] = []
                } else {
                    formData[prop] = null
                }
            })

            this.formData = JSON.parse(JSON.stringify(formData))

            this.isFormInit = true
        },
        async getDetail() {
            try {
                let res = await this.detailApi({ id: this.id})
                const { data, errorCode, errorMsg } = res
                if(errorCode === 2000) {
                    this.detail = data
                    Object.keys(this.formData).forEach(propertyName => {
                        this.formData[propertyName] = data[propertyName]
                    })
                    console.log('data',data)
                } else {
                    this.$message({ type: 'error', message: `${ errorCode }：列表数据获取失败：${ errorMsg || '未知' }` })
                }
            } catch (err) {
                console.error(err)
            }
        },
        setPlaceholder({ type, placeholder }) {
            if(placeholder != undefined) {
                return placeholder
            } else {
                switch(type) {
                    case 'text':
                    case 'textarea':
                        return '请输入'
                    case 'select':
                        return '请选择'
                    default: 
                        return '请填写'
                }
            }
        },
        submit() {
            this.$refs['form'].validate(async valid => {
                if(valid) {
                    try {
                        this.submitLoading = true
                        let res = await this.editApi({ id: this.detail.id, ...this.formData })
                        const { errorCode, errorMsg } = res
                        if(errorCode === 2000) {
                            this.$message({ type: 'success', message: '添加成功' })
                            this.$emit('success')
                        } else {
                            this.$message({ type: 'error', message: '添加失败' + errorMsg })
                        }
                    } catch (err) {
                        console.error(err)
                    }
                    this.submitLoading = false
                }
            })

        },
        cancel() {
            this.$emit('cancel')
        }
    },
    mounted() {
        this.initForm()
        this.getDetail()
    }
}
</script>

<style lang="less" scoped>
    .base-edit {
        margin: 0 auto;
        .form {
            padding: 0 24px;
            max-height: 500px;
            overflow: auto;

        }
        .btn-group {
            display: flex;
            justify-content: center;
            padding: 24px 48px;
            button {
                margin: 0 24px;
            }
        }
    }
</style>