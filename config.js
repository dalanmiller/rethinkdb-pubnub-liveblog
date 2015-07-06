console.log(process.env);


if (process.env.RETHINKDB_PORT_28015_TCP_ADDR){
    console.log(process.env.RETHINKDB_PORT_28015_TCP_ADDR);
    db_host = process.env.RETHINKDB_PORT_28015_TCP_ADDR;
} else {
    db_host = "localhost";
}

module.exports = {
  database: {
    db: "pubnub",
    host: db_host,
    port: 28015
  },
  jwt: {
    secret: "xxxxxxxxxxxxxxx"
  },
  pubnub: {
    subscribe_key: "xxxxxxxxxxxxxxx",
    publish_key: "xxxxxxxxxxxxxxx",
    secret_key: "xxxxxxxxxxxxxxx"
  },
  port: 8091,
  admins: [ "admin" ]
};
