# TablePage组件文档



## 一、涉及模块

- 搜索
- 列表
- 详情
- 新增
- 修改
- 删除
- 服务调用API





## 二、模块详细说明



### 1. 搜索模块

```vue
<template>
    <div class="account">
        <list-page
            :search-form-list="searchFormList"
            :search-form-clearable="searchFormClearable"
            :search-form-filterable="searchFormFilterable"></list-page>
    </div>
</template>

<script>
import ListPage from '@/components/ListPage/ListPage'

export default {
  name: 'Account',
  components: { ListPage },
  data() {
    const licenseColorList = [
      { label: '绿色', value: 1 },
      { label: '蓝色', value: 1 },
    ]
    return {
      searchFormClearable: undefined,
      searchFormFilterable: undefined,
      searchFormList: [
        { type: 'text', prop: 'id', label: 'ID' },
        { type: 'text', prop: 'username', label: '用户名', },
        { type: 'text', prop: 'nickname', label: '昵称', },
        {
          type: 'select',
          prop: 'licenseColor',
          label: '车牌颜色', 
          optionList: licenseColorList,
          filterable: true
        },
        { type: 'date', prop: 'createTime', label: '创建时间' },
        { type: 'datetime', prop: 'time', label: '具体时间' },
        { type: 'select', prop: 'firmId', label: '数据所属厂商', optionList: [], },
      ]
    }
  }
}
</script>
```



#### 属性

| 参数                   | 说明                                                     | 类型    | 可选值        | 默认值 |
| ---------------------- | -------------------------------------------------------- | ------- | ------------- | ------ |
| search-form-list       | 必填。搜索项的清单，具体配置见**表searchFormList**。     | Array   | ——            | []     |
| search-form-clearable  | 全局属性，统一配置所有控件是否显示清空按钮。             | Boolean | true \| false | true   |
| search-form-filterable | 全局属性，统一配置所有类型为select的控件，是否支持搜索。 | Boolean | true \| false | False  |

**表searchFormList**

| 参数       | 说明                                                         | 类型    | 可选值                       | 默认  |
| ---------- | ------------------------------------------------------------ | ------- | ---------------------------- | ----- |
| type       | 必填。控件类型                                               | String  | text、select、date、datetime | text  |
| prop       | 必填。控件对象变量字段                                       | String  | ——                           | ——    |
| label      | 必填。控件显示的中文标签                                     | String  | ——                           | ——    |
| optionList | 下拉列表的选项清单，`type="select"`时必填，例如`[{label: '选项1', value: 1}]` | Array   | ——                           | []    |
| clearable  | 控件是否显示清空按钮                                         | Boolean | true \| false                | true  |
| filterable | `type="select"`时生效，设置控件是否支持搜索                  | Boolean | true \| false                | false |



### 2. 列表模块

```vue
<template>
    <div class="account">
        <list-page
            :list-name="listName"
            :table-columns="tableColumns"
            :table-action="tableAction"
			:page-num="pageNum"
			:page-size="pageSize"></list-page>
    </div>
</template>

<script>
import ListPage from '@/components/ListPage/ListPage'

export default {
    name: 'Account',
    components: { ListPage },
    data() {
        const licenseColorList = [
          { label: '绿色', value: 1, className: 'status green' },
          { label: '蓝色', value: 1, className: 'status blue' },
        ]
        
        const formatter_datetime = (datetime) => {
          return this.$moment(datetime).format('YYYY-MM-DD HH:mm:ss')
        }
        return {
          listName: '账号列表',

          tableColumns: [
            { label: 'ID', prop: 'id' },
            { label: '用户名', prop: 'username' },
            { label: '昵称', prop: 'nickname' },
            { label: '车牌颜色', prop: 'licenseColor', formatter: licenseColorList }
            { label: '创建时间', prop: 'createTime', formatter: formatter_datetime }
          ],
          tableAction: {
            detail: true,
            edit: true,
            delete: true
          },
          pageNum: 1,
          pageSize: 10,

    }
  }
}
</script>
<style lang="less">
.account {
    .status {
        border: 1px solid transparent;
        border-radius: 5px;
        padding: 1px 8px;
    }
    .green {
        border-color: 'green';
        color: 'green';
    }
    .blue {
        border-color: 'blue';
        color: 'blue';
    }
}
</style>
```



#### 属性

| 参数          | 说明                                                  | 类型   | 可选值 | 默认   |
| ------------- | ----------------------------------------------------- | ------ | ------ | ------ |
| table-name    | 表格名称                                              | String | ——     | "列表" |
| table-columns | 必填。表格内容清单，具体配置见**表tableColumns**。    | Array  | ——     | []     |
| table-actions | 表格中的【操作】列的相关配置，具体见**表tableAction** | Object | ——     | ——     |
| page-num      | 默认显示第几页。                                      | Number | ——     | 1      |
| page-size     | 默认一页显示的条数。                                  | Number | ——     | 10     |

