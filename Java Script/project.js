function loadWeather() {

    const selectedOption = document.getElementById("citySelect").value;

    if (selectedOption === "") {
        alert("Please select a city");
        return;
    }

    fetch("project.json")
        .then(response => response.json())
        .then(data => {

            const citiesArray = data.cities;

            const matchedCity = citiesArray.find(city => city.name === selectedOption);

            if (matchedCity) {

                document.getElementById("cityName").innerText = matchedCity.name;
                document.getElementById("temp").innerText = "Temperature: " + matchedCity.temperature + " °C";
                document.getElementById("humidity").innerText = "Humidity: " + matchedCity.humidity + " %";
                document.getElementById("wind").innerText = "Wind Speed: " + matchedCity.wind + " m/s";
                document.getElementById("desc").innerText = "Weather: " + matchedCity.description;

                let climateLabel = "";

                if (matchedCity.temperature >= 35) {
                    climateLabel = "Very Hot Climate";
                } 
                else if (matchedCity.temperature >= 25) {
                    climateLabel = "Warm Climate";
                } 
                else if (matchedCity.temperature >= 15) {
                    climateLabel = "Moderate Climate";
                } 
                else {
                    climateLabel = "Cold Climate";
                }

                document.getElementById("climate").innerText = "Climate Type: " + climateLabel;

                document.getElementById("result").classList.remove("hidden");

            } else {
                alert("City data not found!");
            }

        })
        .catch(error => {
            alert("Error loading JSON file");
        });
}
