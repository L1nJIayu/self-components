<template>
    <div class="panel-search">
        <Form ref="searchForm" :model="searchObj" inline>
            <Row :gutter="8">
                <Col
                    :xs="xs"
                    :sm="sm"
                    :md='md'
                    :lg='lg'
                    :xl='xl'
                    :xxl='xxl'
                    v-for="(item, index) in searchFormList"  
                    :key="index">
                    <FormItem
                        :prop="item.prop">

                        <!-- 输入框 -->
                        <Input 
                            v-if="item.type == 'text'"
                            v-model="searchObj[item.prop]"
                            type="text"
                            :placeholder="item.label"
                            :clearable="checkClearable(item.clearable)">
                        </Input>

                        <!-- 下拉框 -->
                        <Select 
                            v-if="item.type == 'select'"
                            v-model="searchObj[item.prop]"
                            :placeholder="item.label"
                            :clearable="checkClearable(item.clearable)"
                            :filterable="checkFilterable(item.filterable)">
                            <Option v-for="(item, index) in item.selectList" :key="index" :value="item.value">{{ item.key }}</Option>
                        </Select>

                        <!-- 日期选择 -->
                        <DatePicker
                            v-if="item.type == 'date'"
                            v-model="searchObj[item.prop]"
                            type="date"
                            :placeholder="item.label"
                            :clearable="checkClearable(item.clearable)">
                        </DatePicker>

                        <!-- 日期时间选择 -->
                        <DatePicker
                            v-if="item.type == 'datetime'"
                            v-model="searchObj[item.prop]"
                            type="datetime"
                            :placeholder="item.label"
                            :clearable="checkClearable(item.clearable)">
                        </DatePicker>

                        <!-- 地区联动 -->

                        <!-- 市 -->
                        <Select
                            v-if="item.type == 'city'"
                            @on-change="handleSelectCity"
                            v-model="searchObj[item.prop]"
                            :placeholder="item.label"
                            :clearable="checkClearable(item.clearable)"
                            :filterable="checkFilterable(item.filterable)">
                            <Option v-for="(item, index) in cityList" :key="index" :value="item.value">{{ item.label }}</Option>
                        </Select>
                        <!-- 区 -->
                        <Select
                            v-if="item.type == 'area'"
                            @on-change="handleSelectArea"
                            v-model="searchObj[item.prop]"
                            :placeholder="item.label"
                            :clearable="checkClearable(item.clearable)"
                            :filterable="checkFilterable(item.filterable)">
                            <Option v-for="(item, index) in areaList" :key="index" :value="item.value">{{ item.label }}</Option>
                        </Select>
                        <!-- 街道 -->
                        <Select 
                            v-if="item.type == 'street'"
                            v-model="searchObj[item.prop]"
                            :placeholder="item.label"
                            :clearable="checkClearable(item.clearable)"
                            :filterable="checkFilterable(item.filterable)">
                            <Option v-for="(item, index) in streetList" :key="index" :value="item.value">{{ item.label }}</Option>
                        </Select>


                    </FormItem>
                
                </Col>
                <!-- 搜索按钮组 -->
                <Col
                    :xs="xs"
                    :sm="sm"
                    :md='md'
                    :lg='lg'
                    :xl='xl'
                    :xxl='xxl'
                    :offset="btn_group_offset">
                    <FormItem>
                        <div :class="search_btn_group_style">
                            <!-- 样式一 -->
                            <Button type="primary" ghost icon="ios-refresh" @click="handleReset">重置</Button>
                            <Button type="primary" icon="ios-search" @click="handleSearch">搜索</Button>
                            <!-- 样式二 -->
                            <!-- <Button type="info" shape="circle" ghost icon="ios-refresh" @click="handleReset">重置</Button>
                            <Button type="info" shape="circle" icon="ios-search" @click="handleSearch">搜索</Button> -->
                        </div>
                    </FormItem>
                </Col>

            </Row>
        </Form>

    </div>
</template>

<script>
/**
 * searchFormList 表单内容
 *  - label            标签名，用于placeholder
 *  - prop             字段名
 *  - type             表单类型(text、select、date、datetime、area)
 *  - selectList       type为select的情况下，设置selectList
 *  - filterable       默认false，用于搜索下拉列表
 *  - clearable        默认true，清空表单
 * 
 * searchFormFilterable 全局设置表单的filterable
 * 
 * searchFormClearable  全局设置表单的clearable
 * 
 */
