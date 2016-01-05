#!/bin/bash
target=$(date +"%m%d").json
curl "https://api.speedcurve.com/v1/sites?days=7" -u eptge2qn6nd4qi46x7ue1luyp2w41z:x > $target