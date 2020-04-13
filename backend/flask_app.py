#written by noah friedman--a periodically updated version of whats on python anywhere

import sys
import pandas as pd

from flask import Flask, render_template, request, redirect, Response
import random, json
import re

import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)

#PROCESSING FUNCTIONS
#some cleanup that is applied to the product name that comes to us from amazon
def format_raw_product_name(name):
    return re.sub(',', '', name)

from flask_cors import CORS
CORS(app)

@app.route('/')

def output():
	# serve index template
	return render_template('index.html', name='Joe')

###DIFFERENT APPLICATIONS
###TODO PUT THEM IN THEIR OWN LIBRARIES EVENTUALLY

def service_deal_query(payload):

    #we log all deal queries
    def log_deal_query(queryLogParams):
        logDatabaseFile = '/home/noahfriedman/mysite/database/trackingDatabase/dealQueryLog.csv'
        f = open(logDatabaseFile, 'a+')
        for key, value in queryLogParams.items():
            print('elem:',str(key), str(value))
            f.write(':'.join([str(key), str(value)]) + ',') #write a csv list of key:value pairs
        f.write('\n')
        f.close()

    #initiate database
    dbPrice, dbUrl = load_database()

    data = payload['content']
    print(payload)
    logInfo = payload['logParams']
    for item in data:
    # loop over every row
        itemName = str(item['itemName'])
        price = str(item['price'])

        itemName = format_raw_product_name(itemName)

        if itemName in dbPrice:
            price = dbPrice[itemName]
            url = dbUrl[itemName]
            logInfo['status'] = 'matchFound'
            log_deal_query(logInfo) #log
            return json.dumps({'price': price, 'url': url, 'matchFound':'True'})
            #return 'you can find this item for '+ str(price)+ ' dollars at:'+ url
        else:
            logInfo['status'] = 'matchNotFound'
            log_deal_query(logInfo) #log
            return json.dumps({'price': '', 'url': '', 'matchFound':'False'})

#services a log click action by writing the json payload to our tracking database
def service_log_click(data):
    logDatabaseFile = '/home/noahfriedman/mysite/database/trackingDatabase/clickLog.csv'
    f = open(logDatabaseFile, 'a+')
    for key, value in data.items():
        f.write(':'.join([str(key), str(value)]) + ',') #write a csv list of key:value pairs
    f.write('\n')
    f.close()

@app.route('/receiver', methods = ['POST'])
def worker():

    #TODO ?--should each functionality go to its own unique receiver?
    # read json + reply
    payload = request.get_json(force=True)
    if payload['type'] == 'dealQuery':
        return service_deal_query(payload)
    elif payload['type'] == 'logClick':
        service_log_click(payload['content'])
        return ''

#
###
#########
###DATABASE SECTION

def load_database(dbPath = '/home/noahfriedman/mysite/database/productDatabase/testDatabase.csv'):
    db = pd.read_csv(dbPath)
    dbPrice = dict(zip(db['itemName'], db['itemPrice']))
    dbUrl = dict(zip(db['itemName'], db['url']))
    return dbPrice, dbUrl


if __name__ == '__main__':
	# run!
        #TESTING

	dbPrice, dbUrl = load_database()
	app.run()
