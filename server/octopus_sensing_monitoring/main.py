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

import os
import sys
import argparse

import cherrypy

from octopus_sensing_monitoring.handlers import *


def get_args():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument("-f", "--fake",
                            help="start a fake server that generates random data",
                            action="store_true")
    return arg_parser.parse_args()


def main():
    args = get_args()

    ui_build_path = os.path.join(os.path.dirname(
        os.path.abspath(sys.modules[__name__].__file__)), 'ui_build')

    cherrypy.tree.mount(RootHandler(), '/', config={
        '/': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': ui_build_path,
            'tools.staticdir.index': 'index.html',
        },
    })

    handler = ApiHandler()
    if args.fake:
        handler = FakeApiHandler()

    cherrypy.tree.mount(handler, '/api')

    cherrypy.server.socket_host = '0.0.0.0'
    cherrypy.engine.autoreload.on = False
    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == '__main__':
    main()
