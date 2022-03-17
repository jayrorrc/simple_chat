<template>
  <div>
    <h4>Enter your username</h4>
    <form @submit.prevent="addUser">
      <div >
        <input type="text" v-model="username"
            placeholder="Enter username here">
        <input type="submit" value="Join">
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LogIn',

  data() {
    return {
      username: null,
    }
  },

  methods: {
    addUser() {
      this.$emit('addUser', this.username)
    },
  },
}
</script>

<style scoped>
</style>
