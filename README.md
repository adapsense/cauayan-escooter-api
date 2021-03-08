# Cauayan City eScooter API
Backend for Cauayan City eScooter web and mobile apps.

## Setup Requirements
1. Prepare your server instance (In-house or Cloud). Recommended is Linux with 8GB RAM and 512GB HDD for every 1,000 devices.

2. Intall Node.js from [here](https://nodejs.org/en/download/). Recommended LTS version. Choose the appropriate installer for your operating system.
<img src="./screenshots/01.png" width="400" height="300" >

3. Install MongoDB Community Edition from [here](https://docs.mongodb.com/manual/installation/). Choose the appropriate installer for your operating system.
<img src="./screenshots/02.png" width="400" height="300" >

4. Install MongoDB Compass from [here](https://www.mongodb.com/try/download/compass). Choose the appropriate installer for your operating system.
<img src="./screenshots/03.png" width="400" height="200" >

5. Open MongoDB Compass. To check if you have MongoDB correctly setup and running, enter the following connection string inside MongoDB Compass.
```mongodb://localhost:27017```
<img src="./screenshots/04.png" width="400" height="200" >

6. Create a database named `escooter` and a collection named `users`.
<img src="./screenshots/05.png" width="450" height="100" >
<img src="./screenshots/06.png" width="300" height="280" >

7. Storage instance (In-house or Cloud). Recommended Amazon S3 or DigitalOcean Spaces.

## Installation
1. Clone this repository.
```git clone https://github.com/adapsense/cauayan-escooter-api.git```

2. Enter the project folder.
```cd cauayan-escooter-api```

3. Duplicate [.sample-env](./sample-env) to and rename the copied file as `.env`.
```cp .sample-env .env```
<img src="./screenshots/07.png" width="400" height="250" >

4. Fill in variables based on your server setup.
```nano .env```

5. Install the dependencies.
```npm install```

6. Run the api.
```npm start```
