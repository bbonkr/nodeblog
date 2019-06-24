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
$ docker run -p 3000:3000 \
-e PORT=3000 \
-e SITE_NAME=nodeblog \
-e COOKIE_SECRET=nodeblog \
-e DB_HOST=localhost \
-e DB_PORT=3306 \
-e DB_DATABASE=nodeblog \
-e DB_USERNAME=nodeblog \
-e DB_PASSWORD=nodeblog \
-e SENDGRID_API_KEY=xxxxx \
-v /c/app/uploads:/usr/src/app/uploads \
-v /c/app/public:/usr/src/app/public \
-d bbonkr/nodeblog
```

> 환경변수
>
> -   PORT: 웹 응용프로그램 요청 대기 포트 (기본값: 3000)
> -   SITE_NAME: 사이트 제목
> -   COOKIE_SECRET: 쿠키 이름
> -   DB_HOST: 데이터베이스 서버 호스트 이름 또는 아이피 주소
> -   DB_PORT: 데이터베이스 서버 포트
> -   DB_DATABASE: 데이터베이스 이름
> -   DB_USERNAME: 데이터베이스 사용자 이름
> -   DB_PASSWORD: 데이터베이스 사용자 비밀번호
> -   SENDGRID_API_KEY: SendGrid API Key

## Author

👤 **구본철 **

-   Twitter: [@bbonkr](https://twitter.com/bbonkr)
-   Github: [@bbonkr](https://github.com/bbonkr)

## Show your support

Give a ⭐️ if this project helped you !

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
