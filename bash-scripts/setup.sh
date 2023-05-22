#!/bin/bash
current_version=$(cat package.json | grep version | cut -d '"' -f 4)
echo "Current version is $current_version"
sed -i "s/$current_version/$tag/g" package.json
git add package.json
git commit -m "Updated version number to $tag"
git push
