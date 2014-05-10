"""
Using the data.sfgov.org api directly is slow and limited, so this script can be run periodically to
download the latest data and insert it into our own sqlite database.  It only takes a few seconds to run.
"""
import requests
import sys
from bike_parking import db
from bike_parking.models import ParkingSpot


def main():
    print "Creating Database..."
    db.create_all()

    # if the database was already created, delete all the old data
    db.engine.execute('delete from parking_spot')

    print "Fetching Data..."
    data = requests.get('https://data.sfgov.org/api/views/w969-5mn4/rows.json?accessType=DOWNLOAD')

    print "Inserting data into database..."
    for parking_space in data.json()['data']:
        # I'm only going to display usable parking spots, so only add the good ones!
        if parking_space[28] == 'COMPLETE' and parking_space[29] == 'INSTALLED':
            new_parking_space = ParkingSpot(
                id=parking_space[0],
                name=parking_space[8],
                lat=parking_space[20][1],
                lng=parking_space[20][2],
            )
            db.session.add(new_parking_space)
    db.session.commit()
    print "Done!"

if __name__ == '__main__':
    sys.exit(main())
