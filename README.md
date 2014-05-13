Bike Parking
======
A webapp that shows directions to nearby bike parking in San Francisco.

See it in action here: [bikeparking.mattbutterfield.com](http://bikeparking.mattbutterfield.com)

Because I like to keep things as simple as possible, I chose to use [Flask](http://flask.pocoo.org/) + a bit of
[SQLAlchemy](http://www.sqlalchemy.org/) on the backend, and [Backbone](http://backbonejs.org/) on the frontend.  I'm
displaying the map data using the
[Google Maps JavaScript API v3](https://developers.google.com/maps/documentation/javascript/)

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

**Future Improvements**
-

The following are some features I would like to add to this project:

* Tests!  Tests are very important.  Writing some automated tests is priority #1.
* Better backend API: It should be pretty easy to use something like Flask-Restful to make a better api for getting the
parking spot data from the server.  This + better model/collection Backbone code would make fetching the data simpler.
* Better comments/documentation: I added some comments where it's potentially confusing as to what is going on, but I
could do better here.
* Too many markers!  When zoomed way out on the map I'm showing too many markers, making it hard to see the route and
hurting performance.  See [this](https://developers.google.com/maps/articles/toomanymarkers) for some better solutions.
