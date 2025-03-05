FROM quay.io/yasuke/iris_md:latest
LABEL version = 3.61
RUN git clone https://github.com/TSH3PH4NG/Iris-md.git /root/Iris-md
WORKDIR /root/Iris-md/
RUN yarn install
CMD ["npm" ,  "start"]
