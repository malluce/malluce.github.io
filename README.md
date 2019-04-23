# malluce.github.io
final project for "Mobile Computing und Internet der Dinge"

An Ambient-Light-aware Website. Changes its appearence (i.e., CSS and HTML meta tags) based on the Ambient-Light sensor. If the median of the sensor value (for a sliding window of ten sensor values) drops below 100 lux, the website uses a dark theme, otherwise a light theme is used.
Requires to enable experimental flags in Firefox and Google Chrome to work:
For Firefox, set
```
device.sensors.ambientLight.enabled
```
For Google Chrome, set

```
enable-generic-sensor-extra-classes
```
