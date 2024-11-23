# A simple API to convert D2 files into SVG images

# Usage
## Build
`docker build -t d2-api:latest`

## Run
`docker run -p 3000:3000 d2-api:latest`

## Usage
`curl -X POST "http://localhost:3000/convert" -F "file=@example.d2" -o diagram2.svg`

* Swap out url with actual location
