<template>
    <div class="base-add" v-if="isFormInit">
        <div class="form">
            <Form ref="form" :model="formData" :rules="formRules" label-colon>
                <FormItem
                    v-for="(item, index) in formList"
                    :key="index"
                    :label="item.label"
                    :prop="item.prop">

                    <!-- text -->
                    <Input
                        v-if="typeof item.type === 'undefined' || item.type === 'text'"
                        v-model="formData[item.prop]"
                        :placeholder="setPlaceholder(item)">
                    </Input>

                    <!-- textarea -->
                    <Input
                        v-else-if="item.type === 'textarea'"
                        type="textarea"
                        v-model="formData[item.prop]"
                        :placeholder="setPlaceholder(item)"
                        :autosize="{ minRows: 5, maxRows: 10 }"
                    ></Input>

                    <!-- select -->
                    <Select
                        v-else-if="item.type === 'select'"
                        v-model="formData[item.prop]">
                            <Option
                                v-for="(selectItem, selectIndex) in item.selectList"
                                :key="selectIndex"
                                :value="selectItem.value">
                                {{ selectItem.label }}
                            </Option>
                    </Select>

                    <!-- radio -->
                    <RadioGroup
                        v-else-if="item.type === 'radio'"
                        v-model="formData[item.prop]">
                        <Radio
                            v-for="(radioItem, radioIndex) in item.radioList"
                            :key="radioIndex"
                            :label="radioItem.value">
                            {{ radioItem.label }}
                        </Radio>
                    </RadioGroup>

                    <!-- checkbox -->
                    <CheckboxGroup 
                        v-else-if="item.type === 'checkbox'"
                        v-model="formData[item.prop]">
                        <Checkbox
                            v-for="(chkItem, chkIndex) in item.checkboxList"
                            :key="chkIndex"
                            :label="chkItem.value">
                            {{ chkItem.label }}
                        </Checkbox>
                    </CheckboxGroup>

                </FormItem>
            </Form>
        </div>
        <div class="btn-group">
            <Button type="primary" @click="submit" :loading="submitLoading">提交</Button>
            <Button type="default" @click="cancel">取消</Button>
        </div>
    </div>
</template>

<script>
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
        }
    },
    data() {
        return {
            isFormInit: false,
            formData: {},

            submitLoading: false,
        }
    },
    methods: {
        initForm() {
            let formData = {}
            this.formList.forEach(item => formData[item.prop] = null)

            this.formData = JSON.parse(JSON.stringify(formData))

            this.isFormInit = true
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
                        let res = await this.addApi({ ...this.formData })
                        const { errorCode, errorMsg } = res
                        if(errorCode === 2000) {
                            this.$Message.success('添加成功')
                            this.$emit('success')
                        } else {
                            this.$Message.error('添加失败' + errorMsg)
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
            .ivu-btn {
                margin: 0 24px;
            }
        }
    }
</style>