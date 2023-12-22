FROM quay.io/inrlwabot/inrl:latest
RUN git clone https://github.com/TSH3PH4NG/Iris-md /root/tsp
WORKDIR /root/tsp/
RUN yarn install --network-concurrency 1
EXPOSE 8000
CMD ["npm", "start"]
