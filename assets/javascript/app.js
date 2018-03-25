$(".tohide").hide();
$(document).ready(function () {

    var state;
    var city;

    $('#submit').on('click', function (e) {
        
        $(".tohide").show()
        e.preventDefault();
        if ($('#autocomplete').val() === '') {
            $('#errorBody').modal('show');
            $('#errorMessage').text('Please enter a location!');
        } else if ($('#occupation').val() === '') {
            $('#errorBody').modal('show');
            $('#errorMessage').text('Please enter an occupation!');
        } else {

            $("#data").empty();

            var occupation = $('#occupation').val();
            var cityStateCountry = $('#autocomplete').val().trim();
            var medianPerCapUS = '$29,829';
            var myArr = cityStateCountry.split(',');
            city = myArr[0].trim();
            state = myArr[1].trim();
            var cityStateWithSpace = myArr[0] + ',' + myArr[1];
            var cityState = cityStateWithSpace.replace(', ', ',');
            WaetherCall();
            $('.occupation').text(occupation);
            $('#location').text(cityState);

            // career stats ///////////////////////////////////////////////////////////////////////////////

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
                },
                error: function (request, status, errorThrown) {
                    $('#errorBody').modal('show');
                    $('#errorMessage').text('There was an error processing your request for career stats. Please try another search term.');
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
                        var myRoot = response.OccupationDetail[0];
                        var title = myRoot.OnetTitle;
                        var localWages = myRoot.Wages.BLSAreaWagesList;
                        var natWages = myRoot.Wages.NationalWagesList;
                        var stateStats = myRoot.Projections.Projections[0];
                        var nationalStats = myRoot.Projections.Projections[1];
                        var crntUSemp = nationalStats.EstimatedEmployment;
                        var crntStateEmp = stateStats.EstimatedEmployment;
                        var projectedAnnualOpeningsSt = formatCommas(parseInt(stateStats.ProjectedAnnualJobOpening));
                        var projectedAnnualOpeningsUS = formatCommas(parseInt(nationalStats.ProjectedAnnualJobOpening));
                        var stateName = stateStats.StateName;
                        for (var i = 0; i < localWages.length; i++) {
                            if (localWages[i].RateType === 'Annual') {

                                var cityMedianIncomeForOcc = formatDollar(parseInt(localWages[i].Median));
                            }
                        }
                        for (var i = 0; i < natWages.length; i++) {
                            if (natWages[i].RateType === 'Annual') {

                                var USmedianIncomeForOcc = formatDollar(parseInt(natWages[i].Median));
                            }
                        }
                        $('#careerStats').empty();
                        $('#careerStats').append(`
                        <p>US Median Per Capita Income: $29,829</p>
                        <p>US Median Wages for <strong>${title}</strong>: <strong>${USmedianIncomeForOcc}</strong></p>
                        <p>Estimated number of <strong>${title}</strong> jobs in the US: <strong>${crntUSemp}</strong></p>
                        <p>Projected number of annual job openings for <strong>${title}</strong> in the US: <strong>${projectedAnnualOpeningsUS}</strong></p>
                        <p>Median Wages for <strong>${title}</strong> in <strong>${cityStateWithSpace}</strong>: <strong>${cityMedianIncomeForOcc}</strong></p>
                        <p>Estimated number of <strong>${title}</strong> jobs in <strong>${state}</strong>: <strong>${crntStateEmp}</strong></p>
                        <p>Projected number of annual job openings for <strong>${title}</strong> in <strong>${state}</strong>: <strong>${projectedAnnualOpeningsSt}</strong></p>
                    `);
                        // console.log('US Median Per Capita Income: $29,829');
                        // console.log(myRoot);
                        // console.log(`Estimated current number of '${title}' jobs in ${stateName}: ${crntStateEmp}`); // Output to page

                        // console.log(`Projected annual openings for '${title}' jobs in ${stateName}: ${projectedAnnualOpeningsSt}`);
                        // console.log(`Estimated number of '${title}' jobs in the U.S.: ${projectedAnnualOpeningsUS}`)
                    },
                    error: function (request, status, errorThrown) {
                        $('#errorBody').modal('show');
                        $('#errorMessage').text('There was an error processing your request for career stats. Please try another search term.');
                    }
                });
            });

            // City Data /////////////////////////////////////////////////////////////////////////////////////////////////

            var numbeoUrl = `https://anyorigin.com/go?url=https%3A//www.numbeo.com/api/indices%3Fapi_key%3D2iev2m2k4slcbo%26query%3D${cityState}&callback=?`;

            $.getJSON(numbeoUrl, function (data) {

            }).then(function (data) {
                var myData = data.contents;
                var statsName = myData.name;
                var costOfLiving = Math.round(myData.cpi_index);
                var housingToIncomeRatio = myData.property_price_to_income_ratio.toFixed(2);
                var trafficTimeIndex = Math.round(myData.traffic_time_index);
                var crimeIndex = Math.round(myData.crime_index);
                var pollutionIndex = Math.round(myData.pollution_index);
                var qualityOfLifeIndex = Math.round(myData.quality_of_life_index);
                // console.log(myData);

                $('#cityData').empty();
                $('#cityData').append(`
                <h5>Statistics for <strong>${statsName}:</strong></h5>
                <p>Cost of Living: <strong>${costOfLiving}</strong></p>
                <p>Housing to Income Ratio: <strong>${housingToIncomeRatio}</strong></p>
                <p>Traffic Time Index: <strong>${trafficTimeIndex}</strong></p>
                <p>Crime Index: <strong>${crimeIndex}</strong></p>
                <p>Pollution Index: <strong>${pollutionIndex}</strong></p>
                <p>Quality of Life Index: <strong>${qualityOfLifeIndex}</strong></p>
            `);

            }).fail(function (error) {
                $('#errorBody').modal('show');
                $('#errorMessage').text('There was an error processing your request for city data. Please try another search term.');
            });
        
        schoolAPIcall();
        }
    });


    var schoolsOnDisplay = 5;
    $('#moreSchools').on('click', function (e) {
        e.preventDefault();
        if (schoolsOnDisplay < 200) {
            schoolsOnDisplay += 5;
            schoolAPIcall();
        }
    });
    $('#previousSchools').on('click', function (e) {
        e.preventDefault();
        if (schoolsOnDisplay > 5) {
            schoolsOnDisplay -= 5;
            schoolAPIcall();
        }
});

