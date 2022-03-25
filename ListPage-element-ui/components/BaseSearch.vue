<template>
    <div class="panel-search">
        <el-row :gutter="8">
            <el-col
                :xs="xs"
                :sm="sm"
                :md='md'
                :lg='lg'
                :xl='xl'
                v-for="(item, index) in searchFormList"  
                :key="index">

                    <!-- 输入框 -->
                    <el-input 
                        v-if="item.type == 'text'"
                        v-model="searchObj[item.prop]"
                        type="text"
                        :placeholder="item.label"
                        :clearable="checkClearable(item.clearable)">
                    </el-input>

                    <!-- 下拉框 -->
                    <el-select 
                        v-if="item.type == 'select'"
                        v-model="searchObj[item.prop]"
                        :placeholder="item.label"
                        :clearable="checkClearable(item.clearable)"
                        :filterable="checkFilterable(item.filterable)">
                        <el-option v-for="(item, index) in item.selectList" :key="index" :value="item.value" :label="item.label"></el-option>
                    </el-select>

                    <!-- 日期选择 -->
                    <el-date-picker
                        v-if="item.type == 'date'"
                        v-model="searchObj[item.prop]"
                        type="date"
                        :placeholder="item.label"
                        :clearable="checkClearable(item.clearable)">
                    </el-date-picker>

                    <!-- 日期时间选择 -->
                    <el-date-picker
                        v-if="item.type == 'datetime'"
                        v-model="searchObj[item.prop]"
                        type="datetime"
                        :placeholder="item.label"
                        :clearable="checkClearable(item.clearable)">
                    </el-date-picker>

                    <!-- 地区联动 -->

                    <!-- 市 -->
                    <el-select
                        v-if="item.type == 'city'"
                        @on-change="handleSelectCity"
                        v-model="searchObj[item.prop]"
                        :placeholder="item.label"
                        :clearable="checkClearable(item.clearable)"
                        :filterable="checkFilterable(item.filterable)">
                        <el-option v-for="(item, index) in cityList" :key="index" :value="item.value">{{ item.label }}</el-option>
                    </el-select>
                    <!-- 区 -->
                    <el-select
                        v-if="item.type == 'area'"
                        @on-change="handleel-selectArea"
                        v-model="searchObj[item.prop]"
                        :placeholder="item.label"
                        :clearable="checkClearable(item.clearable)"
                        :filterable="checkFilterable(item.filterable)">
                        <el-option v-for="(item, index) in areaList" :key="index" :value="item.value">{{ item.label }}</el-option>
                    </el-select>
                    <!-- 街道 -->
                    <el-select 
                        v-if="item.type == 'street'"
                        v-model="searchObj[item.prop]"
                        :placeholder="item.label"
                        :clearable="checkClearable(item.clearable)"
                        :filterable="checkFilterable(item.filterable)">
                        <el-option v-for="(item, index) in streetList" :key="index" :value="item.value">{{ item.label }}</el-option>
                    </el-select>
            
            </el-col>


            <!-- 搜索按钮组 -->
            <el-col
                :xs="xs"
                :sm="sm"
                :md='md'
                :lg='lg'
                :xl='xl'>
                    <div class="btn-group">
                        <el-button plain round icon="el-icon-refresh-left" size="medium" @click="handleReset">重置</el-button>
                        <el-button type="primary" round icon="el-icon-search" size="medium" @click="handleSearch">搜索</el-button>
                    </div>
            </el-col>

        </el-row>
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
            xl: { span: 4, offset: 0 },
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
}
</script>

<style lang="less" scoped>
/* 搜索面板 */
.panel-search {
    border-bottom: 1px solid #ccc;
    .el-row {
        display: flex;
        flex-wrap: wrap;
    }
    .el-col {
        margin-bottom: 10px;
        .el-select, .el-date-editor {
            width: 100%;
        }
        .btn-group {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            button {
                margin-left: 8px;
            }
        }
    }
    .el-col:last-child {
        margin-left: auto;
    }
}
</style>