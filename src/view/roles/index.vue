<template>
  <div>
    <i-row :gutter="10">
      <i-col span="5" :sm="24" :md="24" :lg="3">
        <Card style="width: 350px;">
          <p slot="title">
            <Icon type="md-contacts" />
            角色列表
          </p>
          <a v-if="!isEdit" href="#" slot="extra" @click.prevent="addRoleModal()">
            <Icon type="md-add" />
            新增
          </a>
          <ul class="i-card">
            <li
              class="flex"
              :class="{ selected: roleIndex === index }"
              v-for="(item, index) in roles"
              :key="'roles' + index"
              @click="selectRole(index)"
            >
              <div class="flex1 round">{{ item.title }}</div>
              <span>
                <Icon
                  type="ios-create"
                  size="16"
                  @click.stop="editLabel(item, index)"
                />
                <Icon
                  @click.stop="editRole(item, index)"
                  type="md-build"
                  size="16"
                  color="#ed4014"
                />
                <Icon
                  @click.stop="_deleteRole(item, index)"
                  type="md-trash"
                  size="16"
                  color="#ed4014"
                />
              </span>
            </li>
          </ul>
        </Card>
      </i-col>
      <i-col span="6" :sm="24" :md="8" :lg="6">
        <Card :dis-hover="true" :shadow="true" title="菜单权限" icon="md-menu">
          <div href="#" slot="extra">
            <ButtonGroup v-if="isEdit" class="btn-group">
              <Button
                @click="submit()"
                size="small"
                icon="ios-create"
                type="primary"
                >确定</Button
              >
              <Button @click="cancel()" size="small" icon="md-trash"
                >取消</Button
              >
            </ButtonGroup>
          </div>
          <Tree
            @on-select-change="handleTreeChange"
            @on-check-change="handleTreeChecked"
            :data="menuData"
            ref="tree"
          />
        </Card>
      </i-col>
      <i-col span="13" :sm="24" :md="16" :lg="13">
        <Card
          title="$t('resources')"
          :dis-hover="true"
          :shadow="true"
          icon="md-exit"
        >
          <operations
            @on-change="handleTableChange"
            :columns="columns"
            :tableData="tableData"
            :isEdit="isEdit"
          />
        </Card>
      </i-col>
    </i-row>
    <Modal
      :loading="loading"
      :ref="form"
      v-model="showAdd"
      title="添加角色"
      @on-ok="modalSubmit()"
      @on-cancel="modalCancel()"
    >
      <Form :model="formItem" :label-width="80" :rules="formRules">
        <FormItem label="角色名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入角色名称" />
        </FormItem>
        <FormItem label="角色编码" prop="role">
          <Input v-model="formItem.role" placeholder="请输入角色编码" />
        </FormItem>
        <FormItem label="角色描述">
          <Input v-model="formItem.desc" placeholder="请输入角色描述" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Operations from './operations'
import { getMenu, getRoles, addRole, updateRole, deleteRole } from '@/api/admin'
import { getPropertyIds, modifyNode } from '@/libs/util'

