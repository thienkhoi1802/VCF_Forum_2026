#!/bin/zsh

set -e
cd "$(dirname "$0")"

if [[ ! -d node_modules ]]; then
  echo "Đang cài dependency lần đầu..."
  npm install
fi

echo "VCF đang chạy tại http://localhost:3000"
open http://localhost:3000
npm start
