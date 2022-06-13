<template>
  <div class="container">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" type="text"></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input :rules="passwordRules" v-model="passwordVal" placeholder="请输入密码" type="password"></validate-input>
      </div>
      <template v-slot:submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">登录</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ValidateInput, { RuleProps } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'

export default defineComponent({
  name: 'App',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    // email
    const emailVal = ref('')
    const emailRules: RuleProps = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    // password
    const passwordVal = ref('')
    const passwordRules: RuleProps = [
      { type: 'required', message: '密码不能为空' },
      { type: 'password', message: '请输入数字和字母组合的8-16位密码' }
    ]
    // 输出表单处理结果
    const onFormSubmit = (result: boolean) => {
      if (result) {
        router.push('/')
        // 触发login
        store.commit('login')
      }
    }
    return {
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
      onFormSubmit
    }
  }
})
</script>
