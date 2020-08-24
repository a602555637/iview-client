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
      />
      <Row type="flex" justify="space-between" align="middle">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel"
          >导出为Csv文件
        </Button>
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
      </Row>
    </Card>
    <edit-model
      :item="currentItem"
      :isShow="showEdit"
      @editEvent="handleItemEdit"
      @changeEvent="handleChangeEvent"
    />
  </div>
</template>

<script>
import Tables from '_c/tables'
import EditModel from './EditModel'
import { getList, deletePostById, updatePostById } from '@/api/content'
export default {
  name: 'tables_page',
  components: {
    Tables,
    EditModel
  },
  data () {
    return {
      showEdit: false,
      currentItem: '',
      currentIndex: 0,
      total: 0,
      page: 0,
      limit: 10,
      pageArr: [10, 20, 30, 100],
      columns: [
        {
          title: '标题',
          key: 'title',
          minWidth: 400
        },
        {
          title: '创建时间',
          key: 'created',
          width: 200,
          align: 'center'
        },
        {
          title: '作者',
          key: 'user',
          width: 120,
          align: center,
          render: (h, params) => {
            return h('div', [h('span', params.uid.name)])
          }
        },
        {
          title: '分类',
          key: 'catalog',
          width: 100,
          align: center
        },
        {
          title: '积分',
          key: 'fav',
          width: 100,
          align: center
        },
        {
          title: '标签',
          key: 'tags',
          width: 120,
          align: center
        },
        {
          title: '是否结束',
          key: 'isEnd',
          width: 100,
          align: center
        },
        {
          title: '阅读计数',
          key: 'resds',
          width: 100,
          align: center
        },
        {
          title: '回答计数',
          key: 'answer',
          width: 100,
          align: center
        },
        {
          title: '状态',
          key: 'status',
          width: 120,
          align: center,
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                class: test,
                props: {
                  color: params.row.status === '0' ? 'success' : 'error'
                },
                domProps: {
                  innerHTML: params.row.status === '0' ? 'on' : 'off'
                }
              })
            ])
          }
        },
        {
          title: '是否置顶',
          key: 'isTop',
          width: 100,
          align: center,
          render: (h, params) => {
            h('Icon', {
              props: {
                color: '#19be6b',
                type: params.row.isTop === '1' ? 'md-checkmark' : '',
                size: 20
              }
            })
          }
        },
        {
          title: '设置',
          key: 'setting',
          slot: 'avtion',
          fixed: 'right',
          width: 160,
          align: center
        },
        {
          title: 'Handle',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                      vm.$emit('on-delete', params)
                      vm.$emit(
                        'input',
                        params.tableData.filter(
                          (item, index) => index !== params.row.initRowIndex
                        )
                      )
                    }
                  }
                },
                [h('Button', '自定义删除')]
              )
            }
          ]
        }
      ],
      tableData: []
    }
  },
  mounted () {
    this._getList()
  },
  methods: {
    handleChangeEvent (value) {
      this.showEdit = value
    },
    handleItemEdit (item) {
      updatePostById(item).then(res => {
        if (res.code === 200) {
          this.$Message.info('更新成功')
          this.tableData.splice(this.currentIndex, 1, item)
        }
      })
      this.showEdit = false
    },
    handleRowEdit (row, index) {
      this.showEdit = true
      this.currentItem = { ...row }
      this.currentIndex = index
    },
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: `确定删除第${index + 1}条数据吗？`,
        content: `操作删除${row.title}的文章吗？`,
        onOk: () => {
          deletePostById(row._id)
            .then(res => {
              if (res.code === 200) {
                this.$Message.info('成功删除')
                this.tableData = this.tableData.filter(item => {
                  item._id = row._id
                })
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
    onPageChange (page) {
      this.page = page
      this._getList()
    },
    onPageSizeChange (size) {
      this.limit = size
      this._getList()
    },
    _getList () {
      getList({
        page: this.page - 1,
        limit: this.limit
      }).then(res => {
        this.tableData = res.data
        this.total = res.total
      })
    }
  }
}
</script>

<style></style>
