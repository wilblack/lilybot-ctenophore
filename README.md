# lilybot-ctenophore - An angular based web client for Lilybot

This project is based on the angular-seed [AngularJS](https://github.com/angular/angular-seed) web app.


## Getting Started

To get you started you can simply clone the angular-seed repository and install the dependencies:

### Clone repo

Clone the angular-seed repository using [git][git]:

```
git clone https://github.com/wilblack/lilybot-ctenophore.git
cd lilybot-ctenophore
```

### Install Dependencies

```
npm install
```

### Run the Application
The applicatio is currently running on a Digital Ocean Droplet at ctenophore.solalla.com behing a nginx server.

## NGINX
Check for running process on a port.
```
sudo netstat -tulpn
```

To inertact with the nginx server 
```
sudo service nginx restart
```

The condfiuuration fileis located at `/etc/nginx/nginx.conf`
Here the relavant snippet 

```
server {
        listen 80;
        server_name ctenophore.solalla.com;
        location / {
                #proxy_pass http://localhost:8000/;
                root "/home/wilblack/projects/lilybot-ctenophore/app";
        }
}
```


Put `/node_modules/http-server/bin/` on your path or in your .bachrc file and then 
```
http-server
```

Now browse to the app at `http://localhost:8000/app/index.html`.

