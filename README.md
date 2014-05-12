Bike Parking
======
A webapp that shows directions to nearby bike parking in San Francisco.

See it in action here: [bikeparking.mattbutterfield.com](http://bikeparking.mattbutterfield.com)

**Setup**
-
Clone the repository:

    $ git clone git@github.com:m-butterfield/bike-parking.git && cd bike-parking

Install Python dependencies (I recommend using [virtualenv](https://github.com/pypa/virtualenv)):

    $ pip install -r requirements.txt

Gather external static resources using [bower](http://bower.io/):

    $ bower install

Fetch data and create the sqlite database:

    $ python create_database.py

Start the application:

    $ python runserver.py

Then point a browser to: [http://localhost:5000](http://localhost:5000) And you are ready to go!

**Deployment**
-
In config.py, set DEBUG = False  
Then, build the javascript using [r.js](http://requirejs.org/docs/optimization.html):

    $ cd bike_parking/static/js
    $ node ../../../bower_components/r.js/dist/r.js -o build.js 
