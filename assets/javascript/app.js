$(document).ready(function () {

    $('#schoolInfo').append(`
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">School Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Grade Range</th>
                        <th scope="col">Parent Ratings</th>
                        <th scope="col">GreatSchools Ratings</th>
                        <th scope="col">Website</th>
                    </tr>
                </thead>
                <tbody id="schoolTable">
                </tbody>
            </table>
    `);


    $('#submit').on('click', function (e) {

        e.preventDefault();
        $("#data").empty();
        var occupation = $('#occupation').val();
        var cityStateCountry = $('#autocomplete').val().trim();
        var medianPerCapUS = '$29,829';
        var myArr = cityStateCountry.split(',');
        var city = myArr[0].trim();
        var state = myArr[1].trim();
        var cityState = myArr[0] + ',' + myArr[1];
        console.log(cityState);

        //Return the City and State

        $('.occupation').text(occupation);
        $('#location').text(cityState);
        // $('#city').val();
        var occCode;

        var queryUrl = `https://api.careeronestop.org/v1/occupation/NzX2rM28B8dZLR3/${occupation}/y/0/10`;


        $.ajax({
            url: queryUrl,
            dataType: 'json',
            type: 'GET',
            beforeSend: function (xhr) {

                xhr.setRequestHeader('Authorization', 'Bearer ' + 'KZasPLkGaB4qx+wuKxVDBoBHMO3iu+sTcYuhf9Et/1ueVH3efsEr3OEpWUXl24ukjrYWm8GTLn94+RbOE/FKKg==')
            },
            success: function (response) {
                var occTitle = response.OccupationList[0].OnetTitle;
                occCode = response.OccupationList[0].OnetCode;
                console.log(response.OccupationList)
                console.log(occTitle);
                console.log(occCode);
            },
            error: function (request, status, errorThrown) {
                console.log('This is where the error will be output to the user.');
            }
        }).then(function () {

            $.ajax({
                url: `https://api.careeronestop.org/v1/occupation/NzX2rM28B8dZLR3/${occCode}/${cityState}?training=false&interest=false&videos=false&tasks=false&dwas=false&wages=true&alternateOnetTitles=false&projectedEmployment=true&ooh=false&stateLMILinks=false&relatedOnetTitles=false&skills=false&knowledge=false&ability=false&trainingPrograms=false`,
                dataType: 'json',
                type: 'GET',
                beforeSend: function (xhr) {

                    xhr.setRequestHeader('Authorization', 'Bearer ' + 'KZasPLkGaB4qx+wuKxVDBoBHMO3iu+sTcYuhf9Et/1ueVH3efsEr3OEpWUXl24ukjrYWm8GTLn94+RbOE/FKKg==');
                },
                success: function (response) {
                    console.log(response);
                    var myRoot = response.OccupationDetail[0];
                    var title = myRoot.OnetTitle;
                    console.log(title);
                    var localWages = myRoot.Wages.BLSAreaWagesList;
                    var natWages = myRoot.Wages.NationalWagesList;
                    console.log(myRoot);
                    var stateStats = myRoot.Projections.Projections[0];
                    var nationalStats = myRoot.Projections.Projections[1];
                    var crntStateEmp = stateStats.EstimatedEmployment;
                    var projectedAnnualOpeningsSt = stateStats.ProjectedAnnualJobOpening;
                    var projectedAnnualOpeningsUS = nationalStats.ProjectedAnnualJobOpening;
                    var stateName = stateStats.StateName;
                    for (var i = 0; i < localWages.length; i++) {
                        if (localWages[i].RateType === 'Annual') {
                            console.log('City median income: ' + localWages[i].Median);
                            $('#medianCityWages').text(formatDollar(parseInt(localWages[i].Median)));
                        }
                    }
                    for (var i = 0; i < natWages.length; i++) {
                        if (natWages[i].RateType === 'Annual') {
                            console.log('National median income: ' + natWages[i].Median);
                            $('#USwages').text(formatDollar(parseInt(natWages[i].Median)));
                        }
                    }
                    console.log('US Median Per Capita Income: $29,829');
                    console.log(myRoot);
                    console.log(`Estimated current number of '${title}' jobs in ${stateName}: ${crntStateEmp}`); // Output to page

                    console.log(`Projected annual openings for '${title}' jobs in ${stateName}: ${projectedAnnualOpeningsSt}`);
                    console.log(`Estimated number of '${title}' jobs in the U.S.: ${projectedAnnualOpeningsUS}`)
                },
                error: function (request, status, errorThrown) {
                    console.log('This is where my error will go to be ouput to the user.');
                }
            });
        });
        console.log(cityState);
        // Numbeo goes here
        var numbeoUrl = `http://anyorigin.com/go?url=https%3A//www.numbeo.com/api/indices%3Fapi_key%3D2iev2m2k4slcbo%26query%3D${cityState}&callback=?`;

        $.getJSON(numbeoUrl, function (data) {
            var myData = data.contents;
            var statsName = myData.name;
            var costOfLiving = Math.round(myData.cpi_index);
            var housingToIncomeRatio = myData.property_price_to_income_ratio.toFixed(2);
            var trafficTimeIndex = Math.round(myData.traffic_time_index);
            var crimeIndex = Math.round(myData.crime_index);
            var pollutionIndex = Math.round(myData.pollution_index);
            var qualityOfLifeIndex = Math.round(myData.quality_of_life_index);
            console.log(myData);
            $('#statsName').text(statsName);
            $('#costOfLiving').text(costOfLiving);
            $('#housingToIncomeRatio').text(housingToIncomeRatio);
            $('#trafficTimeIndex').text(trafficTimeIndex);
            $('#crimeIndex').text(crimeIndex);
            $('#pollutionIndex').text(pollutionIndex);
            $('#qualityOfLifeIndex').text(qualityOfLifeIndex);

            console.log(statsName);
            console.log(costOfLiving);
            console.log(housingToIncomeRatio);

        });




        console.log(state);
        console.log(city);

        var schoolUrl = `http://anyorigin.com/go?url=https%3A//api.greatschools.org/schools/${state}/${city}/public/%3Fkey%3Dc3fa23155c53d73ae3e185eb12ec0b84%26sort%3Dparent_rating%26limit%3D20&callback=?`;

        $.getJSON(schoolUrl, function (data) {

            //   console.log(data.contents);
            var text, parser, xmlDoc;
            text = data.contents;
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(text, "text/xml");
            var schoolArr = [];




            var school = xmlDoc.getElementsByTagName('school');

            console.log(name.length);

         //   $('#schoolInfo').text(xmlDoc.getElementsByTagName('name')[0].childNodes[0].nodeValue);
            console.log(xmlDoc.getElementsByTagName('name')[0].childNodes[0].nodeValue);
            console.log(school);
            console.log(school[0].children[1].textContent);


            for (var i = 0; i < school.length; i++) {

                $('#schoolTable').append(`
                    <tr>
                        <td>${school[i].children[1].textContent}</td>   // name
                        <td>${school[i].children[2].textContent}</td>   //type
                        <td>${school[i].children[3].textContent}</td>   // grade range
                        <td>${school[i].children[6].textContent}</td>   // parent ratings 
                        <td>${school[i].children[5].textContent}</td>   // gs ratings
                        <td><a href="${school[i].children[15].textContent}" target="_blank">Learn More</a></td>  // website
                    </tr>
                `);
            }


            console.log(schoolArr);

        });
    });


    $('#weather').on('click', function (e) {
        e.preventDefault();
        console.log("wasclicked")
        WaetherCall();
        //pullingCityPic()
    });
    var units = 'imperial';
    var inputWeather = "San Francisco"
    //weather function
    function WaetherCall() {
        //will take input from search based on lat and long
        //$("#search-input").val().trim() ;

        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + inputWeather + ",us&APPID=eeda0b646e014b160ccbce009bb655ef";
        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                cnt: 16,
                units: units
            }

        }).then(function (data) {
            console.log(data)
            lat = data.city.coord.lat;
            lon = data.city.coord.lon;
            city = data.city.name;
            cityPop = data.city.population;
            highF = Math.round(data.list[0].main.temp_max) + '°';
            lowF = Math.round(data.list[0].main.temp_min) + '°';
            description = data.list[0].weather[0].description;
            console.log(lat, lon)
            console.log(city, cityPop)
            console.log(lowF, highF, description)
            //appending info
            $('#city').html('city: ' + city)
            $('#cityPop').html('cityPop: ' + cityPop);
            $('#description').html('description: ' + description)
            $('#highF').html('highF: ' + highF);
            $('#lowF').html('lowF: ' + lowF);
            //based on weather lat and lon grabbing time information
            var times_Stamp = (Math.round((new Date().getTime()) / 1000)).toString();
            $.ajax({
                url: "https://maps.googleapis.com/maps/api/timezone/json?location=" + lat + "," + lon + "&timestamp=" + times_Stamp,
                type: "POST",
            }).done(function (response) {
                var Cur_Date = new Date();
                var UTC = Cur_Date.getTime() + (Cur_Date.getTimezoneOffset() * 60000);
                var Loc_Date = new Date(UTC + (1000 * response.rawOffset) + (1000 * response.dstOffset));
                $("#timeOfLocation").html('Current Time : ' + Loc_Date);
                getHist()
                pullingCityPic()

            });
        });

    }

    //    $('#climate').on('click', function (e) {
    function getHist() {
        // e.preventDefault();
        // url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&locationid=" + city + "&datatypeid=TMAX&startdate=2018-01-01&enddate=2018-04-01&units=standard"
        //getting city information from first weather api
        url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/search?limit=50&offset=1&resulttype=CITY&text=" + city + "&datasetid=GSOM&startdate=2018-01-01&enddate=2018-02-01&sortfield=score&sortorder=desc"
        var tokenFromNoaa = "WWKoJVmRVKlQKXOsSHFiQZXozlzIBzJY";
        $.ajax({
            url: url,
            headers: {
                token: tokenFromNoaa
            },
            success: function (data) {
                //console.log(data.results[0].station)
                console.log(data);
                cityToPass = data.results[0].id;
                console.log(cityToPass)

                //console.log(data.results[0].date)
            }
        })

            .then(function (data) {
                url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&locationid=" + cityToPass + "&datatypeid=TMAX&startdate=2017-01-01&enddate=2018-01-01&units=standard&limit=1000"
                $.ajax({
                    url: url,
                    headers: {
                        token: tokenFromNoaa
                    },
                }).then(function (data) {
                    
                    data = data.results
                    let uniqMonthsSet = new Set();
                    for (i = 0; i < data.length; i++) {
                        uniqMonthsSet = uniqMonthsSet.add(data[i].date); //Get me only unique line items
                    }
                    
                    var uniqueMonthsArr = Array.from(uniqMonthsSet) //Convert the Set back to an array
                  
                  var avgTempsData = []; //Array to store unique Months and AvgTempData
                  for (i=0; i < uniqueMonthsArr.length; i++) {
                    var dataPerMonth = data.filter((fromData) => fromData.date.indexOf(uniqueMonthsArr[i]) > -1).length;
                    var objTemps = getAverageTemp(data, uniqueMonthsArr[i], dataPerMonth); //{month: "Jan 2017", temps: 43}
                    avgTempsData.push(objTemps[0]);  
                  }
    
                  function getAverageTemp(arr, month, monthlyData) {
                        var values = arr.filter((fromData) => fromData.date.indexOf(uniqueMonthsArr[i]) > -1)
                                        .reduce(function(prev, value) { return prev + value.value; }, 0);
                        var avg = Math.round (values / monthlyData);
                        var formattedMonth = moment(month).format('MMM'); //"Jan 2017"
                        var obj = {month: formattedMonth, temps: avg};
                        //console.log(obj);
                        return [obj];  
                  }
                   /////////////////////loop for getitng TEMP MAX --------------for DISPLAY
                for (i = 0; i < avgTempsData.length; i++){
                  var monthToMax = avgTempsData[i].month;
                  var tempToMax = avgTempsData[i].temps
                  console.log(monthToMax,tempToMax)
                    }

                })
                    .then(function (data) {
                        url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&locationid=" + cityToPass + "&datatypeid=TMIN&startdate=2017-01-01&enddate=2018-01-01&units=standard&limit=1000"
                        $.ajax({
                            url: url,
                            headers: {
                                token: tokenFromNoaa
                            },
                        }).then(function (data) {
                    
                            data = data.results
                            let uniqMonthsSet = new Set();
                            for (i = 0; i < data.length; i++) {
                                uniqMonthsSet = uniqMonthsSet.add(data[i].date); //Get me only unique line items
                            }
                            
                            var uniqueMonthsArr = Array.from(uniqMonthsSet) //Convert the Set back to an array
                          
                          var avgTempsData = []; //Array to store unique Months and AvgTempData
                          for (i=0; i < uniqueMonthsArr.length; i++) {
                            var dataPerMonth = data.filter((fromData) => fromData.date.indexOf(uniqueMonthsArr[i]) > -1).length;
                            var objTemps = getAverageTemp(data, uniqueMonthsArr[i], dataPerMonth); //{month: "Jan 2017", temps: 43}
                            avgTempsData.push(objTemps[0]);  
                          }
            
                          function getAverageTemp(arr, month, monthlyData) {
                                var values = arr.filter((fromData) => fromData.date.indexOf(uniqueMonthsArr[i]) > -1)
                                                .reduce(function(prev, value) { return prev + value.value; }, 0);
                                var avg = Math.round (values / monthlyData);
                                var formattedMonth = moment(month).format('MMM'); //"Jan 2017"
                                var obj = {month: formattedMonth, temps: avg};
                                //console.log(obj);
                                return [obj];  
                          }
                          //////////////////////////loop for getitng TEMP MIN --------------for DISPLAY
                        for (i = 0; i < avgTempsData.length; i++){
                          var monthToMin = avgTempsData[i].month;
                          var tempToMin = avgTempsData[i].temps
                          console.log(monthToMin,tempToMin)
                            }
        
                        });
                    });

            })
        //});
    }


    function formatDollar(num) {
        var p = num.toFixed().split(".");
        return "$" + p[0].split("").reverse().reduce(function (acc, num, i, orig) {
            return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
        }, "");
    }
    ///google auto city 
    var input = document.getElementById('autocomplete');
    var search = new google.maps.places.Autocomplete(input, { types: ['(regions)'] });
    google.maps.event.addListener(search, 'place_changed', function () {

    });
    google.maps.event.addListener(search, 'place_changed', function (event) {
        var input = document.getElementById('autocomplete').value;
        var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + input + '&key=AIzaSyC75PI0JP6R87nUSYn4R8iySVG0WGUZqMQ';
        console.log(input)
    });
    //end 
    function pullingCityPic(){
        var queryURL = "https://pixabay.com/api/?key=8449388-e25d53a8bbc2d9948e151d998&q="+city+"&image_type=photo";
        $.ajax({
            url: queryURL,
            method: "GET",  
        }).then(function (response) { 
            console.log(response)
            $("#dropping").empty()
            var results = response.hits;
        for (var i = 0; i < results.length; i++) {
            var imgLocation = $("<div class='cityPictures'>");
            var urlsrc = results[i].largeImageURL;
            //console.log(urlsrc)
            var pic = $("<img>").addClass("pic rounded-circle").attr("src", urlsrc);
            imgLocation.append(pic);
            $("#dropping").append(imgLocation);
        }
        })

    }
});

