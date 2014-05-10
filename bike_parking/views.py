from bike_parking import app
from flask import render_template
from models import ParkingSpot

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/nearby_parking')
def nearby_parking():
    pass
