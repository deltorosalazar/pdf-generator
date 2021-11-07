# sudo docker-compose -f docker-compose-local.yml down
# sudo docker-compose -f docker-compose-local.yml build
# sudo docker-compose -f docker-compose-local.yml up -d
aws --endpoint-url=http://localhost:4566 lambda create-function \
    --function-name mail-maika \
    --runtime nodejs10.x \
    --zip-file fileb://handler.zip \
    --handler index.lambdaHandler \
    --role arn:aws:iam:awslocal

aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name queue-maika
aws --endpoint-url=http://localhost:4566 lambda create-event-source-mapping --function-name mail-maika  --batch-size 5 --event-source-arn arn:aws:sqs:us-west-1:000000000000:queue-maika


#Get real ARN
#  aws --endpoint-url=http://localhost:4566 sqs get-queue-attributes --queue-url http://localhost:4566/000000000000/queue-maika --attribute-name QueueArn

# checl lambda triggers
# aws --endpoint-url=http://localhost:4566 lambda list-event-source-mappings --function-name mail-maika --event-source-arn arn:aws:sqs:elasticmq:000000000000:queue-maika

#aws --endpoint-url=http://localhost:4566 lambda invoke --function-name mail-maika outfile.txt
#aws --endpoint-url=http://localhost:4566 sqs send-message --message-body="{\"id\":\"123123\",\"report\":\"REPORTE_CONSOLIDADO\",\"email\":\"chcamiloam2@gmaial.com\"}" --queue-url "http://localhost:4566/000000000000/queue-maika"
#aws --endpoint-url=http://localhost:4566 sqs receive-message --queue-url "http://localhost:4566/000000000000/queue-maika"

#aws --endpoint-url=http://localhost:4566 logs describe-log-groups --log-group-name /aws/lambda/mail-maika


#aws --endpoint-url=http://localhost:4566 logs get-log-events --log-group-name /aws/lambda/mail-maika