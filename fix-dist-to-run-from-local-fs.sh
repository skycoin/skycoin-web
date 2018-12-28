#!/bin/bash
sed -i 's/<base href="\/">/<base href="\.\/index.html">/g' ./dist/index.html