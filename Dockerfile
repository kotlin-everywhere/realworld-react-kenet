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
    apt-get install -y nginx npm

# nginx
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    # use site.conf
    rm /etc/nginx/sites-enabled/default
COPY site.conf /etc/nginx/sites-enabled

WORKDIR /app
# install & build frontend
COPY frontend frontend
RUN --mount=target=/app/frontend/node_modules,type=cache \
    (cd frontend && npm i && npm run build)

STOPSIGNAL SIGQUIT
CMD nginx -g 'daemon off; error_log /dev/stdout info;'