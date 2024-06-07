FROM quay.io/tshephang/test:latest
LABEL version = 1.45
RUN git clone https://github.com/TSH3PH4NG/Iris-MD.git /root/Iris
WORKDIR /root/Iris/
RUN yarn install --network-concurrency 1
EXPOSE 8000
CMD ["npm" ,  "start"]
