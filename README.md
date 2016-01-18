# Tourist Info

## Installation and Usage

```
$ git clone https://github.com/cdog/touristinfo.git
$ cd touristinfo
$ cp config/settings-sample.js config/settings.js
$ vim config/settings.js
$ mysql -u <USERNAME> -p <DATABASE> < scripts/schema.sql # make sure to create the database first
$ npm install -g grunt-cli
$ npm install
$ grunt build
$ node server.js
```

### Available grunt tasks

* build _(default)_
* clean
* test
* watch
