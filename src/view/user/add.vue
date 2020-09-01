<template>
  <div>
    <Modal
      v-model="showStatus"
      title="添加用户信息"
      @on-ok="ok"
      @on-cancel="cancel"
      :loading="loading"
    >
      <Form
        :model="localItem"
        :label-width="80"
        :rules="ruleValidate"
        ref="table"
      >
        <FormItem label="登录名">
          <Input
            prefix="md-mail"
            v-model="localItem.username"
            placeholder="请输入用户名"
            prop="username"
          />
        </FormItem>
        <FormItem label="密码">
          <Input
            prefix="md-lock"
            v-model="localItem.password"
            placeholder="请输入密码"
            prop="password"
          />
        </FormItem>
        <FormItem label="角色">
          <Select v-model="localItem.roles" multiple>
            <Option
              v-for="(item, index) in roles"
              :key="'role-' + index"
              :value="item.role"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="用户昵称">
          <Input
            prefix="md-person"
            v-model="localItem.name"
            placeholder="请输入用户昵称"
            prop="name"
          />
        </FormItem>
        <FormItem label="手机号码">
          <Input
            v-model="localItem.mobile"
            placeholder="请输入手机号码"
            prop="mobile"
          />
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
          <Input v-model="localItem.favs" prop="favs" />
        </FormItem>
        <FormItem label="所在城市">
          <Input
            prefix="md-pin"
            v-model="localItem.location"
            placeholder="请输入用户所在城市"
          />
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="localItem.gender">
            <Radio label="0">男</Radio>
            <Radio label="1">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="个性签名">
          <Input
            type="textarea"
            v-model="localItem.regmark"
            placeholder="请输入个性签名"
          />
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

const userNamePassCheck = (rule, value, callback, vm) => {
  if (vm.localItem.username === vm.item.username) {
    callback()
    return
  }
  checkUserName(value).then((res) => {
    if (res.code === 200) {
      if (res.data === 1) {
        callback()
      } else if (res.data === 0) {
        callback(new Error('用户名冲突，请更换'))
      }
    }
  })
}

const mobileCheck = (rule, value, callback) => {
  const reg = /^1[3456789]\d{9}$/.test(value)
  reg ? callback() : callback(new Error('请检查手机格式'))
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
    },
    roles: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: true,
      showStatus: false,
      localItem: {
        roles: [],
        name: '',
        username: '',
        password: '',
        mobile: '',
        regmark: '神马也木有',
        location: '',
        gender: '',
        status: '',
        favs: '',
        isVip: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '昵称长度最小为6位',
            trigger: 'change'
          },
          {
            type: 'string',
            max: 16,
            message: '昵称长度不能超过16位',
            trigger: 'change'
          }
        ],
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { type: 'string', message: '请检查邮箱格式', trigger: 'blur' },
          {
            validator: (rule, value, callback) =>
              userNamePassCheck(rule, value, callback, this),
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '密码长度为6位',
            trigger: 'change'
          },
          {
            type: 'string',
            max: 20,
            message: '密码长度不能超过20位',
            trigger: 'change'
          }
        ],
        favs: [
          // { required: true, message: '请输入用户积分', trigger: 'blur' },
          { validator: favPassCheck, trigger: 'blur' }
        ],
        mobile: [{ validator: mobileCheck, trigger: 'blur' }]
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
      this.$refs.table.validate((valid) => {
        if (valid) {
          this.loading = false
          this.$emit('changeEvent', false)
          this.$emit('editEvent', { ...this.localItem })
          setTimeout(() => {
            this.$refs.table.resetFields()
          }, 0)
          this.$Message.info('添加成功')
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
