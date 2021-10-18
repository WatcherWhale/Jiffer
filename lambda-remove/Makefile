build:
	docker build -t jiffer-remove .

login:
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com

publish:
	docker tag jiffer-remove:latest XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/jiffer-remove:latest
	docker push XXXXXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/jiffer-remove:latest
