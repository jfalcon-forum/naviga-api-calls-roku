# zype-api-calls

* index-navSub.js contains the current solution. Makes a call to Naviga Subscriptions endpoint and determines user livestream subscription. Auth0 ID Flow.

  - Remove `exports handler` code. Call `navigaCall` to simulate a call within aws. Append `.then(console.log)` to log results

* index.js contains flow for check against naviga livestream endpoint. Doesn't provide us all the information needed. Auth0 ID Flow.

  - Remove `exports handler` code. Call `navigaCall` to simulate a call within aws. Append `.then(console.log)` to log results

* index-auth0.js, two functions that first make a call to Auth0 then to naviga. Username/Password flow.

  - oauthEndpoint - Uses email and password; returns Auth0 & Naviga responses. Need to use the access_token for next call
  - authorizeEndpoint - Uses token; returns Naviga response

Both calls should log out the responses

To initalize local environment

`npm install`

`node index.js`

You also will need to create a .env file that contains the NAVIGA_TOKEN, ZYPE_AUTH_CLIENT_ID, and ZYPE_AUTH_SECRET_ID values
