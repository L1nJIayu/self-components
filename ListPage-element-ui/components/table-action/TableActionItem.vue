<template>
    <span
        :title="title"
        :class="['table-action-item', isDisable, className, ...classNameList]"
        @click="handleClick">
        <span v-if="icon" class="iconfont" :class="icon"></span>
        <span v-else :class="['iconfont', iconfont]"></span>
    </span>
</template>

<script>
/**
 * @param title             标签提示
 * @param icon              Iview的icon名称
 * @param iconfont          阿里第三方icon矢量图标
 * @param className         类名（支持单个类）
 * @param classNameList     类名（支持多个类）
 * @param disabled          是否禁用
 */
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        },
        iconfont: {
            type: String,
            default: ''
        },
        className: {
            type: String,
            default: ''
        },
        classNameList: {
            type: Array,
            default: () => []
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 触发操作
        handleClick() {
            if(!this.disabled) {
                this.$emit('take-action')
            }
        }
    },
    computed: {
        isDisable() {
            return this.disabled ? 'disabled-btn' : ''
        }
    }
}
</script>

<style lang="less" scoped>
    .table-action-item {
        cursor: pointer;
    }
    /* 禁用 */
    .disabled-btn {
        cursor: not-allowed !important;
    }
</style>