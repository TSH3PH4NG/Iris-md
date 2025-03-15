FROM quay.io/yasuke/iris-md:latest

LABEL version="1.5"
RUN git clone https://github.com/TSH3PH4NG/Iris-md.git /app/Iris-md
WORKDIR /app/Iris-md
RUN rm -rf node_modules yarn.lock
RUN yarn install --network-concurrency 1
CMD ["node", "index.js"]
