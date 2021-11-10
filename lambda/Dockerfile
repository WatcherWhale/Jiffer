FROM public.ecr.aws/lambda/nodejs:14

RUN yum update
RUN yum -y install ImageMagick

COPY index.js package.json package-lock.json ${LAMBDA_TASK_ROOT}/
RUN npm install

CMD [ "index.handler" ]
