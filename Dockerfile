FROM tshephang01/tshephang:latest
RUN git clone https://github.com/TSH3PH4NG/Iris-MD.git /root/tsp
WORKDIR /root/tsp/
RUN yarn install --network-concurrency 1
EXPOSE 3000
CMD ["npm" ,  "start"]