**表tableColumns**

| 参数       | 说明                                                         | 类型              | 可选值                             | 默认   |
| ---------- | ------------------------------------------------------------ | ----------------- | ---------------------------------- | ------ |
| label      | 必填。列头显示文字                                           | String            | ——                                 | ——     |
| prop       | 必填。对应列内容的字段名                                     | String            | ——                                 | ——     |
| formatter  | 列对应值的格式化函数，返回对应的值。数组格式具体见表arrayFormatter | Function \| Array | ——                                 | ——     |
| type       | 类型。支持`link`                                             | String            | ——                                 | ——     |
| linkProp   | 当`type=link`时，可进行配置，设置以linkProp的值作为跳转链接  | String            | ——                                 | ——     |
| linkTarget | 新页面的目标                                                 | String            | _blank \| _self \| _parent \| _top | _blank |

**表tableAction**

| 参数    | 说明                 | 类型             | 可选值               | 默认  |
| ------- | -------------------- | ---------------- | -------------------- | ----- |
| show    | 是否显示【操作】列。 | Boolean          | true、false          | false |
| width   | 操作列的宽度         | String \| Number | ——                   | 100   |
| actions | 配置操作列的功能     | Array            | detail、edit、delete | []    |

**arrayFormatter**

| 参数      | 说明            | 类型             | 可选值 | 默认 |
| --------- | --------------- | ---------------- | ------ | ---- |
| label     | 对应文本        | String           | ——     | ——   |
| value     | 对应值          | String \| Number | ——     | ——   |
| className | 自定义className | String           | ——     | ""   |

**slot**

| 参数         | 说明                                  | 参数 |
| ------------ | ------------------------------------- | ---- |
| table-action | 【操作】列的自定义功能，参数为{ row } | row  |



### 3. 详情模块

```vue
<template>
    <div class="account">
        <list-page :detail-list="detailList"></list-page>
    </div>
</template>

<script>
import ListPage from '@/components/ListPage/ListPage'

export default {
  name: 'Account',
  components: { ListPage },
  data() {
    const formatter_datetime = (datetime) => {
      return this.$moment(datetime).format('YYYY-MM-DD HH:mm:ss')
    }
    return {

      detailList: [
        { label: 'ID', prop: 'id' },
        { label: '用户名', prop: 'username' },
        { label: '昵称', prop: 'nickname' },
        { label: '用户类型', prop: 'userType', formatter: userTypeList },
        { label: '创建时间', prop: 'createTime', formatter: formatter_datetime },
        { label: '更新时间', prop: 'updateTime', formatter: formatter_datetime },
        { label: '描述', prop: 'description' },
      ]
    }
  }
}
</script>
```



#### 属性

| 参数        | 说明                                             | 类型  | 可选值 | 默认 |
| ----------- | ------------------------------------------------ | ----- | ------ | ---- |
| detail-list | 必填。详情内容清单，具体配置见**表detailList**。 | Array | ——     | []   |

**表detailList**

| 参数       | 说明                                                         | 类型            | 可选值                             | 默认   |
| ---------- | ------------------------------------------------------------ | --------------- | ---------------------------------- | ------ |
| label      | 必填。                                                       | String          | ——                                 | ——     |
| prop       | 必填。                                                       | String          | ——                                 | ——     |
| formatter  | 对应字段值的格式化方式，支持函数和数组([{label: '类型a', value: 1}]) | Function｜Array | `function(){return 'xxx'}`｜[]     | ——     |
| type       | 类型。支持`link`                                             | String          | ——                                 | ——     |
| linkProp   | 当`type=link`时，可进行配置，设置以linkProp的值作为跳转链接  | String          | ——                                 | ——     |
| linkTarget | 新页面的目标                                                 | String          | _blank \| _self \| _parent \| _top | _blank |





### 4. 新增模块

