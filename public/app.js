Vue.filter("moment", function(value, fmt) {
  return moment(value).format(fmt).replace(/'/g, "");
});

var app = new Vue({
  el: "body",
  data: {
    user: {},
    token: null,
    message: null,
    messages: [],
    authError: null,
    authShow: "login"
  },

  ready: function() {
    var user = window.sessionStorage.getItem("user");
    var token = window.sessionStorage.getItem("token");

    if (user && token)
      this.connect({user: JSON.parse(user), token: token});
  },

  methods: {
    connect: function(response) {
      this.user = response.user;
      this.token = response.token;

      window.sessionStorage.setItem("user", JSON.stringify(response.user));
      window.sessionStorage.setItem("token", response.token);
      var that = this;
      fetch("/api/config", {})
      .then(function(output){
        return output.json();
      }).then(function(message){
	console.log(message.subscribe_key);
        return message.subscribe_key;
      }).then(function(key){
          pn = PUBNUB.init({
            //subscribe_key: "sub-c-505fc60e-20fb-11e5-84a1-02ee2ddab7fe",
            subscribe_key: key,
            auth_key: response.token
          });
      }).then(function(){
        pn.subscribe({
          channel: "updates",
          message: function(message, env, channel) {
            console.log("Message:", message);
            that.messages.unshift(message);
          },
          error: function(error) { console.log(JSON.stringify(error)); }
        });
      });

      fetch("/api/history", {
        headers: {
          "Authorization": "Bearer " + this.token
        }
      })
      .then(function(output) { return output.json(); })
      .then(function(messages) {
        if (messages.success !== false)
          that.messages = messages;
      });
    },

    send: function(ev) {
      fetch("/api/send", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + this.token
        },
        body: JSON.stringify({message: this.message})
      })
      .then(function(output) { return output.json(); })
      .then(function(response) {
        console.log("Sent:", response);
        app.message = null;
      });
    },

    login: function(path, ev) {
      this.authError = null;

      fetch("/api/user/" + path, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      })
      .then(function(output) { return output.json(); })
      .then(function(response) {
        if (!response.success)
          app.authError = response.error;
        else {
          app.authShow = null;
          app.connect(response);
        }
      });
    }
  }
});
