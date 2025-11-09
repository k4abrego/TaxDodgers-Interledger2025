#!/usr/bin/env zsh
# preview.sh — quick preview for design_rasp
# Usage: ./preview.sh
# Starts a simple static server on port 8001 using Python 3

cd "$(dirname "$0")"
python3 -m http.server 8001
