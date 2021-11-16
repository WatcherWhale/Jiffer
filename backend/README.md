# Jiffer Backend

## Configuring

Before starting a server a few things need to be put in check.

### AWS

Make sure the required services are running and configured in AWS.

### Credentials

First your aws credentials must be updated on your system (they change
everytime you start a lab). This however must not be done on an ec2 instance.
You do this by copying this info from awsacademy into `~/.aws/credentials`

This file will look something like this:

```
[default]
aws_access_key_id=...
aws_secret_access_key=...
aws_session_token=...
```

### Configuration

Before starting a server you must setup a correct `config.json`. You can commit
your configuration changes to this file as I do not really care, but it is
prefered to not commit them.

This info comes from your aws infrastructure, mind you are not required to
configure everything to test specialized features.

A default config should look something like this:
```json
{
    "port": 8080,
    "useStaticBucket": true,
    "buckets": {
        "gifs": {
            "region": "us-east-1",
            "name": ""
        },
        "static": {
            "region": "us-east-1",
            "name": ""
        }
    },
    "db": {
        "host": "",
        "user": "",
        "password": ""
    },
    "cognito": {
        "poolId": "",
        "clientId": "",
        "poolRegion": "us-east-1"

    }
}
```

#### Disable bucket use

To not use any buckets you can simply leave them empty and set
`useStaticBucket` to `false`, If and only if you build the frontend and copy
the contents of the `frontend/dist/frontend` to a folder `backend/static`.

Uploading files for being processed will error out however, but not break the server (I think).

## Start a server
### Development

To set up an auto-compiling environment use the following commands:

```bash
# Install required modules
npm install

# Start a development environment
npm start

# Stop the development environment
npm stop

# Delete development environment
npm run delete
```

### Production

```bash
# Install & start on production servers
npm install
npm run build
npm run production
```
