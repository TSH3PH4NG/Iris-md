FROM quay.io/y4suke/test:latest
LABEL version = 1.18
RUN git clone https://github.com/TSH3PH4NG/Iris-md.git /root/Iris-md
WORKDIR /root/Iris-md/
RUN yarn install --network-concurrency 1
EXPOSE 8000
CMD ["npm" ,  "start"]
