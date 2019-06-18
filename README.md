<h1 align="center">Welcome to nodeblog 👋</h1>
<p>
  <img src="https://img.shields.io/badge/version-0.1.0-dev-blue.svg?cacheSeconds=2592000" />
</p>

> document sharing service prototype app. node backend + react.js frontend

## Usage

Copy `src/.sample.env` to `src/.env` then edit your `src/.env`.

Need to fill database information.

> ### .env Sample
>
> for MariaDB
>
> ```
> SITE_NAME=nodeblog
> COOKIE_SECRET=nodeblog
> DB_HOST=10.10.0.10
> DB_PORT=3306
> DB_DATABASE=nodeblog
> DB_USERNAME=nodeblog
> DB_PASSWORD=nodeblog
> SKIP_PREFLIGHT_CHECK=true
> ```

```sh
npm run start
```

## Run tests

```sh
npm run test
```

## Docker

### Build Image

```basg
$ cd src/
$ docker build -t bbonkr/nodeblog .
```

### Run

```bash
$ docker images # 이미지 확인
$ docker run -p 3000:3000 -e PORT=3000 -v /c/app/uploads:/usr/src/app/uploads -v /c/app/public:/usr/src/app/public -d bbonkr/nodeblog
```

## Author

👤 **구본철 **

-   Twitter: [@bbonkr](https://twitter.com/bbonkr)
-   Github: [@bbonkr](https://github.com/bbonkr)

## Show your support

Give a ⭐️ if this project helped you !

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
