FROM quay.io/tshephang/tsp:latest
LABEL version=1.29
RUN git clone https://github.com/TSH3PH4NG/Iris-MD.git /root/Iris
WORKDIR /root/Iris/
RUN yarn install --network-concurrency 1
EXPOSE 8000
CMD ["npm" ,  "start"]
