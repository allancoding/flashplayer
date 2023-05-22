#!/bin/bash
current_version=$(cat package.json | grep version | cut -d '"' -f 4)
echo "Current version is $current_version"
sed -i "s/$current_version/$tag/g" package.json
git add .
#setup git user (with github workflow)
git config --global user.email "motortruck1221@protonmail.com"
git config --global user.name "motortruck1221"
git commit -m "Bump version to $tag"
git push -u origin main
