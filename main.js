var CityInput;
var SendButton;
var WeatherDiv;
var InputForm;

var WeatherIcon;
var TemperatureSpan;
var WeatherSpan;
var CitySpan;

Math.roundDecimal = function(number, precision) {
    let num = number * Math.pow(10, precision);
    num = Math.round(num);
    num /= Math.pow(10, precision);
    return num;
}

document.addEventListener("DOMContentLoaded", function() {
    CityInput = document.getElementById("city-input");
    SendButton = document.getElementById("send-btn");
    WeatherDiv = document.getElementById("weather-container");
    InputForm = document.getElementById("input-form");

    WeatherIcon = document.getElementById("weather-icon");
    TemperatureSpan = document.getElementById("temperature-span");
    WeatherSpan = document.getElementById("weather-span");
    CitySpan = document.getElementById("city-span");

    InputForm.addEventListener("submit", sendRequest, false);
});

var MakeRequestUrl = function(city) {
    return "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=27ae627f7afa27114a1554c72b30000e";
}

var MakeImageUrl = function(icon) {
    return "http://openweathermap.org/img/wn/" + icon + "@2x.png";
}


function createCORSRequest(method, url) {
    let XHR = new XMLHttpRequest();
    if ("withCredentials" in XHR) {
      XHR.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      XHR = new XDomainRequest();
      XHR.open(method, url);
    } else {
      XHR = null;
    }
    return XHR;
}


window.updateButton = function() {
    let InputStr = CityInput.value;
    if (InputStr.length > 0) {
        SendButton.disabled = false;
    } else {
        SendButton.disabled = true;
    }
}

window.clearInput = function() {
    WeatherDiv.style.display = "none";
    CityInput.value = "";
    SendButton.disabled = true;
}

function sendRequest(e) {
    let city = CityInput.value;
    let RequestUrl = MakeRequestUrl(city);

    let XHR = createCORSRequest('POST', RequestUrl);

    if (!XHR) alert("XHR is not supported.");

    XHR.send();
    XHR.onreadystatechange = function() {
        if (XHR.readyState === 4 && XHR.status === 200) {
            let ResponseObject = JSON.parse(XHR.responseText);
            
            let temp = Math.roundDecimal(ResponseObject.main.temp - 273.15, 2);
            let weather = ResponseObject.weather[0].main;
            let icon = ResponseObject.weather[0].icon;
            let city = ResponseObject.name;

            WeatherIcon.src = MakeImageUrl(icon);
            TemperatureSpan.innerHTML = temp;
            WeatherSpan.innerHTML = weather;
            CitySpan.innerHTML = city;

            WeatherDiv.style.display = "block";
        }
    }

    e.preventDefault();
}


