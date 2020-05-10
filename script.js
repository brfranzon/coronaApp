mapboxgl.accessToken = 'pk.eyJ1IjoiYnJmcmFuem9uLTg3IiwiYSI6ImNrOXhqanI3NzAxc24zZnVzMTdjMW93NW4ifQ.iKLcdlSL3exwv6FZyBNJjQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 2.2,
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

            map.fitBounds([
                [data.data[country_list.value].longitude + 5, data.data[country_list.value].latitude + 5],
                [data.data[country_list.value].longitude - 5, data.data[country_list.value].latitude - 5]
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
        }


        const totalData = data.data;
        totalData.forEach(element => {

            var el = document.createElement('div');
            el.className = 'marker';
            el.style.width = widthHeightBasedOnCases(element.dead);
            el.style.height = widthHeightBasedOnCases(element.dead);
            el.style.borderRadius = "50%";
            el.style.backgroundColor = colorBasedOnCases(element.dead);
            el.style.opacity = "0.5"


            new mapboxgl.Marker(el).setLngLat([element.longitude, element.latitude]).addTo(map);

            el.addEventListener("mouseover", showData);
            el.addEventListener("mouseout", hideData);

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
    return "rgba(44, 251, 52, 0.8)";
}


function widthHeightBasedOnCases(count) {
    if (count >= 50000) {
        return "110px";
    }
    if (count >= 20000) {
        return "60px";
    }
    if (count >= 10000) {
        return "45px";
    }
    if (count >= 1000) {
        return "25px";
    }
    if (count >= 10) {
        return "10px";
    }
}




map.on('load', function () {
    map.setLayoutProperty('country-label', 'text-field', [
        'format',
        ['get', 'name_en'],
        { 'font-scale': 2 },
        '\n',
        {},
        ['get', 'name'],
        {
            'font-scale': 0.8,
            'text-font': [
                'literal',
                ['DIN Offc Pro Italic', 'Arial Unicode MS Regular']
            ]
        }
    ]);
});











