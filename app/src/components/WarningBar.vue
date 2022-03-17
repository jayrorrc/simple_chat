<template>
  <div>
    <p v-for="user in info" :key="user.username">
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
</style>
