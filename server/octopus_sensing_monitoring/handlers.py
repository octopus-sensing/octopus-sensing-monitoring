# This file is part of Octopus Sensing Monitoring <https://octopus-sensing.nastaran-saffar.me/>
# Copyright © 2020, 2021 Aidin Gharibnavaz <aidin@aidinhut.com>
#
# Octopus Sensing Monitoring is free software: you can redistribute it and/or modify it under the
# terms of the GNU General Public License as published by the Free Software Foundation, either
# version 3 of the License, or (at your option) any later version.
#
# Octopus Sensing Monitoring is distributed in the hope that it will be useful, but WITHOUT ANY
# WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
# PURPOSE. See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along with Octopus Sensing
# Monitoring. If not, see <https://www.gnu.org/licenses/>.

import io
import random
import json
import pickle
import base64
import urllib.request
# The data received from the server might be in numpy format.
# We need to import 'numpy' to unpickle it.
import numpy
import PIL.Image
import cherrypy


class RootHandler:
    pass


def encode_image_to_base64(image_array):
    image_buffer = io.BytesIO()
    PIL.Image.fromarray(image_array) \
        .save(image_buffer, format="png")
    return str(base64.b64encode(image_buffer.getvalue()), "ascii")


class ApiHandler:

    @cherrypy.expose
    def fetch(self):
        request = urllib.request.Request(
            "http://127.0.0.1:9330", headers={"Accept": "application/pickle"}, method='GET')
        with urllib.request.urlopen(request) as response:
            if response.getcode() != 200:
                raise RuntimeError(
                    f"Could not get data from Octopus Sensing {response.status} - {response.reason}")
            serialized_data = response.read()

        raw_data = pickle.loads(serialized_data)
        data = {}

        if "eeg" in raw_data:
            data["eeg"] = self._restructure_eeg(raw_data["eeg"])

        if "shimmer" in raw_data:
            gsr_records, ppg_records, = self._restructure_shimmer(
                raw_data["shimmer"])
            data["gsr"] = gsr_records
            data["ppg"] = ppg_records

        if "webcam" in raw_data:
            data["webcam"] = encode_image_to_base64(raw_data["webcam"])

        return json.dumps(data)

    def _restructure_eeg(self, data):
        channels = 8
        if len(data[0]) >= 16:
            channels = 16

        result = []

        for _ in range(channels):
            result.append([])

        for record in data:
            for i, channel_data in enumerate(record[:channels]):
                result[i].append(channel_data)

        return result

    def _restructure_shimmer(self, data):
        gsr_records = []
        ppg_records = []

        for record in data:
            gsr_records.append(record[5])
            ppg_records.append(record[6])

        return (gsr_records, ppg_records)


class FakeApiHandler:

    @cherrypy.expose
    def fetch(self):
        # Three seconds of random data
        eeg_data = []
        for _ in range(16):
            eeg_data.append(self._three_seconds_random_data())

        random_frame_data = numpy.random.randint(
            low=1, high=255, size=(640, 480, 3), dtype=numpy.uint8)
        random_frame = encode_image_to_base64(random_frame_data)

        return json.dumps({"eeg": eeg_data,
                           "gsr": self._three_seconds_random_data(),
                           "ppg": self._three_seconds_random_data(),
                           "webcam": random_frame})

    def _three_seconds_random_data(self):
        return [round(random.uniform(0.01, 0.9), 5) for _ in range(3 * 128)]
