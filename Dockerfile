FROM tshephang01/tshephang:latest

LABEL version="8.2"
RUN git clone https://github.com/TSH3PH4NG/Iris-md.git /iris/Iris-md
WORKDIR /iris/Iris-md
RUN rm -rf node_modules yarn.lock
RUN yarn install --network-concurrency 1
CMD ["node", "index.js"]
