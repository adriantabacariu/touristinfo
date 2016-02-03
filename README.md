# Tourist Info

## Installation and Usage

```
$ git clone https://github.com/cdog/touristinfo.git
$ cd touristinfo
$ npm install
$ mysql -u <USERNAME> -p <DATABASE> < scripts/schema.sql # make sure to create the database first
$ cp config/settings-sample.js config/settings.js
$ vim config/settings.js # enter your configuration settings
$ node server.js # open http://127.0.0.1:4000/ in your browser, and voilà
```

### Available grunt tasks

* build _(default)_
* clean
* test
* watch
