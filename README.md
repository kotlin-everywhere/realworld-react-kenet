# ![RealWorld Example App](logo.png)

> ### [KENET](https://kotlin-everywhere.github.io) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo](https://kenet.mock.pe.kr/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built
with **[KENET](https://kotlin-everywhere.github.io)** including CRUD operations, authentication, routing, pagination,
and more.

We've gone to great lengths to adhere to the **[KENET](https://kotlin-everywhere.github.io)** community styleguides &
best practices.

For more information on how to this works with other frontends/backends, head over to
the [RealWorld](https://github.com/gothinkster/realworld) repo.

# How it works

1. kenet 으로 서버 구현과 API 디자인을 한다.
2. kenet-typescript-gen 으로 API 클라이언트 생성하고, Typescript WebApp 에서 사용한다.

# Getting started

## Run Server

```shell
$ # build docker image
$ docker build -t realworld-react-kenet .
$ # run docker image on localhost:8080
$ docker run --name realworld-react-kenet --rm -it -p 8080:5000 realworld-react-kenet
```

## Develop Server

```shell
$ # localhost 5000 번으로 서버 실행
$ (cd backend && ./gradlew serve 5000)

$ # API 정의에 따라 Client 코드 생성 및 변경시 자동 컴파일 추가
$ (cd backend && ./gradlew --continuous run --args="generate ../frontend/src/api")

$ # react 클라이언트 실행
$ (cd frontend && npm i && npm run start)
```

