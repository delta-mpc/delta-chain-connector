export NODE_PATH=dist/
node dist $1 | $(npm bin)/bunyan
