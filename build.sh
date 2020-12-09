#!/bin/bash

cd ui/
npm run build-prod

cd ../server/
cp ../README.md .
poetry build
rm README.md
