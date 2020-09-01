<template>
  <div>
    <Card title="$t('resources')" :dis-hover="true" :shadow="true">
      <Tables
        ref="tables"
        v-model="localData"
        :columns="columns"
        @on-selection-change="handleSelect"
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
  </div>
</template>

<script>
import Tables from '_c/tables'

export default {
  name: 'operations',
  components: {
    Tables
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
      selection: {},
      current: 0,
      limit: 0,
      page: 0
    }
  },
  watch: {
    tableData (newval, oldval) {
      localStorage.setItem('localData', JSON.stringify(newval))
      this.localData = newval
    }
  },
  computed: {
    localData: {
      get: function () {
        return this.tableData
      },
      set: function (value) {}
    }
  },
  methods: {
    onPageChange (page) {
      this.page = page
    },
    handleSelect (selection) {
      this.selection = selection
      this.$emit('on-change', selection)
      if (!this.isEdit) {
        setTimeout(() => {
          const tmpData = localStorage.getItem('localData')
          if (typeof tmpData !== 'undefined') this.localData = JSON.parse(tmpData)
          this.$Message.warning('无法修改，请选择权限进行编辑')
        }, 0)
      }
    },
    onPageSizeChange (size) {
      this.limit = size
    }
  }
}
</script>

<style lang="scss" scoped></style>