// school data ////////////////////////////////////////////////////////////////////////////////////////
function schoolAPIcall() {
    var schoolUrl = `https://anyorigin.com/go?url=https%3A//api.greatschools.org/schools/${state}/${city}/public/%3Fkey%3Dc3fa23155c53d73ae3e185eb12ec0b84%26sort%3Dparent_rating%26&callback=?`;

    $.getJSON(schoolUrl, function (data) {

    }).then(function (data) {
        //   console.log(data.contents);
        var text, parser, xmlDoc;
        text = data.contents;
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(text, "text/xml");
        var schoolArr = [];
        var school = xmlDoc.getElementsByTagName('school');

        $('#schoolsDisplayed').text(`${schoolsOnDisplay - 4} - ${schoolsOnDisplay}`);
        $('#schoolInfo').empty();
        for (var i = schoolsOnDisplay - 5; i < schoolsOnDisplay; i++) {
            var parentRating = school[i].children[6].textContent;
            var gsRating = school[i].children[5].textContent;

            if (gsRating !== '1' && gsRating !== '2' && gsRating !== '3' && gsRating !== '4' && gsRating !== '5') {
                school[i].children[5].textContent = 'N/A';
            }

            $('#schoolInfo').append(`
                    <div class="outerSchoolDiv">
                        <span>${school[i].children[1].textContent}</span>
                        <span>${school[i].children[2].textContent}</span>
                        <span>${school[i].children[3].textContent}</span>
                        <div class="innerSchoolDiv">
                            <span id="parentRating${i}">Parent Rating: </span><br>
                            <span>GreatSchools Rating: ${school[i].children[5].textContent}</span><br>
                            <span class="gsRatingDesc">(1 - 10)</span>
                            <span class="schoolLink"><a href="${school[i].children[15].textContent}" target="_blank">Learn More</a></span>
                        </div>
                    </div>
                `);
            var stars = parseInt(school[i].children[6].textContent);
            for (var j = 1; j <= 5; j++) {
                if (stars !== 1 && stars !== 2 && stars !== 3 && stars !== 4 && stars !== 5) {
                    $(`#parentRating${i}`).text('Parent Rating: N/A');
                } else if (j <= stars) {
                    $(`#parentRating${i}`).append('<span class="fa fa-star checked"></span>');
                } else {
                    $(`#parentRating${i}`).append('<span class="fa fa-star"></span>');
                }
            }
        }

    }).fail(function (error) {
        $('#errorBody').modal('show');
        $('#errorMessage').text('There was an error processing your request for school data. Please try another search term.');
    });
}

