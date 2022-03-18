<template>
  <div class="chat">
    <div class="chat-title">
      <h2>{{ username }}</h2>
    </div>

    <div class="chat-body">
      <div class="chat-subtitle">
        <h4> Simple Chat <span>{{ connections }} connections</span></h4>
      </div>

      <ul class="chat-messages">
        <small v-if="typing" class="chat-warning"> {{ typing }} is typing </small>

        <li v-for="message in messages" :key="message.timestamp">
          <span :class="[ 'chat-message', { 'chat-message-recivied': message.type === 1 }]">
            {{ message.message }}

            <small class="send-by">
              Send by: {{message.user}}
            </small>

            <small v-if="showRecived(message)" class="recived-by">
              {{ getViewedBy(message) }}
            </small>
          </span>
        </li>
      </ul>

      <div class="chat-bottom">
        <form @submit.prevent="send">
          <div>
            <input
              class="chat-input"
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

      return `Viewed by: ${message.viewedBy.join(',')}`
    },

    showRecived(message) {
      if (!message.viewedBy) {
        return false
      }

      return true
    }
  },
}
</script>

<style scoped>
.chat {
  background: #fcfcfc;
  width: 90%;
  height: 100%;
  margin: auto;
  border-radius: 2px;
}

.chat-title {
  padding: 5px;
  border-bottom: 1px solid #e7e7e7e7;
  width: 80%;
  margin: auto;
}

.chat-body {
  display: flex;
  flex-direction: column;
}

.chat-subtitle {
  padding: 5px;
  border-bottom: 1px solid #e7e7e7e7;
  width: 80%;
  margin: auto;
}

.chat-messages {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
  padding: 20px;
}

.chat-warning {
  padding: 5px;
  background: #f7fdef;
  border-radius: 10px;
  margin: 15px;
}

.chat-message {
  background: #a7d5e5;
  padding: 5px;
  border-radius: 5px;
  float: right;
  font-size: 20px;
}

.chat-message small {
  padding: 2px;
  font-size: 11px;
  margin: 2px;
  border: 1px solid #2596be;
  border-radius: 5px;
}

.send-by {
  background: #254abe;
  color: white;
}

.recived-by {
  background: #25be9a;
}

.chat-message.chat-message-recivied {
  float: left;
  background: #2596be;
  color: white;
}

.chat-bottom {
  width: 100%;
}

.chat-input{
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
  border-width: 0.5px;
  width: 80%;
}
</style>
