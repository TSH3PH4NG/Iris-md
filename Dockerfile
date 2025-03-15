FROM quay.io/yasuke/iris-md:latest
LABEL version = 3.76
RUN git clone https://github.com/TSH3PH4NG/Iris-md.git /root/Iris-md
WORKDIR /root/Iris-md/
RUN yarn cache clean --force
RUN rm -rf /usr/local/share/.cache/yarn
RUN yarn install
CMD ["npm" ,  "start"]
