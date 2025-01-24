FROM quay.io/yasuke/iris_md:latest
LABEL version = 2.89
RUN git clone https://github.com/TSH3PH4NG/Iris-md.git /root/Iris-md
WORKDIR /root/Iris-md/
RUN yarn install --network-concurrency 1
EXPOSE 8000
CMD ["npm" ,  "start"]
