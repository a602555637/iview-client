<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
        @on-selection-change="handleSelect"
        @searchEvent="handleSearch"
      >
        <template v-slot:table-header>
          <Button @click="handleAddUser" class="search-btn" type="primary"
            ><Icon type="md-person-add" />&nbsp;&nbsp;新增用户</Button
          >
        </template>
      </tables>
      <Row type="flex" justify="space-between" align="middle">
        <Col class="ctrls">
          <Button @click="handleDeleteBatch()">批量删除</Button>
          <Button @click="handleSetBatch()">批量设置</Button>
          <Button style="margin: 10px 0;" type="primary" @click="exportExcel">
            <Icon type="md-download" />导出表格
          </Button>
        </Col>
        <Col>
          <Page
            show-elevator
            show-sizer
            show-total
            :total="total"
            :current="current"
            :page-size="limit"
            :page-size-opts="pageArr"
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
          />
        </Col>
      </Row>
    </Card>
    <edit-model
      :item="currentItem"
      :isShow="showEdit"
      :roles="roles"
      @editEvent="handleItemEdit"
      @changeEvent="handleChangeEvent"
    />
    <add-model
      :isShow="showAdd"
      :roles="roles"
      @editEvent="handleItemAdd"
      @changeEvent="handleAddChangeEvent"
    />
    <set-model
      :isShow="showSet"
      :roles="roles"
      @editEvent="handleItemSet"
      @changeEvent="handleSetChangeEvent"
    />
  </div>
</template>

<script>
import Tables from '_c/tables'
import EditModel from './edit'
import AddModel from './add'
import SetModel from './batchSet'
import dayjs from 'dayjs'
import { getUserList, updateUserById, deleteUserById, addUser, updateUserBatchById, getRoleNames } from '@/api/admin'

export default {
  name: 'user_management',
  components: {
    Tables,
    EditModel,
    AddModel,
    SetModel
  },
  data () {
    return {
      showEdit: false,
      showAdd: false,
      showSet: false,
      currentItem: '',
      currentIndex: 0,
      total: 0,
      page: 0,
      limit: 10,
      option: {},
      roles: [],
      pageArr: [10, 20, 30, 100],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '用户昵称',
          key: 'name',
          minWidth: 140,
          search: {
            type: 'input'
          }
        },
        {
          title: '登录名',
          key: 'username',
          search: {
            type: 'input'
          }
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          render: (h, params) => {
            const roleNames = params.row.roles.map(o => this.roleNames[o]).join(',')
            return h('div', [h('span', roleNames)])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '管理员',
                value: 'admin'
              },
              {
                key: '超级管理员',
                value: 'super_admin'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'favs',
          align: 'center',
          hidden: true
        },
        {
          title: '是否禁用',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.status === '0' ? '否' : '是')
            ])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: '是否会员',
          key: 'isVip',
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.isVip === '0' ? '否' : '是')])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: '创建时间',
          key: 'created',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
            ])
          },
          search: {
            type: 'date'
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          fixed: 'right',
          width: 160,
          align: 'center',
          hidden: true
        }
      ],
      tableData: [],
      selection: []
    }
  },
  computed: {
    roleNames () {
      const tmp = {}
      this.roles.forEach(item => {
        tmp[item.role] = item.name
      })
      return tmp
    }
  },
  mounted () {
    this._getList()
    this._getRoleNames()
  },
  methods: {
    handleSearch (value) {
      // 判断是否有新的查询内容的传递，把分页数据 = 0
      if ((typeof this.option.search !== 'undefined' && value.search !== this.option.search) || this.option === {}) {
        this.page = 1
      } else {
        this.option = value
        this._getList()
      }
    },
    // 批量设置： vip， 禁言，角色
    handleSetBatch () {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要修改的用户')
        return
      }
      this.showSet = true
    },
    // 批量删除
    handleDeleteBatch () {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据')
        return
      }
      const msg = this.selection.map(o => o.username).join(',')
      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `操作删除${msg}的用户吗？`,
        onOk: () => {
          const arr = this.selection.map(o => o._id)
          deleteUserById(arr).then(res => {
            if (res.code === 200) {
              this.$Message.info('成功删除')
              this.tableData = this.tableData.filter(item => !arr.includes(item._id))
            }
          })
            .catch(err => {
              this.$Message.info('删除失败，原因' + err)
            })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
      this._getList()
    },
    handleSelect (selection) {
      this.selection = selection
    },
    // 添加模态框
    handleItemAdd (item) {
      addUser(item).then(res => {
        if (res.code === 200) {
          this.tableData.splice(this.tableData.length, 0, res.data)
          this.$Message.info('更新成功')
        }
      })
    },
    // 编辑模态框
    handleItemEdit (item) {
      updateUserById(item).then(res => {
        if (res.code === 200) {
          this.$Message.info('更新成功')
          this.tableData.splice(this.currentIndex, 1, item)
        }
      })
      this.showEdit = false
    },
    // 批量设置模态框
    handleItemSet (settings) {
      const msg = this.selection.map(o => o.username).join(',')
      this.$Modal.confirm({
        title: '确定修改用户吗？',
        content: `操作删除${msg}的用户吗？`,
        onOk: () => {
          const arr = this.selection.map(o => o._id)
          updateUserBatchById({ ids: arr, settings }).then(res => {
            if (res.code === 200) {
              this.tableData = this.tableData.map(item => {
                if (arr.includes(item._id)) {
                  for (const keys in Object.keys(settings)) {
                    item[keys] = settings[keys]
                  }
                }
              })
              this.$Message.info('设置成功')
            }
          })
            .catch(err => {
              this.$Message.info('删除失败，原因' + err)
            })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    handleAddChangeEvent (value) {
      this.showAdd = value
    },
    handleSetChangeEvent (value) {
      this.showSet = value
    },
    handleAddUser () {
      this.showAdd = true
    },
    handleChangeEvent (value) {
      this.showEdit = value
    },
    onPageChange (page) {
      this.page = page
      this._getList()
    },
    onPageSizeChange (size) {
      this.limit = size
      this._getList()
    },
    handleRowEdit (row, index) {
      this.showEdit = true
      this.currentItem = { ...row }
      this.currentIndex = index
    },
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `操作删除${row.name}的文章吗？`,
        onOk: () => {
          deleteUserById(row._id)
            .then(res => {
              if (res.code === 200) {
                this.$Message.info('成功删除')
                this.tableData.splice(index, 1)
              }
            })
            .catch(err => {
              this.$Message.info('删除失败，原因' + err)
            })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    _getList () {
      getUserList({
        page: this.page - 1,
        limit: this.limit,
        option: this.option
      }).then(res => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    _getRoleNames () {
      getRoleNames().then(res => {
        if (res.code === 200) this.roles = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ctrls {
  button {
    margin-right: 10px;
  }
}
</style>
