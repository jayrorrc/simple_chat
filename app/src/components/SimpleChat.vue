<template>
  <div class="simple-chat">
    <WarningBar
      v-if="ready"
      :info="info"
    />

    <LogIn
      v-if="!ready"
      @addUser="(username) => addUser(username)"
    />

    <MessagesChat
      v-else
      :username="username"
      :connections="connections"
      :typing="typing"
      :messages="messages"
      @send="(newMessage) => send(newMessage)"
    />
  </div>
</template>

<script>
import WarningBar from "./WarningBar"
import LogIn from "./LogIn"
import MessagesChat from "./MessagesChat"

export default {
  name: 'SimpleChat',

  components: {
    WarningBar,
    LogIn,
    MessagesChat,
  },

  data() {
    return {
      messages: [],
      typing: '',
      username: null,
      ready: false,
      info: [],
      connections: 0,
    }
  },

  created() {
    window.onbeforeunload = () => {
      this.$socket.emit('leave', this.username);
    }
  },

  sockets: {
    chatMessage: function (data) {
      this.messages.push({
        message: data.message,
        type: 1,
        user: data.user,
        timestamp: data.timestamp
      });
    },

    typing: function (data) {
      this.typing = data;
    },

    stopTyping: function () {
      this.typing = '';
    },

    joined: function (data) {
      this.info.push({
        username: data,
        type: 'joined'
      });

      setTimeout(() => {
        this.info = [];
      }, 5000);
    },

    leave: function (data) {
      this.info.push({
        username: data,
        type: 'left'
      });

      setTimeout(() => {
        this.info = [];
      }, 5000);
    },

    connections: function (data) {
      this.connections = data;
    },

    viewedMensage: function (data) {
      const lastMensageIndex = this.messages.length - 1

      if (lastMensageIndex >= 0) {
        const lastTimestamp = this.messages[lastMensageIndex].timestamp

        if (lastTimestamp < data.timestamp) {
          const lastMessage = this.messages[lastMensageIndex]

          if (lastMessage.user != data.user) {
            if (lastMessage.viewedBy) {
              if (!lastMessage.viewedBy.includes(data.user)) {
                this.messages[lastMensageIndex].viewedBy.push(data.user)
              }
            } else {
              this.messages[lastMensageIndex].viewedBy = [ data.user ]
            }
          }
        }
      }
    }
  },

  methods: {
    send(newMessage) {
      const timestamp = Date.now()

      this.messages.push({
        message: newMessage,
        type: 0,
        user: 'Me',
        timestamp,
      });

      this.$socket.emit('chatMessage', {
        message: newMessage,
        user: this.username,
        timestamp,
      });
    },

    addUser(username) {
      this.ready = true
      this.username = username

      this.$socket.emit('joined', username)
    },
  },
}
</script>

<style scoped>
</style>
