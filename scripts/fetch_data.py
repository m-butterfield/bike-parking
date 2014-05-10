"""
Using the data.sfgov.org api directly is very slow, so this script can be run periodically to
download the latest data and insert it into our own database.
"""
import requests
import codecs
import sys


def main():
    data = requests.get('https://data.sfgov.org/api/views/w969-5mn4/rows.json?accessType=DOWNLOAD')
    filtered_data = []
    for parking_space in data.json()['data']:
        if parking_space[28] == 'COMPLETE' and parking_space[29] == 'INSTALLED':
            filtered_data.append({
                'id': parking_space[0],
                'name': '"%s"' % parking_space[8].replace('"', ''),
                'lat': parking_space[20][1],
                'lng': parking_space[20][2],
            })
    with codecs.open('parking_spots.csv', 'wb', encoding='utf-8') as parking_file:
        parking_file.write('id, name, lat, lng\n')
        for parking_space in filtered_data:
            row = u"%s, %s, %s, %s\n" % (parking_space['id'],
                                         parking_space['name'],
                                         parking_space['lat'],
                                         parking_space['lng'])
            parking_file.write(row)

if __name__ == '__main__':
    sys.exit(main())
