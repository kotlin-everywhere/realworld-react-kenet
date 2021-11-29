FROM ubuntu:21.10

# ubuntu 기본 설정
ENV DEBIAN_FRONTEND=noninteractive

# APT 바이너리 유지하도록, 클린업 삭제
RUN rm /etc/apt/apt.conf.d/docker-clean

# install required
RUN --mount=target=/var/lib/apt/lists,type=cache \
    --mount=target=/var/cache/apt,type=cache \
    apt-get update -y && \
    # nginx: server, npm: frontend
    apt-get install -y nginx npm openjdk-16-jdk-headless

# nginx
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    # use site.conf
    rm /etc/nginx/sites-enabled/default
COPY site.conf /etc/nginx/sites-enabled

WORKDIR /app

# install & build backend
COPY backend backend
RUN --mount=target=/root/.gradle,type=cache \
    (cd backend && ./gradlew --no-daemon build && build/install/backend/bin/backend generate ../frontend/src/api)

# install & build frontend
COPY frontend frontend
RUN --mount=target=/root/.npm,type=cache \
    (cd frontend && npm i && REACT_APP_API_HOST='' npm run build)


COPY web.sh web.sh

STOPSIGNAL SIGQUIT
CMD ./web.sh