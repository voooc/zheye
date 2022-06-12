<template>
  <div class="validate-input-container pb-3">
    <input
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      :value="modelValue"
      @blur="validateInput"
      @input="updateValue"
      v-bind="$attrs"
    >
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, onMounted } from 'vue'
import { emitter } from './ValidateForm.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
interface RuleProp {
  type: 'required' | 'email' | 'password';
  message: string;
}
export type RuleProps = RuleProp[]
export default defineComponent({
  props: {
    rules: Array as PropType<RuleProps>,
    modelValue: String
  },
  // 非prop的attribute件：组件可以接受任意的attribute，而这些attribute会被添加到这个组件的根元素上。
  // 如果不希望组件的根元素继承attribute，设置inheritAttrs：false，以及$attrs
  inheritAttrs: false,
  setup (props, context) {
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })
    // 完成数据的双向绑定
    const updateValue = (e: Event) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }
    const validateInput = () => {
      if (props.rules) {
        // 循环验证对应的规则，array的every方法返回一个布尔值，数组的每一项返回true，有一项是false，则整体返回false，且立即停止循环
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            // 非空检验
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            // 邮箱格式检验
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            // 密码格式检验
            case 'password':
              passed = passwordReg.test(inputRef.val)
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    const clearInputs = () => {
      inputRef.val = ''
      inputRef.error = false
      inputRef.message = ''
      context.emit('update:modelValue', inputRef.val)
    }
    // 触发事件
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
      emitter.emit('form-item-clear', clearInputs)
    })
    return {
      inputRef,
      validateInput,
      updateValue
    }
  }
})
</script>
