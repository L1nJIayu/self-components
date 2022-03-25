<template>
    <div
        class="table-action"
        @mouseenter="showMore = true"
        @mouseleave="showMore = false">
        <div v-show="!showMore">
            <Icon type="ios-more" ></Icon>
        </div>
        <div v-show="showMore">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                showMore: false,
            }
        },
    }
</script>

<style lang="less" scoped>
    .table-action {
        & > div:nth-child(2) {
            span {
                font-size: 16px !important;
            }
            span::before {
                font-size: 14px !important;
            }
        }
        span {
            display: inline-block;
            margin-right: 10px;
            cursor: pointer;
            font-size: 16px;
            width: 16px;
            height: 16px;
            line-height: 16px;
            color: #000;
        }
    }
</style>