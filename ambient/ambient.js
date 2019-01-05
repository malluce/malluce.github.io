// sensor object is stored here if it is used
var sensor = undefined

// by default debug is visible
var debug = true;

// default style is light
var currentStyle = "light";

/**
 * Event listener for generic sensor API.
 * @param {*} event 
 */
function genericSensorAPIUpdate(event) {
    update(sensor.illuminance)
}

/**
 * Event listener for legacy sensor API.
 * @param {*} event 
 */
function legacyAPIUpdate(event) {
    update(event.value)
}

function update(lux) {
    setLux(lux)
    console.log(lux)
    if(lux > threshold) {
        light()
    } else {
        dark()
    }
}

/**
 * 
 * @param {*} threshold 
 */
function start(threshold) {
    if ("AmbientLightSensor" in window) { // generic sensor API (Chrome etc.)
        console.log("using AmbientLightSensor to retrieve lux values")
        try {
          sensor = new AmbientLightSensor();
          sensor.addEventListener("reading", genericSensorAPIUpdate)
          sensor.start();
        } catch (e) {
          console.error(e);
        }
    } else if ("ondevicelight" in window) { // legacy API (Firefox)
        console.log("using ondevicelight to retrieve lux values")
        window.addEventListener("devicelight", legacyAPIUpdate);
    } else {
        alert("Your browser is not ambient light ready! Use Firefox, Edge, or Chrome with experimental Generic Sensor API Flag and try again.")
    }
}

function stop() {
    if ("AmbientLightSensor" in window) { // generic sensor API (Chrome etc.)
        console.log("removing event listener from AmbientLightSensor")
        try {
          sensor.removeEventListener("reading", genericSensorAPIUpdate)
        } catch (e) {
          console.error(e);
        }
    } else if ("ondevicelight" in window) { // legacy API (Firefox)
        console.log("removing event listener for devicelight")
        window.removeEventListener("devicelight", legacyAPIUpdate);
    } 

    setUnknown()
}

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

function light() {
    // adapt debug text
    setLuxClass("light")
    
    // change style
    if (currentStyle != "light") {
        setAmbientAwareStyle("light.css")
    }

    currentStyle = "light"
}

function dark() {
    // adapt debug text
    setLuxClass("dark")

    // change style
    if (currentStyle != "dark") {
        setAmbientAwareStyle("dark.css")
    }

    currentStyle = "dark"
}

function setUnknown() {
    document.getElementById("sensor-value").innerHTML = "unknown"
    setLuxClass("unknown")
}

function setLux(lux) {
    document.getElementById("sensor-value").innerHTML = lux + " lux"
}

function setLuxClass(className) {
    document.getElementById("value-class").innerHTML = className
}

function setAmbientAwareStyle(styleSheetHref) {
    document.getElementById("ambient-aware-style").setAttribute("href", styleSheetHref)
}