import moment from 'moment'
import cityList from '../assets/json/areaCode/pc-code.json'
import areaList from '../assets/json/areaCode/pca-code.json'
import streetList from '../assets/json/areaCode/pcas-code.json'
export default {
    name: 'BaseSearch',
    props: {
        searchFormFilterable: {
            type: Boolean,
            default: undefined
        },
        searchFormClearable: {
            type: Boolean,
            default: undefined
        },
        searchFormList: {
            type: Array,
            default: []
        },
    },
    data() {
        return {
            cityList: cityList,
            areaList: [],
            streetList: [],
            searchObj: {},
            xs: 24,
            sm: 12,
            md: 12,
            lg: 8,
            xl: 8,
            xxl: 4,
            window_innerWidth: 0,
            btn_group_offset: 0,
            search_btn_group_style: 'search-btn-group-1'
        }
    },
    methods: {
        // 搜索
        handleSearch() {
            this.setDateTimeFormat()
            this.trimParams()
            this.$emit('search', this.searchObj)
        },
        // 重置
        handleReset() {
            Object.keys(this.searchObj).forEach(item => {
                this.searchObj[item] = null
            })
            // this.$refs['searchForm'].resetFields()
        },
        // 修剪参数
        trimParams() {
            Object.keys(this.searchObj).forEach(propertyName => {
                if(typeof this.searchObj[propertyName] === 'string') {

                    this.searchObj[propertyName] = this.searchObj[propertyName].trim()
                    
                    if(this.searchObj[propertyName] == "") {
                        this.searchObj[propertyName] = null
                    }
                }
            })
        },
        // 设置按钮的位置
        setBtnGroupOffset(w) {
            let [xs, sm, md, lg, xl, xxl] = [480, 576, 768, 992, 1200, 1600]
            let item_amount = this.searchFormList.length
            let offset = 0
            if(w >= 0 && w < 576) {

            } else if (w >= sm && w < lg) { // 两列
                if(item_amount >= 2) {
                    if(item_amount % 2 === 0) {
                        offset =  12
                    } else {
                        offset =  0
                    }
                    this.search_btn_group_style = ['search-btn-group-1']
                } else {
                    this.search_btn_group_style = ['search-btn-group-2']
                }
            } else if (w >= lg && w < xxl) { // 三列
                if(item_amount >= 3) {
                    if(item_amount % 3 === 0) {
                        offset =  16
                    } else if(item_amount % 3 === 1) {
                        offset =  8
                    } else if(item_amount % 3 === 2) {
                        offset =  0
                    }
                    this.search_btn_group_style = ['search-btn-group-1']
                } else {
                    this.search_btn_group_style = ['search-btn-group-2']
                }
            // } else if(w >= xl && w < xxl) {// 四列
            //     if(item_amount >= 4) {
            //         if(item_amount % 4 === 0) {
            //             offset =  18
            //         } else if(item_amount % 4 === 1) {
            //             offset =  12
            //         } else if(item_amount % 4 === 2) {
            //             offset =  6
            //         } else if(item_amount % 4 === 3) {
            //             offset =  0
            //         }
            //         this.search_btn_group_style = ['search-btn-group-1']
            //     } else {
            //         this.search_btn_group_style = ['search-btn-group-2']
            //     }
            } else if(w >= xxl) {   // 六列
                if(item_amount >= 6) {
                    if(item_amount % 6 === 0) {
                        offset =  20
                    } else if(item_amount % 6 === 1) {
                        offset =  16
                    } else if(item_amount % 6 === 2) {
                        offset =  12
                    } else if(item_amount % 6 === 3) {
                        offset =  8
                    } else if(item_amount % 6 === 4) {
                        offset =  4
                    } else if(item_amount % 6 === 5) {
                        offset =  0
                    }
                    this.search_btn_group_style = ['search-btn-group-1']
                } else {
                    this.search_btn_group_style = ['search-btn-group-2']
                }
            }
            this.btn_group_offset = offset
        },
        // 设置【日期】格式
        setDateTimeFormat() {
            this.searchFormList.forEach(item => {
                if(item.type === 'datetime') {
                    if(this.searchObj[item.prop] !== '' && this.searchObj[item.prop] !== null && this.searchObj[item.prop] !== undefined) {
                        this.searchObj[item.prop] = moment(this.searchObj[item.prop]).format(item.format)
                    }
                }
            })
        },
        // 设置搜索属性的值，填入表单
        setParamsValue(obj) {
            Object.keys(obj).forEach(propertyName => {
                this.searchObj[propertyName] = obj[propertyName]
            })
            this.searchObj = JSON.parse(JSON.stringify(this.searchObj))
        },

        // 选择了【城市】以后触发
        handleSelectCity(cityCode) {
            let _city = null
            _city = areaList.find(cityItem => {
                return cityItem.value === cityCode
            })
            if(_city) {
                this.areaList = _city.children
            } else {
                this.areaList = []
                this.streetList = []
            }
        },
        // 选择了【区域】以后触发
        handleSelectArea(areaCode) {
            if(areaCode) {
                let _cityCode = areaCode.slice(0,4)
                let _area = {}
                streetList.find(cityItem => {
                    if(cityItem.value === _cityCode) {
                        _area = cityItem.children.find(areaItem => {
                            return areaItem.value === areaCode
                        })
                    }
                })
                if(_area) {
                    this.streetList = _area.children
                } else {
                    this.streetList = []
                }
            }
        },

        // 单项表单的 clearable 值判断
        checkClearable(clearable) {
            if(this.searchFormClearable == undefined) {
                return (clearable == undefined || clearable == true) ? true : clearable == false ? false : true
            } else {
                return this.searchFormClearable
            }
        },
        // 单项表单的 filterable 值判断
        checkFilterable(filterable) {
            if(this.searchFormFilterable == undefined) {
                return filterable
            } else {
                return this.searchFormFilterable
            }

        }
    },
    mounted() {
        this.setBtnGroupOffset(window.innerWidth)
        window.addEventListener('resize', () => {
            this.window_innerWidth = window.innerWidth
        })
    },
    watch: {
        window_innerWidth(w) {
            this.setBtnGroupOffset(w)
        }
    },
}
</script>

<style lang="less" scoped>

/* 搜索面板 */
.panel-search {
    border-bottom: 1px solid #ccc;
    // margin-bottom: 12px;
    // 搜索项
    .ivu-form {
        .ivu-form-item {
            width: 100%;
            margin-bottom: 10px !important;
            // 日期
            .ivu-date-picker {
                width: 100%;
            }
        }
        // 按钮组（搜索、重置）—— 靠右
        .search-btn-group-1 {
            display: flex;
            justify-content: flex-end;
            .ivu-btn {
                margin-left: 8px;
            }
        }
        // 按钮组（搜索、重置）—— 靠左
        .search-btn-group-2 {
            display: flex;
            justify-content: flex-start;
            .ivu-btn {
                margin-right: 8px;
            }
        }
        .ivu-form-item:last-child {
            margin-left: auto;
        }
    }
}
</style>