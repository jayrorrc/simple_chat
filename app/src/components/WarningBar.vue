<template>
  <div>
    <p class="warning" v-for="user in info" :key="user.username">
        {{user.username}} {{user.type}}
    </p>
  </div>
</template>

<script>
export default {
  name: 'WarningBar',

  props: {
    info: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.warning {
  background: #f7fdef;
  width: 60%;
  margin: auto;
  border-radius: 10px;
  padding: 5px;
}
</style>
