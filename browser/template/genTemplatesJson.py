#!/usr/bin/python
# -*- coding: utf-8 -*-  
import os,sys,json
if __name__ == "__main__":
    filenames  = os.listdir("./")
    allTemplate = {"result":"true"
                   ,"data":{}}
    for filename in filenames:
        if os.path.isdir(filename):
            continue
        name,ext = os.path.splitext(filename)
        if ext != ".html":
            continue
        with open(filename) as fp:
            content=fp.read()
            allTemplate["data"][name] = content
    with open("./all.json","w+") as fp:
        fp.write(json.dumps(allTemplate))

