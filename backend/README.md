<h1>Bussiness game backend</h1>
<p>🌐 Backend system for bussiness game</p>

<h2>How to run locally</h2>

1. Download node from <a href="https://nodejs.org/en/download/">here</a>
2. Download git from <a href="https://git-scm.com/downloads">here</a>
3. Install yarn ```npm install --global yarn```
4. Get source code ```git clone https://github.com/spo7loc/spotloc-backend backend```
5. ```cd backend```
6. Install dependencies ```yarn install```
7. Create .env file ```touch .env```
8. Update .env file

```
PORT=
MONGODB_URL=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_SECRET=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
SENDGRID_API_KEY=
CLIENT_URL=
```

Also add:
```
ACTIVATION_TOKEN_SECRET=
RESET_PASSWORD_TOKEN_SECRET=
SENDER_EMAIL=
```

<p><code>PORT</code> can be a random 4 digit number, I'd suggest 5000</p>
<p>Create a mongodb project by following this <a href="https://www.youtube.com/watch?v=6utzRKiBZt0">tutorial</a> and update MONGODB_URL in .env file</p>
<p>You can create <code>REFRESH_TOKEN_SECRET</code> and <code>ACCESS_TOKEN_SECRET</code> by generating secure 50 character password <a href="https://passwordsgenerator.net/">here</a></p>
<p><code>CLOUD_NAME</code> & <code>CLOUD_API_KEY</code> & <code>CLOUD_API_SECRET</code> are accessible when You register to <a href="https://cloudinary.com/">cloudinary</a>

Get Your ```SENDGRID_API_KEY``` [here](https://sendgrid.com)

```CLIENT_URL``` paste Your website or local project URL
  
9. run project ```yarn dev```

Add notes how to update and deploy to aws eb
