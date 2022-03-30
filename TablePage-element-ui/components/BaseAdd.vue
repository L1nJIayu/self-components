<template>
    <div class="base-add" v-if="isFormInit">
        <div class="form">
            <el-form ref="form" :model="formData" :rules="formRules" :label-width="formLabelWidth" label-colon>
                <el-form-item
                    v-for="(item, index) in formList"
                    :key="index"
                    :label="item.label"
                    :prop="item.prop">

                    <!-- text -->
                    <el-input
                        v-if="typeof item.type === 'undefined' || item.type === FORM_TYPE_TEXT"
                        v-model="formData[item.prop]"
                        :placeholder="setPlaceholder(item)">
                    </el-input>

                    <!-- password -->
                    <el-input
                        v-else-if="item.type === FORM_TYPE_PASSWORD"
                        v-model="formData[item.prop]"
                        show-password
                        :placeholder="setPlaceholder(item)">
                    </el-input>

                    <!-- textarea -->
                    <el-input
                        v-else-if="item.type === FORM_TYPE_TEXTAREA"
                        type="textarea"
                        v-model="formData[item.prop]"
                        :placeholder="setPlaceholder(item)"
                        :autosize="{ minRows: 5, maxRows: 10 }"
                    ></el-input>

                    <!-- select -->
                    <el-select
                        v-else-if="item.type === FORM_TYPE_SELECT"
                        v-model="formData[item.prop]">
                            <el-option
                                v-for="(optionItem, optionIndex) in item.optionList"
                                :key="optionIndex"
                                :value="optionItem.value"
                                :label="optionItem.label">
                            </el-option>
                    </el-select>

                    <!-- radio -->
                    <el-radio-group
                        v-else-if="item.type === FORM_TYPE_RADIO"
                        v-model="formData[item.prop]">
                        <el-radio
                            v-for="(optionItem, optionIndex) in item.optionList"
                            :key="optionIndex"
                            :label="optionItem.value">
                            {{ optionItem.label }}
                        </el-radio>
                    </el-radio-group>

                    <!-- checkbox -->
                    <el-checkbox-group 
                        v-else-if="item.type === FORM_TYPE_CHECKBOX"
                        v-model="formData[item.prop]">
                        <el-checkbox
                            v-for="(optionItem, optionIndex) in item.optionList"
                            :key="optionIndex"
                            :label="optionItem.value">
                            {{ optionItem.label }}
                        </el-checkbox>
                    </el-checkbox-group>

                    <!-- upload 单文件 -->
                    <el-upload
                        v-else-if="item.type === FORM_TYPE_FILE"
                        ref="upload"
                        action="#"
                        :limit="1"
                        :accept="item.accept"
                        :on-change="(file, fileList) => {handleChangeFile(item.prop, file, fileList)}"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                    </el-upload>
                    <!-- upload 多文件 -->
                    <el-upload
                        v-else-if="item.type === FORM_TYPE_FILES"
                        ref="upload"
                        action="#"
                        :name="item.prop"
                        :multiple="true"
                        :limit="item.limit"
                        :accept="item.accept"
                        :on-change="(file, fileList) => {handleChangeFile(item.prop, file, fileList)}"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                    </el-upload>
                    
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
import {
    FORM_TYPE_FILE,
    FORM_TYPE_FILES,
    FORM_TYPE_TEXT,
    FORM_TYPE_PASSWORD,
    FORM_TYPE_TEXTAREA,
    FORM_TYPE_SELECT,
    FORM_TYPE_RADIO,
    FORM_TYPE_CHECKBOX
} from '../constants'
export default {
    props: {
        addApi: { type: Function, require: true, default: function() {} },
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
            FORM_TYPE_TEXT: FORM_TYPE_TEXT,
            FORM_TYPE_PASSWORD: FORM_TYPE_PASSWORD,
            FORM_TYPE_TEXTAREA: FORM_TYPE_TEXTAREA,
            FORM_TYPE_SELECT: FORM_TYPE_SELECT,
            FORM_TYPE_RADIO: FORM_TYPE_RADIO,
            FORM_TYPE_CHECKBOX: FORM_TYPE_CHECKBOX,
            FORM_TYPE_FILE: FORM_TYPE_FILE,
            FORM_TYPE_FILES: FORM_TYPE_FILES,

            isFormInit: false,
            formData: {},

            submitLoading: false,
        }
    },
    methods: {
        initForm() {
            let formData = {}
            this.formList.forEach(item => {
                const { type, prop } = item
                if(type == FORM_TYPE_CHECKBOX) {
                    formData[prop] = []
                } else {
                    formData[prop] = null
                }
            })

            this.formData = JSON.parse(JSON.stringify(formData))

            this.isFormInit = true
        },
        setPlaceholder({ type, placeholder }) {
            if(placeholder != undefined) {
                return placeholder
            } else {
                switch(type) {
                    case FORM_TYPE_TEXT:
                    case FORM_TYPE_PASSWORD:
                    case FORM_TYPE_TEXTAREA:
                        return '请输入'
                    case FORM_TYPE_SELECT:
                    case FORM_TYPE_RADIO:
                    case FORM_TYPE_CHECKBOX:
                        return '请选择'
                    default: 
                        return '请填写'
                }
            }
        },
        // 将文件的二进制格式存放到formData中
        handleChangeFile(prop, file, fileList) {
            // 默认直接把数组存入，即使是单文件也用数组存，传参时再取raw属性作为参数值传递给后端
            this.formData[prop] = fileList
            // 专门对文件类型的字段进行重新验证
            this.$refs['form'].validateField(prop)
        },
        submit() {
            this.$refs['form'].validate(async valid => {
                if(valid) {
                    try {
                        this.submitLoading = true

                        let params = null
                        const filePropList = this.formList.filter(item => (item.type === FORM_TYPE_FILE || item.type === FORM_TYPE_FILES)).map(item => item.prop)   // 过滤出属于file、files类型的表单字段

                        if(filePropList.length !== 0) {

                            const formData = new FormData()

                            Object.keys(this.formData).forEach(propertyName => {
                                if(filePropList.includes(propertyName)) {
                                    this.formData[propertyName].forEach(item => {
                                        formData.append(propertyName, item.raw) // 把raw取出，作为参数值传递给后端
                                    })
                                } else {
                                    formData.append(propertyName, this.formData[propertyName])
                                }
                            })
                            params = formData

                        } else {
                            params = { ...this.formData }

                            // 处理空字符串，转为null
                            Object.keys(params).forEach(propName => {
                                if(params[propName] === '') {
                                    params[propName] = null
                                }
                            })
                        }


                        let res = await this.addApi(params)
                        
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

                    // console.log('formData', this.formData)
                }
            })

        },
        cancel() {
            this.$emit('cancel')
        }
    },
    mounted() {
        this.initForm()
    }
}
</script>

<style lang="less" scoped>
    .base-add {
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