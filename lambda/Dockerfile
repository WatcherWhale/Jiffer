FROM public.ecr.aws/lambda/nodejs:14

RUN yum update
RUN yum -y install ImageMagick

RUN yum -y install gcc-c++ libpng-devel libjpeg-devel libtiff-devel libgif-devel wget tar make

RUN wget https://downloads.sourceforge.net/project/graphicsmagick/graphicsmagick/1.3.36/GraphicsMagick-1.3.36.tar.gz
RUN tar zxvf GraphicsMagick-1.3.36.tar.gz

RUN cd GraphicsMagick-1.3.36 && ./configure --prefix=/var/task/graphicsmagick --enable-shared=no --enable-static=yes
RUN cd GraphicsMagick-1.3.36 && make && make install

COPY package.json package-lock.json ${LAMBDA_TASK_ROOT}/
RUN npm install

COPY index.js ${LAMBDA_TASK_ROOT}

CMD [ "index.handler" ]
