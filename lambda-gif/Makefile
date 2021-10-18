build:
	docker build -t jiffer .

login:
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com

publish:
	docker tag jiffer:latest XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/jiffer:latest
	docker push XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/jiffer:latest
