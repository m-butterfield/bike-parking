from bike_parking import app
from flask import render_template, request, jsonify
from models import ParkingSpot

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/nearby_parking')
def nearby_parking():
    """
    Returns the parking spots found within the given bounding box
    """
    northeast_lat = request.args.get('northeastLat', 0, type=float)
    northeast_lng = request.args.get('northeastLng', 0, type=float)
    southwest_lat = request.args.get('southwestLat', 0, type=float)
    southwest_lng = request.args.get('southwestLng', 0, type=float)
    spots = ParkingSpot.query.\
        filter(ParkingSpot.lat < northeast_lat).\
        filter(ParkingSpot.lng < northeast_lng).\
        filter(ParkingSpot.lat > southwest_lat).\
        filter(ParkingSpot.lng > southwest_lng)
    spots_list = []
    for spot in spots.all():
        spots_list.append({
            'id': spot.id,
            'name': spot.name,
            'lat': spot.lat,
            'lng': spot.lng,
        })

    return jsonify({'spots': spots_list})
