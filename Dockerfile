FROM ubuntu
MAINTAINER Daniel Alan Miller <dalanmiller@rethinkdb.com>

#Edit the sources.list
RUN ["echo", "-e", "deb mirror://mirrors.ubuntu.com/mirrors.txt trusty main restricted universe multiverse\
deb mirror://mirrors.ubuntu.com/mirrors.txt trusty-updates main restricted universe multiverse\
deb mirror://mirrors.ubuntu.com/mirrors.txt trusty-backports main restricted universe multiverse\
deb mirror://mirrors.ubuntu.com/mirrors.txt trusty-security main restricted universe multiverse\
", "|", "cat", "-", "/etc/apt/sources.list", ">", "/tmp/out", "&&", "mv", "/tmp/out", "/etc/apt/sources.list"]

#Get the main things
RUN apt-get update
RUN apt-get install --yes curl git python-minimal build-essential

RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install --yes nodejs 

RUN node -v
RUN npm -v

RUN git clone https://github.com/rethinkdb/rethinkdb-pubnub-liveblog.git

WORKDIR rethinkdb-pubnub-liveblog
COPY config.js ./config.js

RUN npm install

CMD ["node",  "./app.js"]

EXPOSE 8091



