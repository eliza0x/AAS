import redis
import math
import numpy as np
from matplotlib import pyplot
from matplotlib.font_manager import FontProperties

import random

redis = redis.Redis(host='localhost', port=6379, db=0)

with open('./votes.csv', mode='r') as f:
    for i, line in enumerate(f):
        if i < 13:
            name, cnt, limit = [x.strip() for x in line.split(',')]
            # print(name + ': ' + cnt + '/' + limit)
            redis.lpush(name, int(cnt) + random.randint(0,5))

points = {}
for key in redis.keys('*'):
    points[key.decode('utf-8')] = [int(x) for x in redis.lrange(key,0,-1)]

for key, values in points.items():
    x = np.array(range(len(values)))
    y = np.array(values)
    pyplot.plot(x, y, label=key)

fp = FontProperties(fname=r'./migmix-1p-regular.ttf', size=10)
pyplot.legend(prop=fp, loc='lower left')
pyplot.show()

