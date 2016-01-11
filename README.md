# TouristInfo

## Installation and Usage

```
$ git clone https://github.com/cdog/touristinfo.git
$ cd touristinfo
$ cp config/database-sample.js config/database.js
$ vim config/database.js
$ mysql -u <USERNAME> -p touristinfo < scripts/schema.sql # make sure to create the database first
$ npm install
$ grunt build
$ node server.js
```

### Available grunt tasks

* build _(default)_
* clean
* test
* watch
