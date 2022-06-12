<template>
<form class="validate-form-container">
  <slot name="default"></slot>
  <div class="submit-area" @click.prevent="submitForm">
    <slot name="submit">
      <button type="submit" class="btn btn-primary">提交</button>
    </slot>
  </div>
</form>
</template>
<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
type ValidateFunc = () => boolean
type ClearFunc = () => void
// 第一步 定义一个 events 类型
// 这个定义是让事件和对应的 callback 一一对应
// 这个 string 和 callback 里面的参数是对应的，callback 是这样的
type Events = {
  'form-item-created': ValidateFunc,
  'form-item-clear': ClearFunc
}
// 第二步 实例化 mitt 的时候，作为泛型传递进去
export const emitter = mitt<Events>()
export default defineComponent({
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr:ValidateFunc[] = []
    let clearArr:ClearFunc[] = []
    const submitForm = () => {
      // 循环执行数组，得到最后的结果
      const result = funcArr.map(func => func()).every(result => result)
      // 结果正确，清空
      if (result) {
        clearArr.map(func => func())
      }
      // 子组件通过自定义事件给父组件传递数据
      context.emit('form-submit', result)
    }
    const clearCallback = (func: ClearFunc) => {
      clearArr.push(func)
    }
    const createCallback = (func: ValidateFunc) => {
      funcArr.push(func)
    }
    // 添加监听
    emitter.on('form-item-created', createCallback)
    emitter.on('form-item-clear', clearCallback)
    // 删除监听  生命周期销毁
    onUnmounted(() => {
      emitter.off('form-item-created', createCallback)
      emitter.off('form-item-clear', clearCallback)
      funcArr = []
      clearArr = []
    })
    return {
      submitForm
    }
  }
})
</script>
