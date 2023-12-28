FROM quay.io/tshephang/test:latest
RUN git clone https://github.com/TSH3PH4NG/Iris-MD.git /root/tsp
WORKDIR /root/tsp/
RUN yarn install --network-concurrency 1
EXPOSE 8000
CMD ["npm" ,  "start"]
