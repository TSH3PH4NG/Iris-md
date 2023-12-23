FROM quay.io/inrlwabot/inrl-bot:latest
RUN git clone https://github.com/TSH3PH4NG/Iris-MD.git /root/tsp
WORKDIR /root/tsp/
RUN npm install pm2 -g
RUN yarn install --network-concurrency 1
EXPOSE 3000
CMD ["npm" ,  "start"]
