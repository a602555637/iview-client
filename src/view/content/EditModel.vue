<template>
  <div>
    <Modal
      v-model="showStatus"
      title="编辑文章属性"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <Form :model="localItem" :label-width="80">
        <FormItem label="标题">
          <Input v-model="localItem.input" placeholder="请输入文章标题" />
        </FormItem>
        <FormItem label="分类">
          <Select v-model="localItem.select">
            <Option value="ask">提问</Option>
            <Option value="advise">建议</Option>
            <Option value="discuss">讨论</Option>
            <Option value="share">分享</Option>
            <Option value="logs">动态</Option>
            <Option value="notice">公告</Option>
          </Select>
        </FormItem>
        <FormItem label="是否结束">
          <RadioGroup v-model="localItem.isEnd">
            <Radio label="0">未结束</Radio>
            <Radio label="1">已结贴</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="回复状态">
          <RadioGroup v-model="localItem.status">
            <Radio label="0">打开回复</Radio>
            <Radio label="1">禁止回复</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否置顶">
          <RadioGroup v-model="localItem.isTop">
            <Radio label="0">未置顶</Radio>
            <Radio label="1">已置顶</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="帖子积分">
          <Slider v-model="formatFav" show-input :step="10"/>
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
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showStatus: false,
      localItem: {
        uid: '',
        tid: '',
        content: '',
        created: '',
        catalog: '',
        fav: '',
        isEnd: '',
        reads: '',
        answer: '',
        status: '',
        isTop: '',
        sort: '',
        tags: ''
      }
    }
  },
  watch: {
    item (newval, oldval) {
      this.localItem = newval
    },
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
      this.$emit('editEvent', this.localItem)
    },
    cancel () {
      this.$emit('changeEvent', false)
      this.$Message.info('Clicked cancel')
    }
  }
}
</script>
