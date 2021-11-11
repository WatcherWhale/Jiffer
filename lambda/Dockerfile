# Base Amazon Linux docker container with nodejs 14
FROM public.ecr.aws/lambda/nodejs:14

# Update the docker image
RUN yum update
RUN yum -y upgrade

# Install ImageMagick
RUN yum -y install ImageMagick

# Install build packages
RUN yum -y install gcc-c++ libpng-devel libjpeg-devel libtiff-devel libgif-devel wget tar make

# Download and extract the latest GraphicsMagick source code
RUN wget https://downloads.sourceforge.net/project/graphicsmagick/graphicsmagick/1.3.36/GraphicsMagick-1.3.36.tar.gz
RUN tar zxvf GraphicsMagick-1.3.36.tar.gz

# Compile GraphicsMagick
RUN cd GraphicsMagick-1.3.36 && ./configure --prefix=/var/task/graphicsmagick --enable-shared=no --enable-static=yes
RUN cd GraphicsMagick-1.3.36 && make && make install

# Copy npm package info into the container, and install the node modules
COPY package.json package-lock.json ${LAMBDA_TASK_ROOT}/
RUN npm install

# Copy the source code into the container
COPY index.js ${LAMBDA_TASK_ROOT}

# The run command
CMD [ "index.handler" ]
