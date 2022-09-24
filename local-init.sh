sudo docker-compose -f docker-compose-local.yml down
sudo docker-compose -f docker-compose-local.yml build
sudo docker-compose -f docker-compose-local.yml up -d
aws --endpoint-url=http://localhost:4566 lambda create-function \
    --function-name mail-maika \
    --runtime nodejs10.x \
    --zip-file fileb://handler.zip \
    --handler index.lambdaHandler \
    --role arn:aws:iam:awslocal

aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name queue-maika
aws --endpoint-url=http://localhost:4566 lambda create-event-source-mapping --function-name mail-maika  --batch-size 5 --event-source-arn arn:aws:sqs:us-west-1:000000000000:queue-maika