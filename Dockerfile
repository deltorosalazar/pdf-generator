FROM python:3.6.1-alpine
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=14

RUN apk update
RUN apk add curl gnupg

RUN apk add --update nodejs

# Download and add wkhtmltopdf
RUN apk add --update --no-cache \
    libgcc libstdc++ libx11 glib libxrender libxext libintl \
    ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family

# On alpine static compiled patched qt headless wkhtmltopdf (46.8 MB).
# Compilation took place in Travis CI with auto push to Docker Hub see
# BUILD_LOG env. Checksum is printed in line 13685.
COPY --from=madnight/alpine-wkhtmltopdf-builder:0.12.5-alpine3.10-606718795 \
    /bin/wkhtmltopdf /bin/wkhtmltopdf
ENV BUILD_LOG=https://api.travis-ci.org/v3/job/606718795/log.txt

RUN [ "$(sha256sum /bin/wkhtmltopdf | awk '{ print $1 }')" == \
      "$(wget -q -O - $BUILD_LOG | sed -n '13685p' | awk '{ print $1 }')" ]

RUN apk add imagemagick librsvg2-dev

RUN apk add --no-cache imagemagick bash pngcrush optipng=0.7.7-r0

RUN apk clean && \
    apk purge && \
    rm -rf /var/lib/apt/lists/* /tmp/*

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install --only=prod

EXPOSE 4000

CMD [ "npm", "run", "prod" ]

