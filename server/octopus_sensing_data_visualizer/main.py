import os
import sys
import argparse

import cherrypy

from handlers import *


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

    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == '__main__':
    main()