```vue
<template>
    <div class="account">
        <list-page
            :form-label-width="formLabelWidth"
            :add-form-list="formList"
            :add-form-rules="formRules"></list-page>
    </div>
</template>

<script>
import ListPage from '@/components/ListPage/ListPage'

export default {
  name: 'Account',
  components: { ListPage },
  data() {
    const hobbyList = [
      { label: '羽毛球', value: 1 },
      { label: '篮球', value: 2 },
      { label: '书法', value: 3 },
      { label: '绘画', value: 4 },
      { label: '唱歌', value: 5 },
      { label: '旅行', value: 6 },
      { label: '健身', value: 7 },
      { label: '摄影', value: 8 },
      { label: '编程', value: 9 },
      { label: '手工', value: 10 },
      { label: '钓鱼', value: 11 },
      { label: '划船', value: 12 },
    ]
    const userTypeList = [
      { label: '管理员', value: 1 },
      { label: '普通用户', value: 2 },
    ]
    const userIsActiveList = [
      { label: '可用', value: 1 },
      { label: '不可用', value: 0 }
    ]
    return {
      formLabelWidth: '80px',
      formList: [
        { label: '用户名', prop: 'username' },
        { label: '昵称', prop: 'nickname' },
        { label: '用户类型', prop: 'type', type: 'select', optionList: userTypeList },
        { label: '用户状态', prop: 'isActive', type: 'radio', optionList: userIsActiveList },
        { label: '兴趣', prop: 'hobby', type: 'checkbox', optionList: hobbyList },
        { label: '描述', prop: 'description', type: 'textarea' }
      ],
      formRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur,change' },
          { max: 20, message: '用户名不能超过20个字符', trigger: 'blur,change' }
        ],
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'blur,change' },
          { max: 20, message: '昵称不能超过20个字符', trigger: 'blur,change' }
        ],
        type: [
          { required: true, message: '用户类型不能为空', trigger: 'blur,change', type: 'number'}
        ],
        isActive: [
          { required: true, message: '用户状态不能为空', trigger: 'blur,change', type: 'number'}
        ]
      },
    }
  }
}
</script>
```



#### 属性

