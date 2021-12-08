# Base Amazon Linux docker container with nodejs 14
FROM public.ecr.aws/lambda/nodejs:14

# Update the docker image
RUN yum -y update

# Copy npm package info into the container, and install the node modules
COPY package.json package-lock.json ${LAMBDA_TASK_ROOT}/
RUN npm install

# Copy the source code into the container
COPY index.js ${LAMBDA_TASK_ROOT}

RUN chmod 666 index.js package.json package-lock.json

# The run command
CMD [ "index.handler" ]
