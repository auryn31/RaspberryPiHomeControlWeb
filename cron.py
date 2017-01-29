#!/usr/bin/env python
import csv
import datetime
import sys
import os

now = datetime.datetime.now()

with open('/var/www/html/time.csv', 'rb') as csvfile:
  spamreader = csv.reader(csvfile)
  data = list(spamreader)
  if data:
    hourAlarm = int(data[0][0])
    minuteAlarm = int(data[0][1])
    pin = int(data[0][2])
  else:
    sys.exit()


if now.minute == minuteAlarm and now.hour == hourAlarm - 1:
  mode = "gpio mode %d out" % pin
  os.system(mode)
  setHigh = "gpio write %d 1" % pin
  os.system(setHigh)
