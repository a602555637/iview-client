<template>
  <Form
    ref="loginForm"
    :model="form"
    :rules="rules"
    @keydown.enter.native="handleSubmit"
  >
    <FormItem prop="username">
      <Input v-model="form.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="code">
      <Input
        type="text"
        v-model="form.code"
        placeholder="请输入验证码"
        class="i-input"
      >
        <span slot="prepend">
          <Icon :size="14" type="md-planet"></Icon>
        </span>
        <span
          @click="_getCode()"
          slot="append"
          v-html="svg"
          class="i-code"
        ></span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { getCode } from '@/api/login'
import { v4 as uuid } from 'uuid'

export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'change' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码至少为6位', trigger: 'blur' }
        ]
      }
    },
    codeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { type: 'string', len: 4, message: '验证码长度不正确', trigger: 'change' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        username: 'admin',
        password: '',
        code: '',
        sid: ''
      },
      svg: '<div>7 8 8 4</div>'
    }
  },
  computed: {
    rules () {
      return {
        username: this.userNameRules,
        password: this.passwordRules,
        code: this.codeRules
      }
    }
  },
  mounted () {
    // 获取用户唯一标识sid，从缓存中获取，若为空，调用uuid();
    let sid = ''
    if (localStorage.getItem('sid')) {
      sid = localStorage.getItem('sid')
    } else {
      sid = uuid()
      localStorage.setItem('sid', sid)
    }
    this.$store.commit('setSid', sid)
    this.form.sid = sid
    // this._getCode()
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$emit('on-success-valid', { ...this.form })
        }
      })
    },
    _getCode () {
      getCode(this.$store.state.sid).then(res => {
        if (res.code === 200) {
          this.svg = res.data
        }
      })
    }
  }
}
</script>
<style lang="scss">
.i-input {
  .ivu-input-group-append {
    padding: 0;
  }

  .ivu-input-group-prepend {
    width: 32px;
  }
}

.i-code {
  display: inline-block;
  padding: 0;
  height: 28px;
  overflow: hidden;
  svg {
    width: 120px;
    position: relative;
    top: -12px;
  }
}
</style>
