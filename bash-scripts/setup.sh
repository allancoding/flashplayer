#!/bin/bash
# # Detect if the tag has -beta in it
# # If it does this command will be slightly different

# if [[ $tag == *"beta"* ]]; then
#     gh release create "$tag" \
#         --repo="$GITHUB_REPOSITORY" \
#         --title="${GITHUB_REPOSITORY#*/} ${tag#v}" \
#         --generate-notes \ 
#         --prerelease
# else
#     gh release create "$tag" \
#         --repo="$GITHUB_REPOSITORY" \
#         --title="${GITHUB_REPOSITORY#*/} ${tag#v}" \
#         --generate-notes \
# fi
gh release create "$tag" -p --repo="$GITHUB_REPOSITORY" --title="${GITHUB_REPOSITORY#*/} ${tag#v}" --generate-notes
