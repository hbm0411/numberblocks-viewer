#!/bin/bash

# 버전 업데이트 스크립트
# 사용법: ./scripts/update-version.sh 1.0.6

if [ $# -eq 0 ]; then
    echo "사용법: $0 <새버전>"
    echo "예시: $0 1.0.2"
    exit 1
fi

NEW_VERSION=$1
echo "버전을 $NEW_VERSION 으로 업데이트합니다..."

# 현재 버전 찾기
CURRENT_VERSION=$(grep -o "v=[0-9]\+\.[0-9]\+\.[0-9]\+" docs/index.html | head -1 | sed 's/v=//')
if [ -z "$CURRENT_VERSION" ]; then
    echo "❌ 현재 버전을 찾을 수 없습니다."
    exit 1
fi

echo "현재 버전: $CURRENT_VERSION"
echo "새 버전: $NEW_VERSION"

# index.html 파일 업데이트
sed -i '' "s/v=$CURRENT_VERSION/v=$NEW_VERSION/g" docs/index.html
sed -i '' "s/CURRENT_VERSION = '$CURRENT_VERSION'/CURRENT_VERSION = '$NEW_VERSION'/g" docs/index.html

echo "✅ 버전 업데이트 완료: $NEW_VERSION"
echo "변경된 파일: docs/index.html" 