| 参数             | 说明                                                         | 类型   | 可选值 | 默认   |
| ---------------- | ------------------------------------------------------------ | ------ | ------ | ------ |
| add-form-list    | 必填。控件清单。具体配置见**表addFormList**                  | Array  | ——     | ——     |
| add-form-rules   | 必填。表单验证。具体配置查看[async-validator](https://github.com/yiminghe/async-validator) | Object | ——     | ——     |
| form-label-width | 表单域标签的的宽度，例如 '50px'。支持 `auto`。               | String | ——     | '80px' |
| accept           | 接受上传的[文件类型](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#limiting_accepted_file_types)。`type=file |files`时有效 | String | ——     | ——     |
| limit            | 最大允许上传个数。`type=file |files`时有效                   | Number | ——     | ——     |

**表addFormList**

| 参数       | 说明                                                         | 类型   | 可选值                                                       | 默认 |
| ---------- | ------------------------------------------------------------ | ------ | ------------------------------------------------------------ | ---- |
| label      | 必填。控件对应中文标签                                       | String | ——                                                           | ——   |
| prop       | 必填。控件对应字段名                                         | String | ——                                                           | ——   |
| type       | 必填。控件类型，支持                                         | String | `text`、`select`、`radio`、`checkbox`、`textarea`、`file`、`files` | ——   |
| optionList | `type="select"`、`type="radio"`、`type="checkbox"`时必填。具体配置见**表List**。 | Array  | ——                                                           | []   |

**表List**

| 参数  | 说明           | 类型           | 可选值 | 默认 |
| ----- | -------------- | -------------- | ------ | ---- |
| label | 必填。显示文字 | String         | ——     | ——   |
| value | 必填。对应值   | String｜Number | ——     | ——   |



### 5. 修改模块

```vue
<template>
    <div class="account">
        <list-page
            :form-label-width="formLabelWidth"
            :edit-form-list="formList"
            :edit-form-rules="formRules"></list-page>
    </div>
</template>

<script>
import ListPage from '@/components/ListPage/ListPage'
import { listApi, addApi, editApi, detailApi, deleteApi } from '@/api/modules/system/account'

export default {
  name: 'Account',
  components: { ListPage },
  data() {
    const hobbyList = [
      { label: '羽毛球', value: 1 },
      { label: '篮球', value: 2 },
      { label: '书法', value: 3 },
      { label: '绘画', value: 4 },
      { label: '唱歌', value: 5 },
      { label: '旅行', value: 6 },
      { label: '健身', value: 7 },
      { label: '摄影', value: 8 },
      { label: '编程', value: 9 },
      { label: '手工', value: 10 },
      { label: '钓鱼', value: 11 },
      { label: '划船', value: 12 },
    ]
    const userTypeList = [
      { label: '管理员', value: 1 },
      { label: '普通用户', value: 2 },
    ]
    const userIsActiveList = [
      { label: '可用', value: 1 },
      { label: '不可用', value: 0 }
    ]
    return {
      formLabelWidth: '80px',
      formList: [
        { label: '用户名', prop: 'username', disabled: true },
        { label: '昵称', prop: 'nickname' },
        { label: '用户类型', prop: 'type', type: 'select', optionList: userTypeList },
        { label: '用户状态', prop: 'isActive', type: 'radio', optionList: userIsActiveList },
        { label: '兴趣', prop: 'hobby', type: 'checkbox', optionList: hobbyList },
        { label: '描述', prop: 'description', type: 'textarea' }
      ],
      formRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur,change' },
          { max: 20, message: '用户名不能超过20个字符', trigger: 'blur,change' }
        ],
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'blur,change' },
          { max: 20, message: '昵称不能超过20个字符', trigger: 'blur,change' }
        ],
        type: [
          { required: true, message: '用户类型不能为空', trigger: 'blur,change', type: 'number'}
        ],
        isActive: [
          { required: true, message: '用户状态不能为空', trigger: 'blur,change', type: 'number'}
        ]
      }
    }
  }
}
</script>
```



#### 属性

| 参数             | 说明                                                         | 类型   | 可选值 | 默认   |
| ---------------- | ------------------------------------------------------------ | ------ | ------ | ------ |
| edit-form-list   | 必填。控件清单。具体配置见**表editFormList**                 | Array  | ——     | ——     |
| edit-form-rules  | 必填。表单验证。具体配置查看[async-validator](https://github.com/yiminghe/async-validator) | Object | ——     | ——     |
| form-label-width | 表单域标签的的宽度，例如 '50px'。支持 `auto`。               | String | ——     | '80px' |

**表editFormList**

| 参数       | 说明                                                         | 类型    | 可选值                                            | 默认  |
| ---------- | ------------------------------------------------------------ | ------- | ------------------------------------------------- | ----- |
| label      | 必填。控件对应中文标签                                       | String  | ——                                                | ——    |
| prop       | 必填。控件对应字段名                                         | String  | ——                                                | ——    |
| type       | 必填。控件类型，支持                                         | String  | `text`、`select`、`radio`、`checkbox`、`textarea` | ——    |
| disabled   | 禁用。                                                       | Boolean | true、false                                       | false |
| optionList | `type="select"`、`type="radio"`、`type="checkbox"`时必填。具体配置见**表List**。 | Array   | ——                                                | []    |

**表List**

| 参数  | 说明           | 类型           | 可选值 | 默认 |
| ----- | -------------- | -------------- | ------ | ---- |
| label | 必填。显示文字 | String         | ——     | ——   |
| value | 必填。对应值   | String｜Number | ——     | ——   |



### 6. 删除模块

```vue
<template>
    <div class="account">
        <list-page
            :delete-label="deleteLabelProp"></list-page>
    </div>
</template>

<script>
import ListPage from '@/components/ListPage/ListPage'

export default {
    name: 'Account',
		components: { ListPage },
		data() {
      return {
        deleteLabelProp: 'username'
      }
    }
}
</script>

```



#### 属性

| 参数              | 说明                       | 类型   | 可选值 | 默认 |
| ----------------- | -------------------------- | ------ | ------ | ---- |
| delete-label-prop | 确认框提示时使用的属性字段 | String | ——     | ——   |



### 7. 服务调用API

#### 示例

已省略无关代码

```vue
<template>
    <div class="account">
        <list-page
            :list-api="listApi"
            :add-api="addApi"
            :edit-api="editApi"
            :detail-api="detailApi"
            :delete-api="deleteApi"></list-page>
    </div>
</template>

<script>
import ListPage from '@/components/ListPage/ListPage'
import { listApi, addApi, editApi, detailApi, deleteApi } from '@/api/modules/system/account'

export default {
		components: { ListPage },
    methods: { listApi, addApi, editApi, detailApi, deleteApi },
  
}
</script>
```



#### 属性

| 参数         | 说明     | 类型     | 可选值 | 默认 |
| ------------ | -------- | -------- | ------ | ---- |
| list-api     | 列表接口 | Function | ——     | ——   |
| add-api      | 新增接口 | Function | ——     | ——   |
| edit-api     | 修改接口 | Function | ——     | ——   |
| detail-api   | 详情接口 | Function | ——     | ——   |
| delete-api   | 删除接口 | Function | ——     | ——   |
| download-api | 下载接口 | Function | ——     | ——   |
| preview-api  | 查看接口 | Function | ——     | ——   |





## 三、完整示例

```vue
<template>
    <div class="account">
        <table-page
            :list-name="listName"
            :list-api="listApi"
            :add-api="addApi"
            :edit-api="editApi"
            :detail-api="detailApi"
            :delete-api="deleteApi"
            :search-form-list="searchFormList"
            :search-form-clearable="searchFormClearable"
            :search-form-filterable="searchFormFilterable"
			:table-columns="tableColumns"
            :table-action="tableAction"
			:page-num="pageNum"
			:page-size="pageSize"
            :detail-list="detailList"
            :add-form-list="formList"
            :add-form-rules="formRules"
            :edit-form-list="formList"
            :edit-form-rules="formRules"
            delete-label="username"></table-page>
    </div>
</template>

<script>
import TablePage from '@/components/TablePage/TablePage'
import { listApi, addApi, editApi, detailApi, deleteApi } from '@/api/modules/system/account'

export default {
    name: 'Account',
	components: { TablePage },
	data() {
        const licenseColorList = [
            { label: '绿色', value: 1 },
            { label: '蓝色', value: 1 },
        ]
        const hobbyList = [
            { label: '羽毛球', value: 1 },
            { label: '篮球', value: 2 },
            { label: '书法', value: 3 },
            { label: '绘画', value: 4 },
            { label: '唱歌', value: 5 },
            { label: '旅行', value: 6 },
            { label: '健身', value: 7 },
            { label: '摄影', value: 8 },
            { label: '编程', value: 9 },
            { label: '手工', value: 10 },
            { label: '钓鱼', value: 11 },
            { label: '划船', value: 12 },
        ]
        const userTypeList = [
            { label: '管理员', value: 1 },
            { label: '普通用户', value: 2 },
        ]
        const userIsActiveList = [
            { label: '可用', value: 1 },
            { label: '不可用', value: 0 }
        ]
        const formatter_dateTime = (value) => {
            return this.$moment(value).format('yyyy-MM-DD HH:mm:ss')
        }
		return {
            listName: '账号列表',

            searchFormClearable: undefined,
            searchFormFilterable: undefined,
            searchFormList: [
                { type: 'text', prop: 'id', label: 'ID' },
                { type: 'text', prop: 'username', label: '用户名', },
                { type: 'text', prop: 'nickname', label: '昵称', },
                { type: 'select', prop: 'licenseColor', label: '车牌颜色', optionList: licenseColorList, filterable: true },
                { type: 'date', prop: 'createTime', label: '创建时间' },
                { type: 'datetime', prop: 'time', label: '具体时间' },
                { type: 'select', prop: 'firmId', label: '数据所属厂商', optionList: [], },
            ],

			tableColumns: [
				{ label: 'ID', prop: 'id' },
				{ label: '用户名', prop: 'username' },
				{ label: '昵称', prop: 'nickname' },
				{ label: '创建时间', prop: 'createTime', formatter: formatter_dateTime },
			],
            tableAction: {
                detail: true,
                edit: true,
                delete: true
            },
			pageNum: 1,
			pageSize: 10,


            detailList: [
                { label: 'ID', prop: 'id' },
                { label: '用户名', prop: 'username' },
				{ label: '昵称', prop: 'nickname' },
				{ label: '用户类型', prop: 'userType', formatter: userTypeList },
				{ label: '创建时间', prop: 'createTime', formatter: formatter_dateTime },
				{ label: '更新时间', prop: 'updateTime', formatter: formatter_dateTime },
				{ label: '描述', prop: 'description' },
            ],


            formList: [
                { label: '用户名', prop: 'username' },
                { label: '昵称', prop: 'nickname' },
                { label: '用户类型', prop: 'type', type: 'select', optionList: userTypeList },
                { label: '用户状态', prop: 'isActive', type: 'radio', optionList: userIsActiveList },
                { label: '兴趣', prop: 'hobby', type: 'checkbox', optionList: hobbyList },
                { label: '描述', prop: 'description', type: 'textarea' }
            ],
            formRules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur,change' },
                    { max: 20, message: '用户名不能超过20个字符', trigger: 'blur,change' }
                ],
                nickname: [
                    { required: true, message: '昵称不能为空', trigger: 'blur,change' },
                    { max: 20, message: '昵称不能超过20个字符', trigger: 'blur,change' }
                ],
                type: [
                    { required: true, message: '用户类型不能为空', trigger: 'blur,change', type: 'number'}
                ],
                isActive: [
                    { required: true, message: '用户状态不能为空', trigger: 'blur,change', type: 'number'}
                ]
            },
		}
	},
    methods: { listApi, addApi, editApi, detailApi, deleteApi },
  
}
</script>

<style lang="less" scoped>
    .account {
        background-color: #fff;
        box-shadow: 0 0 25px #ccc;
        padding: 24px;
        min-height: calc(100% - 50px);
    }
</style>
```



