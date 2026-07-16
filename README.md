# 2Fly Keith Logan Creative Platform

GitHub Pages-ready static website.

## Important architecture

GitHub stores:
- HTML
- CSS
- JavaScript
- JSON project records
- Game code
- Small interface assets

Wix hosts:
- Album artwork
- Audio
- Videos
- Large media files

Do not add MP4 or MP3 files to this repository.

## Updating content

Edit:

data/projects.json

A project record can control:
- Homepage cards
- Music page
- Video page
- Hero theme
- Experience links

## Publish

1. Copy the contents of this folder into the root of your local GitHub repository.
2. Commit the changes in GitHub Desktop.
3. Push to origin.
4. GitHub Pages will rebuild automatically.

Expected project URL:
https://2flykl.github.io/2flyKeithLogan/

## Test locally

Run from the project folder:

python -m http.server 8000

Then open:

http://localhost:8000
