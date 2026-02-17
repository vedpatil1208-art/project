function loadWeather() {

    const chosenCity = document.getElementById("citySelect").value;

    if (chosenCity === "") {
        alert("Please select a city");
        return;
    }

    fetch("project.json")
        .then(res => res.json())
        .then(jsonData => {

            const cityList = jsonData.cities;

            const selectedCityData = cityList.find(item => item.name === chosenCity);

            if (selectedCityData) {

                document.getElementById("cityName").innerText = selectedCityData.name;
                document.getElementById("temp").innerText = "Temperature: " + selectedCityData.temperature + " °C";
                document.getElementById("humidity").innerText = "Humidity: " + selectedCityData.humidity + " %";
                document.getElementById("wind").innerText = "Wind Speed: " + selectedCityData.wind + " m/s";
                document.getElementById("desc").innerText = "Weather: " + selectedCityData.description;

                // Climate Type Logic
                let weatherCategory = "";

                if (selectedCityData.temperature >= 35) {
                    weatherCategory = "Very Hot Climate";
                } 
                else if (selectedCityData.temperature >= 25) {
                    weatherCategory = "Warm Climate";
                } 
                else if (selectedCityData.temperature >= 15) {
                    weatherCategory = "Moderate Climate";
                } 
                else {
                    weatherCategory = "Cold Climate";
                }

                document.getElementById("climate").innerText = "Climate Type: " + weatherCategory;

                document.getElementById("result").classList.remove("hidden");

            } else {
                alert("City data not found!");
            }

        })
        .catch(err => {
            alert("Error loading JSON file");
        });
}
