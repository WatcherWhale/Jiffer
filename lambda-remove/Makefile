build:
	docker build -t jiffer-remove .

login:
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 049300326122.dkr.ecr.us-east-1.amazonaws.com

publish:
	docker tag jiffer-remove:latest 049300326122.dkr.ecr.us-east-1.amazonaws.com/jiffer-remove:latest
	docker push 049300326122.dkr.ecr.us-east-1.amazonaws.com/jiffer-remove:latest
