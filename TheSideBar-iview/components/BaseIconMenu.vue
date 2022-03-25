<template>
    <div class="base-icon-menu">
        <Dropdown>
            <span class="iconfont icon-system"></span>
            <DropdownMenu slot="list">
                <DropdownItem>驴打滚</DropdownItem>
                <DropdownItem>炸酱面</DropdownItem>
                <DropdownItem disabled>豆汁儿</DropdownItem>
                <DropdownItem>冰糖葫芦</DropdownItem>
                <DropdownItem divided>北京烤鸭</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <span class="iconfont icon-system"></span>
        <span class="iconfont icon-data"></span>
        <span class="iconfont icon-service"></span>
        <span class="iconfont icon-profession"></span>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.base-icon-menu {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .iconfont {
        width: 100%;
        height: 48px;
        font-size: 20px;
        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;
    }
    .iconfont:hover {
        color: rgb(45, 140, 240);
    }
}
</style>