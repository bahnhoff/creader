/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*eslint-env node */
'use strict';
require('dotenv').config({silent: true});


var express = require('express');  // app server
var bodyParser = require('body-parser');  // parser for post requests
var watson = require('watson-developer-cloud');  // watson sdk

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Create the service wrapper


var conversation = watson.conversation({
  url: 'https://gateway.watsonplatform.net/conversation-experimental/api',
  username: process.env.CONVERSATION_USERNAME || '961ad1db-b809-4679-9147-8856c05d5d0b',
  password: process.env.CONVERSATION_PASSWORD || '4evjnYyPNUWz',
  version_date: '2016-05-19',
  version: 'v1-experimental'
});






// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {
  var payload = {
    workspace_id: process.env.WORKSPACE_ID || 'acd2fad4-b073-4a6f-9d92-4786c4ded80a',
    context: {}
  };
  if (req.body) {
    if (req.body.input) {
      payload.input = req.body.input;
    }
    if (req.body.context) {
      // The client must maintain context/state
      payload.context = req.body.context;
    }
  }
  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }
    return res.json(updateMessage(data));
  });
});



/**
 * Updates the response text using the intent confidence
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */

function updateMessage(response) {
  var responseText = null;

  alert(response);
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];
    if (!response.output) {
      response.output = {};
    }
    getMessage(response.intents[0]);
    // Depending on the confidence of the response the app can return different messages.
    // The confidence will vary depending on how well the system is trained. The service will always try to assign
    // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
    // user's intent. In these cases it is usually best to return a disambiguation message
    // ('I did not understand your intent, please rephrase your question', etc..)
    if (intent.confidence >= 0.60 && intent.intent == 'Accountlink_Watson') {
      responseText = ' You  should contact the team administrators for the link.';
    } else if (intent.confidence >= 0.60 && intent.intent == 'Addmembers_Watson') {

      responseText =  ' The team administrators can add new members to the dedicated bluegroup and once it was syncronized into Watson Analytics new members can logon into tool with the specific link of the team';

    } else if (intent.confidence >= 0.60 && intent.intent == 'Databaseconnection_Watson') {
     responseText = ' You can setup additional database connections in Watson Analytics but only with team account. ';

   } else if (intent.confidence >= 0.60 && intent.intent == 'Databaseconnectivity_Watson') {
    responseText = ' Note: Only teams have the ability to connect to databases. We have not enabled connectivity to internal databases from Watson Analytics. If you need this feature, you have two options: 1) Working with your DBA and the IBM Firewall team to open the firewall OR 2) using the Watson Analytics Secure Gateway.However, the quickest and easiest ways to get your data into Waston Analytics is manually load a CSV, .xls, or .xlsx file to create a Watson Analytics dataset or use the Cognos BI connector to import data. Note: For external databases (i.e. internet facing),  then your Watson Analytics Team Administrator can create a connection to that database without the need for the Watson Analytics Secure Gateway. ';

  } else if (intent.confidence >= 0.60 && intent.intent == 'Individualtoteam_Watson') {
   responseText = ' You can have access to both, you dont need to switch. ';
}   else if (intent.confidence >= 0.60 && intent.intent == 'Membersteam_Watson') {
  responseText = ' 50-500 users are recomended for each team ';

}   else if (intent.confidence >= 0.60 && intent.intent == 'Shareresults_Watson') {
responseText = ' Yes, if your colleages are on the same tenant as you then you can share your work with them.';

}    else if (intent.confidence >= 0.60 && intent.intent == 'URLaccess_Watson') {
responseText = 'The URL for Watson Analytics for IBM will be unique for individual accounts and team tenants. This url will be provided when you register, you can find more details on registration portal. Access to external Watson Analytics will continue to be http://www.ibm.com/analytics/watson-analytics/ ';

} else if (intent.confidence >= 0.60 && intent.intent == 'costboarding_Watson') {
responseText = ' There is currently no cost to boarding to use Watson Analytics ';

}  else if (intent.confidence >= 0.60 && intent.intent == 'teamaccount_Watson') {
responseText = ' Please login to the portal and request team account under team section https://ibm.biz/waforibm';

} else if (intent.confidence >= 0.60 && intent.intent == 'Reports_Watson') {
responseText = ' WA can utilize any cognos reports which result in a flat representation of data.  If the report summarized or totals data then it wont be as useful in Watson Analytics as lower level, uncategorized data. ';

} else if (intent.confidence >= 0.60 && intent.intent == 'Logon_Watson') {
responseText = ' Access via Intranet ID ';

} else if (intent.confidence >= 0.60 && intent.intent == 'Access_Watson') {
responseText = ' Individual and Team access are functionally the same.  Team access ensures that the colleagues you want to share your work with are on the same tenant as you are so that your work can be shared with each other.';

}  else if (intent.confidence >= 0.60 && intent.intent == 'Cognos_Watson') {
responseText = ' In Watson Analytics, click on Add, then on Upload Data and afterwards IBM Cognos Report. Enter the associated URL from the list below to log in. Typically, the last URL you entered in the input field is loaded by default. Links : Blue Dev  https://zcogwasd1.boulder.ibm.com/transform/bacc/cognos/bi01n/ServletGateway/servlet/Gateway Blue Test  https://zcogwast.boulder.ibm.com/transform/bacc/cognos/bi01n/ServletGateway/servlet/Gateway Blue Prod  https://w3-03.ibm.com/transform/bacc/cognos/bi01n/ServletGateway/servlet/Gateway Green Prod  https://w3-03.ibm.com/transform/bicc/cognos/ServletGateway/servlet/Gateway BP CDT  https://c03z0088.boulder.ibm.com/transform/bicc/cognos/extwi/ServletGateway/servlet/Gateway BP Prod  https://w3-03.ibm.com/transform/bicc/cognos/extwi/ServletGateway/servlet/Gateway';

} else if (intent.confidence >= 0.60 && intent.intent == 'Data_Watson') {
responseText = ' Yes, it is possible to store IBM confidential data ';

} else if (intent.confidence >= 0.60 && intent.intent == 'Dataset_Watson') {
responseText = ' Yes, datasets can be enhanced by filtering or creating new columns.  However editing of cell values is not permitted. ';

} else if (intent.confidence >= 0.60 && intent.intent == 'Datatype_Watson') {
responseText = ' Watson Analytics is capable of processing Structured data only ';

} else if (intent.confidence >= 0.60 && intent.intent == 'Difference_Watson') {
responseText = ' Watson Analytics for IBM: IBM Use only, Unique Urls, Intranet ID, Enabled for IBM Confidential Data, Ability to have individual account and member of multiple team accounts. Watson Analytics: External Use Only, watsonanalytics.com, IBM ID, Not enabled for IBM Confidential Data, Single Account. Both: Shared Cloud Infrastructure';

} else if (intent.confidence >= 0.60 && intent.intent == 'Learn_Watson') {
responseText = ' Start with the Watson Analytics Community, which has blogs, tips, videos and a discussion forum to help you sharpen your skills and get the most out of Watson Analytics. You can also view videos on our YouTube channel. ';

} else if (intent.confidence >= 0.60 && intent.intent == 'Migrate_Watson') {
responseText = ' Its currently not possible to migrate content, you can continue to access both accounts but its recommended to recreate content under the Watson Analytics for IBM solution. ';

} else {
      responseText = 'I did not understand your intent';
    }
  }

response.output.text = responseText;
alert(response);


  return response;
}

module.exports = app;
