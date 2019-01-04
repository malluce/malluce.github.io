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

// by default debug is visible
var debug = true;

/**
 * Toggles the visibility of debug elements, i.e. elements with class="debug".
 */
function toggleDebug() {
    debug = !debug

    var debugElems = document.getElementsByClassName("debug")

    // ->""<- is on purpose. displays it like rendered by default.
    var newDisplay = debug ? "" : "none"

    for(var i = 0; i < debugElems.length; i++) {
        debugElems[i].style.display = newDisplay
    }
}

// default style is light
var currentStyle = "light";

function light() {
    // adapt debug text
    document.getElementById("value-class").innerHTML = "light"
    
    // change style
    if (currentStyle != "light") {
        document.getElementById("ambient-aware-style").setAttribute("href", "light.css")
    }

    currentStyle = "light"
}

function dark() {
    // adapt debug text
    document.getElementById("value-class").innerHTML = "dark"

    // change style
    if (currentStyle != "dark") {
        document.getElementById("ambient-aware-style").setAttribute("href", "dark.css")
    }

    currentStyle = "dark"
}