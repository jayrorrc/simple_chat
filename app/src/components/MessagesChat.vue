<template>
  <div>
    <h2>{{ username }}</h2>

    <div>
      <div>
        <h4> Simple Chat <span>{{ connections }} connections</span></h4>
      </div>

      <ul>
        <small v-if="typing"> {{ typing }} is typing </small>

        <li v-for="message in messages" :key="message.timestamp">
          <span :class="{'float-left':message.type === 1}">
            {{ message.message }}

            <small>
              Send by: {{message.user}}
            </small>

            <small>
              {{ getViewedBy(message) }}
            </small>
          </span>
        </li>
      </ul>

      <div>
        <form @submit.prevent="send">
          <div>
            <input
              type="text"
              v-model="newMessage"
              placeholder="Enter message here"
              @focus="viewedMensage()"
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessagesChat',

  props: {
    username: {
      type: String,
      required: false,
      default: '',
    },

    typing: {
      type: String,
      required: false,
      default: '',
    },

    connections: {
      type: Number,
      required: false,
      default: 0,
    },

    messages: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      newMessage: null,
    }
  },

  watch: {
    newMessage(value) {
      value
      ? this.$socket.emit('typing', this.username)
      : this.$socket.emit('stopTyping')
    }
  },

  methods: {
    send() {
      this.$emit('send', this.newMessage)

      this.newMessage = null;
    },

    viewedMensage() {
      this.$socket.emit('viewedMensage', {
        user : this.username,
        timestamp: Date.now()
      })
    },

    getViewedBy(message) {
      if (!message.viewedBy) {
        return ''
      }

      return `viewed by: ${message.viewedBy.join(',')}`
    }
  },
}
</script>

<style scoped>
</style>
