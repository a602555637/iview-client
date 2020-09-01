<template>
  <div>
    <Row :gutter="10">
      <Col span="6" :sm="24" :md="9" :lg="6">
        <Card :dis-hover="true" :shadow="true">
          <i-row type="flex" align="middle" justify="center">
            <ButtonGroup :class="{'editing': isEdit}" class="btn-group">
              <Button size="small" :disabled="isEdit">
                <Dropdown @on-click="addMenu">
                  <a href="javascript:void(0)" >
                    <Icon type="md-add"/>
                    <span class="i-dropdown">新增</span>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="bro">兄弟节点</DropdownItem>
                    <DropdownItem :disable="menuData.lengt === 0" name="child">子节点</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Button>
              <Button
                @click="editMenu()"
                size="small"
                icon="ios-create"
                type="primary"
                :disabled="isEdit"
                >修改</Button
              >
              <Button @click="deleteMenu()" :disabled="isEdit" size="small" icon="md-trash" type="error">删除</Button>
            </ButtonGroup>
          </i-row>
          <Tree @on-select-change="handleTreeChange" :data="menuData" ref="tree"/>
        </Card>
      </Col>
      <Col span="18" :sm="24" :md="15" :lg="18">
        <Card
          :title="$t('Menu Options')"
          icon="ios-options"
          :dis-hover="true"
          :shadow="true"
          style="margin-bottom: 10px;"
        >
          <Form
            ref="formValidate"
            :rules="formRules"
            :model="formData"
            :label-width="80"
            :disable="!isEdit"
          >
            <FormItem label="菜单标题" prop="name">
              <Input
                v-model="formData.name"
                placeholder="请输入菜单标题"
              ></Input>
            </FormItem>
            <FormItem label="路径" prop="path">
              <Input
                v-model="formData.path"
                placeholder="请输入菜单路径"
              ></Input>
            </FormItem>
            <FormItem label="菜单类型">
              <Select v-model="formValidate.type" placeholder="请选择菜单类型">
                <Option value="menu">目录</Option>
                <Option value="resource">资源</Option>
                <Option value="link">链接</Option>
              </Select>
            </FormItem>
            <template v-if="formData.type !== 'link'">
              <FormItem label="组件名称" prop="name">
                <Input
                  v-model="formData.name"
                  placeholder="请输入组件名称"
                >
                </Input>
              </FormItem>
              <FormItem label="组件">
                <Input
                  v-model="formData.component"
                  placeholder="请输入前端组件名称"
                >
                  <span slot="prepend">() => ('@/</span>
                  <span slot="append">.vue')</span>
                </Input>
              </FormItem>
              <FormItem label="面包屑">
                不显示
                <Switch v-model="formData.hideInBread" @on-change="change" />
                显示
              </FormItem>
              <FormItem label="显示菜单">
                不显示
                <Switch v-model="formData.hideInMenu" @on-change="change" />
                显示
              </FormItem>
              <FormItem label="使用缓存">
                是
                <Switch v-model="formData.notCache" @on-change="change" />
                否
              </FormItem>
            </template>
            <template v-else>
              <FormItem label="链接">
                <Input v-model="formData.link" placeholder="请输入跳转链接" />
              </FormItem>
            </template>
            <FormItem label="排序">
              <Input v-model="formData.sort" placeholder="组件默认排序" />
            </FormItem>
            <FormItem label="图标">
              <Input v-model="formData.icon" placeholder="图标" />
            </FormItem>
            <FormItem label="重定向">
              <Input
                v-model="formData.redirect"
                placeholder="重定向组件"
              ></Input>
            </FormItem>
            <FormItem v-if="isEdit">
              <Button @click="submit()" type="primary">确定</Button>
              <Button @click="cancel()" style="margin-left: 8px;">取消</Button>
            </FormItem>
          </Form>
        </Card>
        <Card title="$t('resources')" :dis-hover="true" :shadow="true">
          <Tables
            ref="tables"
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
              <Button @click="handleAdd" class="search-btn" type="primary"
                ><Icon type="md-person-add" />&nbsp;&nbsp;添加</Button
              >
            </template>
          </Tables>
          <Row type="flex" justify="space-between" align="middle">
            <Col class="ctrls">
              <Button @click="handleDeleteBatch()">批量删除</Button>
              <Button @click="handleSetBatch()">批量设置</Button>
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
        <operations @on-change="handleTableChange" :columns="columns" :tableData="tableData" :isEdit="isEdit" />
      </Col>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
import Operations from './operations'
import { sortObj, getNode } from '@/libs/util'
import { addMenu, getMenu, updateMenu, deleteMenu } from '@/api/admin'
import select from 'clipboard'

export default {
  name: 'menu',
  components: {
    Tables,
    Operations
  },
  data () {
    return {
      isEdit: false,
      total: 0,
      limit: 10,
      page: 1,
      pageArr: [10, 20, 30],
      menuData: [],
      formData: {
        title: '',
        name: '',
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        link: '',
        operations: []
      },
      formRules: {
        title: [
          {
            required: true,
            message: '菜单名称不得为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '组件名称不得为空',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '路径不得为空',
            trigger: 'blur'
          }
        ],
        component: [
          {
            required: true,
            message: '前端组件不得为空',
            trigger: 'blur'
          }
        ]
      },
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
      selection: [],
      selectNode: [],
      type: ''
    }
  },
  mounted () {
    this._getMenu()
  },
  methods: {
    _getMenu () {
      getMenu().then(res => {
        if (res.code === 200) {
          this.menuData = res.data
        }
      })
    },
    handleTableChange (table) {
      this.tableData = table
    },
    submit () {
      let parent = getNode(this.menuData, this.selectNode[0])
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          // 校验通过
          const data = {
            ...this.formData,
            expand: true
          }
          if (this.tableData.length > 0) data.operations = this.tableData
          data.title = this.formData.name
          // 获取formData 添加到 menuData 中
          // type 决定数据插入的节点； 数据按照tree格式进行格式化
          if (this.type === 'bro') {
            // 兄弟节点
            if (this.menuData.length === 0) {
              // this.isEdit = false
              // this.$refs.formValidate.resetFields()
              addMenu(data).then(res => {
                if (res.code === 200) {
                  this.menuData.push(res.data)
                  this.$Message.success('添加菜单成功!')
                  this.initFields()
                } else this.$Message.error('操作失败')
              })
            } else {
              const selectNode = this.selectNode[0]

              // 可能是一级节点的兄弟节点 =》 addMenu =》 menu
              if (parent.nodeKey === selectNode.nodeKey) {
                addMenu(data).then(res => {
                  if (res.code === 200) {
                    const getMenu = (parent, select) => {
                      for (let i = 0; i < parent.length; i++) {
                        const item = parent[i]
                        // 去重
                        if (item.name === select.name) {
                          // 排序
                          parent.push(data)
                          parent = sortObj(parent, 'sort')
                          return parent
                        } else {
                          if (item.children && item.children.length > 0) {
                            getMenu(item.children, select)
                          }
                        }
                      }
                      return parent
                    }
                    this.menuData = getMenu(this.menuData, selectNode)
                    this.$Message.success('添加菜单成功!')
                  } else this.$Message.error('操作失败')
                })
              } else {
                // 可能是二级节点的兄弟节点 =》 parent 一级节点 =》 updateMenu
                parent = getNode(this.menuData, selectNode)
                updateMenu(parent).then(res => {
                  if (res.code === 200) {
                    this.$Message.success('添加菜单成功')
                  }
                })
              }
            }
          } else if (this.type === 'child') {
            // 子节点
            if (typeof this.selectNode[0].children === 'undefined') {
              this.$set(this.selectNode[0], 'children', [data])
            } else {
              let arr = [...this.selectNode[0].children, data]
              arr = sortObj(arr, 'sort')
              this.$set(this.selectNode[0], 'children', arr)
              // 更新操作
              parent = getNode(this.menuData, this.selectNode[0])
              updateMenu(parent).then(res => {
                if (res.code === 200) {
                  this.$Message.success('添加子菜单成功')
                }
              })
            }
          } else {
            // 更新菜单节点
            const updateNode = (tree, node) => {
              for (let i = 0; i < tree.length; i++) {
                const currentNode = tree[i]
                if (currentNode.nodeKey === node.nodeKey) {
                  tree.splice(i, 1, node)
                  return tree
                } else {
                  if (currentNode.children && currentNode.children.length > 0) {
                    updateNode(currentNode.children, node)
                  }
                }
              }
              return tree
            }
            this.menuData = updateNode(this.menuData, data)
            this.$set(this.selectNode, 0, data)
            // 更新操作
            parent = getNode(this.menuData, this.selectNode[0])
            updateMenu(parent).then(res => {
              if (res.code === 200) {
                this.$Message.success('更新菜单成功')
              }
            })
          }
          // 恢复到默认状态
          this.initFields()
        } else {
          this.$Message.error('请校验表单数据')
        }
      })

      // 提交到后台接口
    },
    cancel () {
      this.initFields()
    },
    deleteMenu () {
      // 判断删除一级菜单, 还是删除子菜单
      const parent = getNode(this.menuData, select)
      if (parent.nodeKey !== select.nodeKey) {
        // 删除子菜单
        updateMenu(parent).then(res => {
          if (res.code === 200) this.$Message.success('删除子菜单成功')
          else {
            deleteMenu({ _id: parent._id }).then(res => {
              if (res.code === 200) this.$Message.success('删除菜单成功')
            })
          }
        })
      }
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.$Modal.confirm({
          title: '确定要删除吗？',
          content: `删除${this.selectNode[0].title}的菜单项吗？`,
          onOk: () => {
            const deleteNode = (tree, node) => {
              for (let i = 0; i < tree.length; i++) {
                const currentNode = tree[i]
                if (currentNode.nodeKey === node.nodeKey) {
                  tree.splice(i, 1)
                  return tree
                } else {
                  if (currentNode.children && currentNode.children.length > 0) {
                    deleteNode(currentNode.children, node)
                  }
                }
              }
            }
            this.menuData = deleteNode(this.menuData, this.selectNode[0])
            this.selectNode = []
          }
        })
      } else {
        this.$Message.error('请选择菜单节点后再删除')
      }
    },
    initFields () {
      this.isEdit = false
      this.$refs.formValidate.resetFields()
      this.type = ''
      this.formData = {
        title: '',
        name: '',
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        link: '',
        operations: []
      }
      this.tableData = []
    },
    addMenu (type) {
      this.type = type
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.isEdit = true
        this.formData = { ...this.selectNode[0] }
      } else {
        this.$Message.error('请选择菜单节点后再添加')
      }
      this.initFields()
    },
    editMenu () {
      if (this.selectNode.length > 0) this.isEdit = true
      else this.$Message.error('请选择菜单节点后再编辑')
    },
    handleTreeChange (item) {
      if (item.length === 0) return
      if (!this.isEdit) {
        this.selectNode = item
        this.formData = item[0]
        // if (item[0].operations && item[0].operations.length > 0)
        this.tableData = [...item[0].operations]
      } else {
        this.$Message.error('当前为编辑状态，请取消编辑后查看')
      }
    },
    handleRowEdit () {},
    handleRowRemove () {},
    handleSelect () {},
    handleSearch () {},
    onPageChange (page) {
      this.page = page
      this._getList()
    },
    onPageSizeChange (size) {
      this.limit = size
      this._getList()
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
      const msg = this.selection.map((o) => o.username).join(',')
      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `操作删除${msg}的用户吗？`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          deleteUserById(arr)
            .then((res) => {
              if (res.code === 200) {
                this.$Message.info('成功删除')
                this.tableData = this.tableData.filter(
                  (item) => !arr.includes(item._id)
                )
              }
            })
            .catch((err) => {
              this.$Message.info('删除失败，原因' + err)
            })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
      this._getList()
    }
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1200px) {
  .btn-group {
    .ivu-icon {
      & + span {
        display: none;
      }
      .i-dropdown {
        display: none;
      }
    }
  }
}

.btn-group {
  .ivu-icon {
    & + span {
      margin-left: 0;
    }
  }
  &.editing {
    a {
      color: #dcdee2;
    }
    .ivu-btn-primary {
      border-color: #dcdee2 !important;
    }
    button:first-child {
      border-right: 0;
    }
  }
}
</style>
