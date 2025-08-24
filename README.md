# Octopus Sensing Monitoring

A web-based real-time monitoring for [Octopus Sensing](https://octopus-sensing.nastaran-saffar.me/). You can
monitor your data from any machine in the same network.

[Octopus Sensing monitoring](https://github.com/octopus-sensing/octopus-sensing-monitoring) is
a separated project and can be installed for Octopus Sensing if we need monitoring features.

**To see the full documentation go to [Otopus Sensing](https://octopus-sensing.nastaran-saffar.me/monitoring.html) website.**

![screenshot](https://raw.githubusercontent.com/octopus-sensing/octopus-sensing-monitoring/main/screenshot.png)
![mobile screenshot](https://raw.githubusercontent.com/octopus-sensing/octopus-sensing-monitoring/main/screenshot-mobile.png)

## Development

You need to have `python`, `poetry`, `cmake`, `cairo`, and `nodejs` installed.

cd `ui` and do a `npm install`.

Then `npm run build` for a debug build. It will copy the output to the `server`
directory.

Then cd `server` and run `poetry install`.

You can run the server with fake data using `poetry run python main.py --fake`.

## Copyright

Copyright © 2020-2025 [Aidin Gharibnavaz](https://aidinhut.com)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

See [License file](LICENSE) for full terms.