function formatDollar(num) {
    var p = num.toFixed().split(".");
    return "$" + p[0].split("").reverse().reduce(function (acc, num, i, orig) {
        return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "");
}

function formatCommas(num) {
    var p = num.toFixed().split(".");
    return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
        return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var avgMaxTempsData = [];
var avgMinTempsData = [];
var graphReadyTempArr = [];
var graphFinal = [];




var aData = [];

/* object constructor */
function graphData(minTemp, maxTemp, month) {
    this.y = minTemp;
    this.y0 = maxTemp;
    this.month = month;
}

var uniqueMonthsArr; //To hold an array holding unique Months from our data.

//This function will return ( uniqueMonthsArr ) with the unique months from the data response.
function uniqueResultsFromData(data) {
    let uniqMonthsSet = new Set();
    for (i = 0; i < data.length; i++) {
        uniqMonthsSet = uniqMonthsSet.add(data[i].date); //Get me only unique line items
    }
    uniqueMonthsArr = Array.from(uniqMonthsSet); //Convert the
    return uniqueMonthsArr;
}

//This function will return the month and average temperatures as an Object { month: ####### temps: ###### }
function getAverageTemp(arr, month, monthlyData) {
    var values = arr.filter((fromData) => fromData.date.indexOf(uniqueMonthsArr[i]) > -1)
        .reduce(function (prev, value) { return prev + value.value; }, 0);
    var avg = Math.round(values / monthlyData);
    var formattedMonth = moment(month).format('MMM'); //"Jan 2017"
    var obj = { month: formattedMonth, temps: avg };
    return [obj];
}

$('#weather').on('click', function (e) {
    e.preventDefault();
    console.log("wasclicked")
    WaetherCall();
    //pullingCityPic()
});

var units = 'imperial';
//weather function
function WaetherCall() {
    //will take input from search based on lat and long
    //$("#search-input").val().trim() ;

    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&APPID=eeda0b646e014b160ccbce009bb655ef";
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
        const icon2 = data.list[0].weather[0].id;
        console.log(lat, lon)
        console.log(city, cityPop)
        console.log(lowF, highF, description)

        $('h1.wi').addClass("wi-owm-" + icon2)
        $('#highF').html(highF);
        $('#city').html(city)
        $('#cityPop').html(' City population: ' + cityPop);
        $('#description').html(description)

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
            var formatTime = moment(Loc_Date).format(("MMM Do, hh:mm"));
            $("#timeOfLocation").html(formatTime);
            getHist();
            pullingCityPic();

        });
    });

}

function getHist() {
    //getting city information from first weather api
    url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/search?limit=50&offset=1&resulttype=CITY&text=" + city + "&datasetid=GSOM&startdate=2018-01-01&enddate=2018-02-01&sortfield=score&sortorder=desc"
    var tokenFromNoaa = "WWKoJVmRVKlQKXOsSHFiQZXozlzIBzJY";
    $.ajax({
        url: url,
        headers: {
            token: tokenFromNoaa
        },
        success: function (data) {
            console.log(data);
            cityToPass = data.results[0].id;
            console.log(cityToPass);

        }
    })
        .then(function (data) {
            url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&locationid=" + cityToPass + "&datatypeid=TMAX&startdate=2017-01-01&enddate=2018-01-01&units=standard&limit=1000";
            $.ajax({
                url: url,
                headers: {
                    token: tokenFromNoaa
                }
            }).then(function (data) {
                data = data.results;

                var uniqMonthsForMaxTemps = uniqueResultsFromData(data);
               
                for (i = 0; i < uniqMonthsForMaxTemps.length - 1; i++) {
                    //iterate through each unique month inside our uniqMonthsForMaxTemps array
                    var dataPerMonth = data.filter((fromData) => fromData.date.indexOf(uniqMonthsForMaxTemps[i]) > -1).length;
                    var objTemps = getAverageTemp(data, uniqMonthsForMaxTemps[i], dataPerMonth); //{month: "Jan 2017", temps: 43}
                    avgMaxTempsData.push(objTemps[0]);
                }
                
                /////////////////////loop for getitng TEMP MAX --------------for DISPLAY
                // for (i = 0; i < avgMaxTempsData.length; i++) {
                //     var monthToMax = avgMaxTempsData[i].month;
                //     var tempToMax = avgMaxTempsData[i].temps;
                // }
            })
                .then(function (data) {
                    url = "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&locationid=" + cityToPass + "&datatypeid=TMIN&startdate=2017-01-01&enddate=2018-01-01&units=standard&limit=1000";
                    $.ajax({
                        url: url,
                        headers: {
                            token: tokenFromNoaa
                        },
                    }).then(function (data) {
                        data = data.results;
                        var uniqueMonthsForMinTemps = uniqueResultsFromData(data);
                        
                        for (i = 0; i < uniqueMonthsForMinTemps.length - 1; i++) {
                            var dataPerMonth = data.filter((fromData) => fromData.date.indexOf(uniqueMonthsForMinTemps[i]) > -1).length;
                            var objTemps = getAverageTemp(data, uniqueMonthsForMinTemps[i], dataPerMonth); //{month: "Jan 2017", temps: 43}
                            avgMinTempsData.push(objTemps[0]);
                        }
                        
                    });
                });
        });
    //});
}


function tempObjforGraph() {
    for (var i = 0; i < avgMaxTempsData.length; i++) {
        graphReadyTempArr.push(
            {
                "y":avgMinTempsData[i].temps, 
                "y0":avgMaxTempsData[i].temps,
                "month":avgMaxTempsData[i].month
            }
        );
    }
    graphReadyTempArr.push(
        {
            "y": 0,
            "y0":0,
            "month":""
        }
    );
    graphFinal.push(graphReadyTempArr);
}

$('#testBtn').on('click', function() {
    console.log(avgMaxTempsData);
    console.log(avgMinTempsData);
    tempObjforGraph();
    console.log(graphFinal);
    
});

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
function pullingCityPic() {
    var queryURL = "https://pixabay.com/api/?key=8449388-e25d53a8bbc2d9948e151d998&q=" + city + "&image_type=photo&per_page=5";
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
            var pic = $("<img>").addClass("pic rounded-circle hoverable").attr("src", urlsrc);
            imgLocation.append(pic);
            $("#dropping").append(imgLocation);
        }
    })

}
});
