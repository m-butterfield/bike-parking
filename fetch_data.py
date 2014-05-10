"""
Using the data.sfgov.org api directly is very slow, so this script can be run periodically to
download the latest data and insert it into our own sqlite database.
"""
import requests
import sys
from bike_parking import db, models


def main():
    data = requests.get('https://data.sfgov.org/api/views/w969-5mn4/rows.json?accessType=DOWNLOAD')
    for parking_space in data.json()['data']:
        if parking_space[28] == 'COMPLETE' and parking_space[29] == 'INSTALLED':
            new_parking_space = models.ParkingSpot(
                id=parking_space[0],
                name=parking_space[8],
                lat=parking_space[20][1],
                lng=parking_space[20][2],
            )
            db.session.add(new_parking_space)
    db.session.commit()

if __name__ == '__main__':
    db.create_all()
    db.engine.execute('delete from parking_spot')
    sys.exit(main())
