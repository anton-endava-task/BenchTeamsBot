#!/bin/bash

docker run --name bench-bot-postgres \
  -e POSTGRES_USER=benchbot \
  -e POSTGRES_PASSWORD=benchbot \
  -e POSTGRES_DB=benchbot \
  -p 5432:5432 \
  -v benchbot_postgres_data:/var/lib/postgresql/data \
  -v $(pwd)/docker/postgres/init:/docker-entrypoint-initdb.d \
  -d postgres:16