export default {
  name: '',
  components: {
    Operations
  },
  data () {
    return {
      isEdit: false,
      showAdd: false,
      modalEdit: false,
      editIndex: '',
      loading: false,
      formItem: {
        name: '',
        desc: ''
      },
      tableData: [],
      roleIndex: '',
      roles: [],
      menuData: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '资源名称',
          key: 'name',
          align: 'center',
          search: {
            type: 'input'
          }
        },
        {
          title: '资源路径',
          key: 'path',
          search: {
            type: 'input'
          }
        },
        {
          title: '请求类型',
          key: 'methods',
          search: {
            type: 'input'
          },
          render: (h, params) => {
            return h('div', params.row.method.toUpperCase())
          }
        },
        {
          title: '资源类型',
          key: 'type',
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '接口',
                value: 'api'
              },
              {
                key: '按钮',
                value: 'btn'
              }
            ]
          }
        },
        {
          title: '资源描述',
          key: 'regmark',
          search: {
            type: 'input'
          }
        }
      ],
      formRules: {
        name: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        role: [
          {
            required: true,
            message: '请输入角色编码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this._getMenu()
    this._getRole()
  },
  methods: {
    _getMenu () {
      getMenu().then((res) => {
        if (res.code === 200) {
          this.menuData = res.data
          localStorage.setItem('menuData', this.menuData)
        }
      })
    },
    _getRole () {
      getRoles().then((res) => {
        if (res.code === 200) {
          this.roles = res.data
        }
      })
    },
    modalSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 获取表单信息
          if (this.modalEdit) {
            const roleData = {
              _id: this.roles[this.editIndex]._id,
              ...this.formItem
            }
            updateRole(roleData).then(res => {
              if (res.code === 200) {
                this.roles.splice(this.editIndex, 1, roleData)
              }
            })
          } else {
            // 发送创建角色请求
            addRole(this.formItem).then(res => {
              if (res.code === 200 && res.data.name !== '') {
                this.roles.push(res.data)
                this.$Message.info('添加成功')
              }
            })
          }
          // 清空表单信息
          this.initForm()
          this.$Message.info('添加成功')
        } else {
          this.loading = false
          this.$nextTick(() => (this.loading = true))
          this.$Message.error('请校验表单数据')
        }
      })
    },
    initForm () {
      this.loading = false
      this.modalEdit = false
      this.showAdd = false
      setTimeout(() => {
        this.$refs.table.resetFields()
      }, 0)
    },
    modalCancel () {
      this.initForm()
    },
    submit () {
      this.isEdit = false
      localStorage.setItem('menuData', JSON.stringify(this.menuData))
      const menus = getPropertyIds(this.menuData, ['children', 'operations'])
      const tmp = { ...this.roles[this.roleIndex] }
      tmp.menu = menus
      this.roles.splice(this.roleIndex, 1, tmp)
      updateRole(tmp).then(res => {
        if (res.code === 200) this.$Message.success('更新角色权限成功')
      })
    },
    cancel () {
      this.isEdit = false
      const tmpData = localStorage.getItem('menuData')
      if (typeof tmpData !== 'undefined') {
        this.menuData = JSON.parse(tmpData)
        this.tableData = []
        this.selectNode = []
      }
    },
    editLabel (item, index) {
      this.modalEdit = true
      this.editIndex = index
      this.showAdd = true
      this.formItem = { ...item }
    },
    editRole (item, index) {
      this.isEdit = true
      this.roleIndex = index
    },
    _deleteRole (item, index) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        content: `操作删除${item.name}的角色吗？`,
        onOk: () => {
          this.roles.splice(index, 1)
          deleteRole({ _id: item._id }).then(res => {
            if (res.code === 200 && res.data.deleteCount === 1) this.$Message.success('删除成功')
          })
          this.$Message.success('成功删除')
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    addRoleModal () {
      this.showAdd = true
    },
    selectRole (value) {
      if (this.roleIndex === '' || this.roleIndex !== value) {
        this.roleIndex = value
        if (this.roles[this.roleIndex].menu.length === 0) {
          modifyNode(this.menuData, null, 'checked', false)
          this.tableData = []
          this.roleIndex = ''
          return
        }
        // 修改右侧菜单树 + 权限列表的选中状态
        const tmpData = modifyNode(this.menuData, this.roles[this.roleIndex].menu, 'checked', true)
        localStorage.setItem('menuData', JSON.stringify(tmpData))
        if (this.selectNode.length > 0 && this.selectNode[0].operations) {
          this.tableData = this.selectNode[0].operations
        }
      } else {
        modifyNode(this.menuData, null, 'checked', false)
        this.tableData = []
        this.roleIndex = ''
      }
    },
    handleTreeChange (item) {
      if (item.length === 0) return
      this.selectNode = item
      this.tableData = [...item[0].operations]
    },
    handleTreeChecked (item) {
      if (!this.isEdit) {
        const tmpData = localStorage.getItem('menuData')
        if (typeof tmpData !== 'undefined') this.menuData = JSON.parse(tmpData)
        this.$Message.warning('无法修改，请选择权限进行编辑')
      }
    },
    handleTableChange (table) {
      const ids = table.map(o => o._id)
      if (this.selectNode.length > 0 && this.selectNode[0].operations) {
        this.selectNode[0].operations.forEach(item => {
          if (!ids.includes(item._id)) item._checked = false
          else item._checked = true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.i-card {
  li {
    list-style: none;
    line-height: 24px;
  }
  span {
    display: none;
    i {
      margin-right: 5px;
    }
  }
  .flex {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    &:hover {
      span {
        display: block;
      }
      .flex1 {
        background-color: #eaf4fe;
      }
    }
    &.flex1 {
      flex: 1;
    }
    &.selected {
      .flex1 {
        background-color: #d5e8fc;
      }
    }
  }
  .round {
    padding: 1px 2px;
    border-radius: 3px;
  }
}
</style>
