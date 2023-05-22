#!/bin/bash
# Detect if the tag has -beta in it
# If it does this command will be slightly different

if [[ $tag == *"beta"* ]]; then
    gh release create "$tag" \
        --repo="$GITHUB_REPOSITORY" \
        --title="${GITHUB_REPOSITORY#*/} ${tag#v}" \
        --generate-notes \ 
        --prerelease
else
    gh release create "$tag" \
        --repo="$GITHUB_REPOSITORY" \
        --title="${GITHUB_REPOSITORY#*/} ${tag#v}" \
        --generate-notes \ 
fi


current_version=$(cat package.json | grep version | cut -d '"' -f 4)
echo "Current version is $current_version"
sed -i "s/$current_version/$tag/g" package.json
git add .
git config --global user.email "motortruck1221@protonmail.com"
git config --global user.name "GitHub Actions"
git commit -m "Bump version to $tag"
git push -u origin main
