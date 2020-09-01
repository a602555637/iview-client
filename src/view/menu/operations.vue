<template>
  <div>
    <Card title="$t('resources')" :dis-hover="true" :shadow="true">
      <Tables
        ref="tables"
        searchable
        search-place="top"
        v-model="localData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
        @on-selection-change="handleSelect"
        @searchEvent="handleSearch"
      >
        <template v-slot:table-header>
          <Button
            v-if="isEdit"
            @click="handleAdd"
            class="search-btn"
            type="primary"
            ><Icon type="md-person-add" />&nbsp;&nbsp;添加</Button
          >
        </template>
      </Tables>
      <Row v-if="isEdit" type="flex" justify="space-between" align="middle">
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
      <add-model
        :item="selection"
        :isShow="showModal"
        :isEdit="showEdit"
        @editEvent="handleItemAdd"
        @changeEvent="handleAddChangeEvent"
      />
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import AddModel from './operations/add'

export default {
  name: 'operations',
  components: {
    Tables,
    AddModel
  },
  props: {
    colums: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showModal: false,
      showEdit: false,
      selection: {},
      current: 0
    }
  },
  computed: {
    localData: {
      get: function () {
        return this.tableData
      },
      set: function (value) {

      }
    }
  },
  methods: {
    handleAdd () {
      this.showModal = true
    },
    handleItemAdd (item) {
      // 每次添加模态框触发的添加数据事件
      if (this.showEdit) {
        this.tableData.splice(this.current, 1, item)
      } else {
        this.localData.push(value)
      }
      this.$emit('on-change', this.localData)
    },
    handleAddChangeEvent () {},
    handleRowEdit (item, index) {
      this.selection = item
      this.current = index
      this.showModal = true
      this.showEdit = true
    },
    handleRowRemove () {
      this.$Modal.confirm({
        title: '确定删除吗？',
        content: `操作删除${row.name}的名称，请求路径为${row.path}资源吗？`,
        onOk: () => {
          deleteUserById(row._id)
          this.localData.splice(index, 1)
          this.$emit('on-change', this.localData)
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    handleSelect () {},
    handleSearch () {}
  }
}
</script>

<style lang="scss" scoped></style>
