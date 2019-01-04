/**
 * 
 * @param {*} threshold 
 */
function start(threshold) {
    function update(lux) {
        document.getElementById("sensor-value").innerHTML = lux + " lux"
        console.log(lux)
        if(lux > threshold) {
            light()
        } else {
            dark()
        }
    }

    if ("AmbientLightSensor" in window) { // generic sensor API (Chrome etc.)
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
    } else if ("ondevicelight" in window) { // legacy API (Firefox)
        console.log("using ondevicelight to retrieve lux values")
        function onUpdateDeviceLight(event) {
          update(event.value);
        }
        
        window.addEventListener("devicelight", onUpdateDeviceLight);
    } else {
        alert("Your browser is not ambient light ready! Use Firefox, Edge, or Chrome with experimental Generic Sensor API Flag and try again.")
    }
}

var debug = true;

function toggleDebug() {
    debug = !debug

    var debugElem = document.getElementById("debug-text")

    if(debug) {
        debugElem.style.visibility = "visible"
    } else {
        debugElem.style.visibility = "hidden"
    }
}

function light() {
    document.getElementById("value-class").innerHTML = "light"
}

function dark() {
    document.getElementById("value-class").innerHTML = "dark"
}