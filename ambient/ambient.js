if ("AmbientLightSensor" in window) { // generic sensor API
    try {
      var sensor = new AmbientLightSensor();
      sensor.addEventListener("reading", function (event) {
        update(sensor.illuminance);
      });
      sensor.start();
    } catch (e) {
      console.error(e);
    }
} else if ("ondevicelight" in window) {
    function onUpdateDeviceLight(event) {
      update(event.value);
    }
    
    window.addEventListener("devicelight", onUpdateDeviceLight);
}

function update(lux) {
    console.log(lux)
}