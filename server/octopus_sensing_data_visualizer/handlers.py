import random
import json

import cherrypy


class RootHandler:
    pass


class ApiHandler:

    @cherrypy.expose
    def fetch(self):
        return json.dumps({"eeg": []})


class FakeApiHandler:

    @cherrypy.expose
    def fetch(self):
        # Three seconds of random data
        eeg_data = []
        for _ in range(3 * 128):
            eeg_data.append([round(random.uniform(
                0.01, 0.9), 5) for _ in range(16)])

        return json.dumps({"eeg": eeg_data})
