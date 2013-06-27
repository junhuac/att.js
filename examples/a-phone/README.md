# Angularjs-Phone (or A-Phone for Short)

This example app uses module passport-att-alpha to handle oauth with AT&T alpha API program at apimatrix.tfoundry.com.
It then uses the WebRTC API's to enable WebRTC calling from a browser.
The WebRTC browser implementations are still evolving, so for now you have to start by downloading a version of the Chromium browser, from here  
For all required configuration and downloads and simple instructions please go here - https://js.att.io  You will need to register.

## Pre-requisites

a working node.js environment  
The special chromium browser downloaded and installed  
An active account on http://apimatrix.tfoundry.com (the same account as used by http://js.att.io) and a newly created app  

## How to Create an App on http://apimatrix.tfoundry.com

To create an app login to apimatrix.  
(If you do not already have an apimatrix account please register)    
Click My Apps,  
Click Register a New App.  
Complete name, description (mandatory).  
For the callback url use "http://localhost:5000/users/auth/att/callback"  
Click Register App

## Installation

Download the att.js git repository.  
git clone git@github.com:att-innovate/attjs.git
cd into att.js/examples/a-phone and run npm install  
You will need to define an app in apimatrix.tfoundry.com  
Edit the file .env.sh.txt, adding your newly created client id and client secret from your app in apimatrix  
Update your callback url (http://localhost:5000/users/auth/att/callback) and then rename the file to .env.sh  
Source the file to set the environment variables - source .env.sh  

Start the app - node app.js

Open the newly download chromium browser from https://js.att.io with the correct flags set 

and go to http://localhost:5000  

You now can place outgoing calls to PSTN and receive incoming calls on the assigned number.

## Examples

A working version of the app is available at: http://attjs-a-phone.herokuapp.com  Remember to use the just downloaded chromium browser

## Credits

  - [Geoff Hollingworth](http://github.com/eusholli)

## License

(The MIT License)

Copyright (c) 2012 Geoff Hollingworth

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
