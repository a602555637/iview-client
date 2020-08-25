<template>
  <div>
    <Modal
      v-model="showStatus"
      title="批量设置"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <Form
        :model="localItem"
        :label-width="80"
        ref="table"
      >
        <FormItem label="角色">
          <Select v-model="roles" multiple>
            <Option
              v-for="(item, index) in roles"
              :key="'editTags-' + index"
              :value="item.tagName"
              >{{ item.tagName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="是否禁用">
          <RadioGroup v-model="localItem.status">
            <Radio label="">不设置</Radio>
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否VIP">
          <RadioGroup v-model="localItem.isVip">
            <Radio label="">不设置</Radio>
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: true,
      showStatus: false,
      localIds: [],
      roles: ['admin', 'super_admin', 'user'],
      localItem: {
        status: '',
        isVip: '',
        roles: ['user']
      }
    }
  },
  watch: {
    isShow () {
      this.showStatus = this.isShow
    }
  },
  computed: {
    formatFav: {
      get () {
        return parseInt(this.localItem.fav)
      },
      set (value) {
        this.localItem.fav = value
      }
    }
  },
  methods: {
    ok () {
      this.$emit('changeEvent', false)
      const result = {}
      for (const key of Object.keys(this.localItem)) {
        if (this.localItem[key] !== '') {
          result[key] = this.localItem[key]
        }
      }
      this.$emit('editEvent', result)
      this.$Message.info('设置成功')
    },
    cancel () {
      this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
      this.$Message.info('取消设置')
    }
  }
}
</script>
