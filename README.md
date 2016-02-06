# Tourist Info

## Installation and Usage

```
$ git clone https://github.com/cdog/touristinfo.git
$ cd touristinfo
$ npm install
$ mongorestore -h localhost:27017 -d touristinfo data/touristinfo --drop
$ cp config/settings-sample.js config/settings-local.js
$ vim config/settings-local.js # enter your configuration settings
$ node server.js # open http://127.0.0.1:4000/ in your browser, and voilà
```

### [Documentation](http://cdog.github.io/touristinfo/)

```
$ grunt jsdoc # build docs (local)
$ grunt docs # build and push docs to gh-pages branch
```

### Available grunt tasks

* build _(default)_
* clean
* docs
* test
* watch
