#!/bin/bash

cd ui/
npm install
npm run build-prod

cd ../server/
cp ../README.md .
poetry install
poetry build
rm README.md
