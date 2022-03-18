<template>
  <div class="login-modal">
    <div class="login-modal-content">
      <h4>Enter your username</h4>
      <form @submit.prevent="addUser">
        <div class="login-form-content">
          <input type="text" v-model="username"
              placeholder="Enter username here">
          <input type="submit" value="Join">
        </div>
      </form>
    </div>
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

.login-modal {
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.login-modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 250px;
}

.login-form-content input {
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
  border-width: 0.5px;
}
</style>
