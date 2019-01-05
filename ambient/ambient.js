// sensor object is stored here if it is used
var sensor = undefined

// by default debug is visible
var debug = true;

// default style is light
var currentStyle = "light";

// stores the current threshold (for values > threshold, light theme is used; otherwise dark)
var currentThreshold = undefined

var slidingWindow = []
var slidingWindowLength = undefined

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
    // append new value to sliding window
    slidingWindow.push(lux)

    if (slidingWindow.length < slidingWindowLength) { // sliding window not filled yet
        setLux("waiting...")
        return
    } else if (slidingWindow.length > slidingWindowLength) { // sliding windows was full before pushing
        slidingWindow.shift() // hence remove first value
        if(slidingWindow.length != slidingWindowLength) { // check size
            console.error("unexpected window size: " + slidingWindow.length)
        }
    }

    // compute median on current sliding window
    var median = slidingWindow.sort()[slidingWindow.length / 2]

    console.log(slidingWindow.sort())
    console.log(median)

    // set debug text
    setLux(median)

    // adapt css based on median
    if (median > currentThreshold) {
        light()
    } else {
        dark()
    }
}


function start(threshold, slidingWindowLen) {
    currentThreshold = threshold
    slidingWindowLength = slidingWindowLen
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

/**
 * Removes event listeners from sensor, resets debug texts and resets sliding window.
 */
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
    slidingWindow = []
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
