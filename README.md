# FeedbackManagerServer

This is a web application to enable you to fill out a feedback form and then have it rendered on the screen. This is backend handles api calls and interacting with a MongoDB database mainly. Serving files and frontend routing is handled by Vite.

This is meant to be a chance to put Typescript concepts and processes into action and practice on a real project. This server handles all the login and authentication as well as the management of the feedback entered by users.

# Setting up the Environment

Look to your .env.example file to see what needs setting up here. Firstly you will want to rename this to just .env so the code can interact with it.

You'll need to configure it with your MongoDB URI code, allowing the app to login to your user account for your chosen MongoDB cluster. Set up your cluster and create a user for it under Database Access. Here you can enter the username, password for that user, cluster url and cluster name. Also fill out the fields for the name of your chosen DB inside your cluster as well as the two names we designate for the 'feedback' and 'users' collections (I recommend leaving these as is).

Also set your jwt secret key here. This can be whatever you want as its used to sign the login tokens.

# Running the Project

'npm run dev' is mapped to 'ts-node server.js' so this server can be spun up using that command. Doing this with the correct config ought to open the ports for requests and initiate the connection to the MongoDB cluster.
