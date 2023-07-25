FROM node:18

ENV NODE_ENV production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

RUN apt-get update \
 && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends
    
USER node

WORKDIR /app

COPY --chown=node package.json .
COPY --chown=node yarn.lock .

COPY --chown=node . .

RUN yarn install --production=false

ENTRYPOINT ["yarn", "turbo"]