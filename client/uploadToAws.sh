#!/bin/bash
npm run build
rm -f build.zip
zip -r build.zip build
scp -i "~/.ssh/aws-key.pem" build.zip ubuntu@ec2-3-142-236-121.us-east-2.compute.amazonaws.com:~/dev/SomeAdventureGame/client/
rm -f build.zip
