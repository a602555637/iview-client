<template>
  <div>
    <Modal
      v-model="showStatus"
      title="编辑用户信息"
      @on-ok="ok"
      @on-cancel="cancel"
      :loading="loading"
    >
      <Form :model="localItem" :label-width="80" :rules="ruleValidate" ref="table">
        <FormItem label="用户昵称">
          <Input v-model="localItem.name" placeholder="请输入用户昵称" prop="name" />
        </FormItem>
        <FormItem label="登录名">
          <Input v-model="localItem.username" placeholder="请输入用户名" prop="username" />
        </FormItem>
        <FormItem label="密码">
          <Input v-model="localItem.password" placeholder="请输入密码" prop="password" />
        </FormItem>
        <FormItem label="是否禁用">
          <RadioGroup v-model="localItem.status">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否VIP">
          <RadioGroup v-model="localItem.isVip">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="用户积分">
          <Input v-model="localItem.favs" prop="favs"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { checkUserName } from '@/api/admin'

const favPassCheck = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入用户积分'))
  }
  const reg = /^[1-9]\d*$/.test(value)
  if (!reg) {
    callback(new Error('请输入正确的数值'))
  }
  const result = parseInt(value)
  if (result % 10 === 0 && result >= 0) {
    callback()
  } else {
    callback(new Error('请输入可以除以10的整数'))
  }
}

const userNamePassCheck = (rule, value, callback) => {
  checkUserName(value).then(res => {
    if (res.code === 200) {
      if (res.data === 1) {
        callback()
      } else if (res.data === 0) {
        callback(new Error('用户名冲突，请更换'))
      }
    }
  })
}

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
      loading: true,
      showStatus: false,
      localItem: {
        _id: '',
        name: '',
        username: '',
        password: '',
        status: '',
        favs: '',
        isVip: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { type: 'string', min: 6, message: '昵称长度最小为6位', trigger: 'change' },
          { type: 'string', max: 16, message: '昵称长度不能超过16位', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { type: 'string', message: '请检查邮箱格式', trigger: 'blur' },
          { validator: userNamePassCheck, trigger: 'blur' }

        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度为6位', trigger: 'change' },
          { type: 'string', max: 20, message: '密码长度不能超过20位', trigger: 'change' }
        ],
        favs: [
          // { required: true, message: '请输入用户积分', trigger: 'blur' },
          { validator: favPassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    item (newval, oldval) {
      this.localItem = { ...newval }
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
      this.$refs.table.validate(valid => {
        if (valid) {
          this.loading = false
          this.$emit('changeEvent', false)
          this.$emit('editEvent', this.localItem)
          this.$Message.info('编辑成功')
        } else {
          this.loading = false
          this.$nextTick(() => (this.loading = true))
          this.$Message.error('请检查输入数据')
        }
      })
    },
    cancel () {
      this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
      this.$Message.info('取消编辑')
    }
  }
}
</script>
