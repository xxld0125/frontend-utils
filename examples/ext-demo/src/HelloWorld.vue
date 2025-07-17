<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="onClick" type="primary">获取用户</button>
    <div v-if="user">
      <div>用户名：{{ user.name }}</div>
      <div>邮箱：{{ user.email }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      user: null
    }
  },
  methods: {
    onClick() {
      console.error('====点击了')
    }
  }
}
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
