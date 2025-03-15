FROM quay.io/yasuke/iris-md:latest
LABEL version = 3.75
RUN git clone https://github.com/TSH3PH4NG/Iris-md.git /root/iris_md
WORKDIR /root/iris_md/
RUN yarn install
CMD ["npm" ,  "start"]
