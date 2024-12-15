# Business Games

Node.js version used: 16.4;  
Yarn version used 1.22.19

## Testing
Install Selenium Grid from https://www.selenium.dev/downloads/    
And place the downloaded jar file in the root directory of the project

Install ChromeDriver from https://chromedriver.chromium.org/downloads

Install Java from https://www.oracle.com/java/technologies/downloads/#java21
And reload computer to make sure that the ```Path``` is set correctly
Install latest Python

Initialize the hub (you can access it by going to http://localhost:4444/ui#):
```bash
java -jar selenium-server-4.15.0.jar hub
````

Initialize nodes ( if not specifying ```--port```, default is 5555) as many as you need for testing by running the following command in different terminals with different port numbers:
```bash
java -jar selenium-server-4.15.0.jar node --port 6666
```

Specify number of simulated players in ```try.py```. Should be less than the number of nodes you have.

Run the tests:
```bash
python bankrupt.py
```
Bankrupt.py is the test for the bankrupt game. You can also run the other tests by changing the name of the file in the command above.


Metrics
Backend:
PieChart: sum(http_request_count{instance="host.docker.internal:5000", route!="/"}) by (route)
