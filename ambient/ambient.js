if ("AmbientLightSensor" in window) { // generic sensor API
    console.log("using AmbientLightSensor to retrieve lux values")
    try {
      var sensor = new AmbientLightSensor();
      sensor.addEventListener("reading", function (event) {
        update(sensor.illuminance);
      });
      sensor.start();
    } catch (e) {
      console.error(e);
    }
} else if ("ondevicelight" in window) { // legacy API
    console.log("using ondevicelight to retrieve lux values")
    function onUpdateDeviceLight(event) {
      update(event.value);
    }
    
    window.addEventListener("devicelight", onUpdateDeviceLight);
} else {
    console.log("Your browser is not ambient light ready! Use Firefox or Chrome with experimental Generic Sensor API Flag and try again.")
}

function update(lux) {
    document.getElementById("sensor-value").innerHTML = lux + " lux"
    console.log(lux)
}