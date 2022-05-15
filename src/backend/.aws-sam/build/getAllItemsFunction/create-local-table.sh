#!/bin/bash

aws dynamodb create-table --cli-input-json file://json/create-sample-table.json --endpoint-url http://localhost:8000
aws dynamodb create-table --cli-input-json file://json/create-user-table.json --endpoint-url http://localhost:8000
