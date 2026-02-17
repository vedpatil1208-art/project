function loadWeather() {

    const selectedCity = document.getElementById("citySelect").value;

    if (selectedCity === "") {
        alert("Please select a city");
        return;
    }

    fetch("project.json")
        .then(response => response.json())
        .then(data => {

            const cities = data.cities;

            const cityData = cities.find(city => city.name === selectedCity);

            if (cityData) {

                document.getElementById("cityName").innerText = cityData.name;
                document.getElementById("temp").innerText = "Temperature: " + cityData.temperature + " °C";
                document.getElementById("humidity").innerText = "Humidity: " + cityData.humidity + " %";
                document.getElementById("wind").innerText = "Wind Speed: " + cityData.wind + " m/s";
                document.getElementById("desc").innerText = "Weather: " + cityData.description;

                // Climate Type Logic
                let climateType = "";

                if (cityData.temperature >= 35) {
                    climateType = "Very Hot Climate";
                } 
                else if (cityData.temperature >= 25) {
                    climateType = "Warm Climate";
                } 
                else if (cityData.temperature >= 15) {
                    climateType = "Moderate Climate";
                } 
                else {
                    climateType = "Cold Climate";
                }

                document.getElementById("climate").innerText = "Climate Type: " + climateType;

                document.getElementById("result").classList.remove("hidden");

            } else {
                alert("City data not found!");
            }

        })
        .catch(error => {
            alert("Error loading JSON file");
        });
}