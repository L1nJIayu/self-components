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
                        :file-list="fileList"
                        :on-remove="handleRemoveFile"
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
                        :file-list="fileList"
                        :accept="item.accept"
                        :on-remove="handleRemoveFile"
                        :on-change="(file, fileList) => {handleChangeFile(item.prop, file, fileList)}"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">多上传文件</el-button>
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
            detail: {},
            fileList: [],
            
            submitLoading: false,

            isChangeFile: false,    // 标记一下用户是否更换了文件
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
        async getDetail() {
            try {
                let res = await this.detailApi({ id: this.id })
                const { data, errorCode, errorMsg } = res
                if(errorCode === 2000) {
                    this.detail = data
                    
                    // 文件
                    this.fileList = [{name: this.detail.fileUrl.slice(this.detail.fileUrl.lastIndexOf('/'))}]
                    
                    const checkboxProps = this.formList.filter(item => item.type === FORM_TYPE_CHECKBOX).map(item => item.prop)

                    Object.keys(this.formData).forEach(propertyName => {
                        if(checkboxProps.includes(propertyName) && (this.detail[propertyName] == null || this.detail[propertyName] == undefined)) { // 防止后端传递checkbox类型的字段为null或者undefined导致页面报错
                            this.formData[propertyName] = []
                        } 
                        else {
                            this.formData[propertyName] = this.detail[propertyName]
                        }
                    })

                } else {
                    this.$message({ type: 'error', message: `${ errorCode }：列表数据获取失败：${ errorMsg || '未知' }` })
                }
            } catch (err) {
                console.error(err)
            }
        },
        transformCheckboxNullValue() {
            const checkboxProps = this.formList.filter(item => item.type === FORM_TYPE_CHECKBOX)
            if(checkboxProps.length !== 0) {
                checkboxProps.formData(item => {
                    if(this.formData[item.prop] == undefined || this.formData[item.prop] == null) {
                        this.formData[item.prop] = []
                    }
                })
            }
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
            this.isChangeFile = true
            // 默认直接把数组存入，即使是单文件也用数组存，传参时再取raw属性作为参数值传递给后端
            this.formData[prop] = fileList
            // 专门对文件类型的字段进行重新验证
            this.$refs['form'].validateField(prop)
        },
        handleRemoveFile() {
            this.isChangeFile = true
        },
        submit() {
            // 先判断一下用户是否更换了文件，如果没有，则忽略type=file的必填验证
            const filePropList = this.formList.filter(item => (item.type === FORM_TYPE_FILE || item.type === FORM_TYPE_FILES)).map(item => item.prop)   // 过滤出属于file、files类型的表单字段
            if(filePropList.length !== 0 && !this.isChangeFile) {
                console.log(filePropList)
                filePropList.forEach(prop => {
                    if(this.formRules[prop]) {
                        this.formRules[prop].forEach(rule => {
                            if(typeof rule.required !== 'undefined') { rule.required = false }
                        })
                    }
                })
            }

            this.$refs['form'].validate(async valid => {
                if(valid) {
                    try {
                        this.submitLoading = true
                        
                        let params = null
                        
                        if(filePropList.length !== 0) {

                            const formData = new FormData()

                            formData.append('id', this.detail.id)

                            Object.keys(this.formData).forEach(propertyName => {
                                console.log(this.formData)
                                if(filePropList.includes(propertyName)) {
                                    // 对于【修改】操作，文件被用户替换才作为参数传递给后端，否则不传此参数
                                    if(this.isChangeFile) {
                                        this.formData[propertyName].forEach(item => {
                                            formData.append(propertyName, item.raw) // 把raw取出，作为参数值传递给后端
                                        })
                                    }
                                } else {
                                    formData.append(propertyName, this.formData[propertyName])
                                }
                            })
                            params = formData

                        } else {
                            params = {
                                id: this.detail.id,
                                ...this.formData
                            }
                            // 处理空字符串，转为null
                            Object.keys(params).forEach(propName => {
                                if(params[propName] === '') {
                                    params[propName] = null
                                }
                            })
                        }


                        let res = await this.editApi(params)

                        const { errorCode, errorMsg } = res
                        if(errorCode === 2000) {
                            this.$message({ type: 'success', message: '修改成功' })
                            this.$emit('success')
                        } else {
                            this.$message({ type: 'error', message: '修改失败' + errorMsg })
                        }
                    } catch (err) {
                        console.error(err)
                    }
                    this.submitLoading = false
                }
            })

            // 把删除的必填项补充回去
            if(filePropList.length !== 0 && !this.isChangeFile) {
                filePropList.forEach(prop => {
                    if(this.formRules[prop]) {
                        this.formRules[prop].forEach(rule => {
                            if(typeof rule.required !== 'undefined') { rule.required = true }
                        })
                    }
                })
            }
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