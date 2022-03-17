<template>
  <div class="simple-chat">
    <div class="container">
      <div class="col-lg-6 offset-lg-3">

        <div v-if="ready">
          <p v-for="user in info" :key="user.username">
              {{user.username}} {{user.type}}
          </p>
        </div>

        <div v-if="!ready">
          <h4>Enter your username</h4>
          <form @submit.prevent="addUser">
            <div class="form-group row">
              <input type="text" class="form-control col-9" v-model="username"
                  placeholder="Enter username here">
              <input type="submit" value="Join" class="btn btn-sm btn-info ml-1">
            </div>
          </form>
        </div>

        <h2 v-else>{{username}}</h2>
        <div class="card bg-info" v-if="ready">
          <div class="card-header text-white">
            <h4>Simple Chat <span class="float-right">{{connections}} connections</span></h4>
          </div>
          <ul class="list-group list-group-flush text-right">
            <small v-if="typing" class="text-white">{{typing}} is typing</small>
            <li class="list-group-item" v-for="message in messages" :key="message.timestamp">
              <span :class="{'float-left':message.type === 1}">
                {{message.message}}
                <small>Send by: {{message.user}}</small>
                <small>
                  {{ getViewedBy(message) }}
                </small>
              </span>
            </li>
          </ul>

          <div class="card-body">
            <form @submit.prevent="send">
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="newMessage"
                  placeholder="Enter message here"
                  @focus="viewedMensage()"
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleChat',

  data() {
    return {
      newMessage: null,
      messages: [],
      typing: false,
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
      this.typing = false;
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

  watch: {
    newMessage(value) {
      value
      ? this.$socket.emit('typing', this.username)
      : this.$socket.emit('stopTyping')
    }
  },

  methods: {
    send() {
      const timestamp = Date.now()

      this.messages.push({
        message: this.newMessage,
        type: 0,
        user: 'Me',
        timestamp,
      });

      this.$socket.emit('chatMessage', {
        message: this.newMessage,
        user: this.username,
        timestamp,
      });

      this.newMessage = null;
    },

    addUser() {
      this.ready = true;
      this.$socket.emit('joined', this.username)
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
