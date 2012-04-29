#!/bin/bash
cd ../template/
python ./genTemplatesJson.py
cd ../jXFrame/local/
node server.js
