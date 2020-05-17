mapboxgl.accessToken = 'pk.eyJ1IjoiYnJmcmFuem9uLTg3IiwiYSI6ImNrOXhqanI3NzAxc24zZnVzMTdjMW93NW4ifQ.iKLcdlSL3exwv6FZyBNJjQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 2,
    center: [0, 20]
});



let country_list = document.getElementById("country-list");
// api data 
let url = "https://www.trackcorona.live/api/countries"

fetch(url).
    then(res => { return res.json() }).
    then(data => {

        /** Populate the Options*/
        for (let j = 0; j < data.data.length; j++) {

            let opt = document.createElement("option");
            opt.value = j;
            opt.id = j;
            opt.style.borderRadius = "10px";
            opt.innerHTML = data.data[j].location;
            country_list.add(opt);
        }


        /** Event Selection option und show data*/
        country_list.addEventListener("change", changeCountry);

        function changeCountry() {
            console.log(data.data[country_list.value].location)

            map.fitBounds([
                [data.data[country_list.value].longitude + 10, data.data[country_list.value].latitude + 10],
                [data.data[country_list.value].longitude + 10, data.data[country_list.value].latitude - 10]
            ]);


            let country = document.getElementById("card-country");
            let cases = document.getElementById("cases");
            let deaths = document.getElementById("deaths");
            let percent = document.getElementById("percent");

            /** Country Information */
            country.innerHTML = data.data[country_list.value].location;
            /** Coronavirus Info */
            cases.innerHTML = data.data[country_list.value].confirmed;
            deaths.innerHTML = data.data[country_list.value].dead;
            percent.innerHTML = ((deaths.innerHTML / cases.innerHTML) * 100).toFixed(2);


            let div_cont = document.getElementById("data-container");
            div_cont.style.display = "block";

            /**for the chart*/
            let days = [];
            let confirmed = [];

            plot_covid();
            function plot_covid() {
                fetch(`https://api.covid19api.com/dayone/country/${data.data[country_list.value].location}/status/confirmed`).
                    then(res => { return res.json() }).
                    then(dataset => {

                        for (let j = 0; j < dataset.length; j++) {
                            days.push(dataset[j].Date.substr(0, 10))
                            confirmed.push(parseInt(dataset[j].Cases));
                        }
                        var ctx = document.getElementById('myChart');
                        my_chart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                datasets: [{
                                    label: `${data.data[country_list.value].location} `,
                                    data: confirmed,
                                    backgroundColor: ["lime"]

                                }],
                                labels: days
                            },
                            options: {


                                    title: {
                                        display: true,
                                        fontSize: 30,
                                        fontColor: "#ffffff",
                                        text: `Active Cases in ${data.data[country_list.value].location} `
                                    },
                                

                                scales: {
                                    xAxes: [{

                                        scaleLabel: {
                                            display: true,
                                        },
                                        ticks: {
                                            fontColor: "#fff",
                                            fontSize: 14
                                        }
                                    }],
                                    yAxes: [{
                                        scaleLabel: {
                                            display: true,
                                        },
                                        ticks: {
                                            fontColor: "#fff",
                                            fontSize: 14
                                        }
                                    }]
                                },
                                responsive: true,
                                maintainAspectRatio: false
                            }
                        });
                    });
            }
        }
        const totalData = data.data;
        totalData.forEach(element => {
            var el = document.createElement('div');
            el.className = 'marker';
            el.style.width = widthHeightBasedOnCases(element.dead);
            el.style.height = widthHeightBasedOnCases(element.dead);
            el.style.borderRadius = "50%";
            el.style.border = "2pt solid lime"
            el.style.backgroundColor = colorBasedOnCases(element.dead);
            el.style.opacity = "0.3";

            new mapboxgl.Marker(el).setLngLat([element.longitude, element.latitude]).addTo(map);
            //el.addEventListener("mouseover", showData);
            // el.addEventListener("mouseout", hideData);
            function showData() {
                let country = document.getElementById("card-country");
                let cases = document.getElementById("cases");
                let deaths = document.getElementById("deaths");
                let percent = document.getElementById("percent");

                /** Country Information */
                country.innerHTML = element.location;
                /** Coronavirus Info */
                cases.innerHTML = element.confirmed;
                deaths.innerHTML = element.dead;
                percent.innerHTML = ((deaths.innerHTML / cases.innerHTML) * 100).toFixed(2);

                let div_cont = document.getElementById("data-container");
                div_cont.style.display = "block";
            }

            function hideData() {
                let div_cont = document.getElementById("data-container");
                div_cont.style.display = "none";
            }
        });
    });

function colorBasedOnCases(count) {
    return "#fff";
}

function widthHeightBasedOnCases(count) {
    if (count >= 50000) {
        return "130px";
    }
    if (count >= 20000) {
        return "80px";
    }
    if (count >= 10000) {
        return "55px";
    }
    if (count >= 1000) {
        return "35px";
    }
    if (count >= 10) {
        return "20px";
    }
}


map.on('load', function () {
    map.setLayoutProperty('country-label', 'text-field', [
        'format',
        ['get'],
        { 'font-scale': 1 },
        '\n',
        {},
        ['get', 'name'],
        {
            'font-scale': 0.1,
            'text-font': [
                'literal',
                ['Arial Unicode MS Regular']
            ]
        }
    ]);
});






/**  borders
// https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json
*/