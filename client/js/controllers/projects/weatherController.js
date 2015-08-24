'use strict';
xively.controller('WeatherCtrl', function($http, $scope,localStorageService){
    
    // make API call to Yahoo with the ZIP code parameter
	$scope.getWeather = function(zip){
	var oldPerson=localStorageService.get('currentPerson');
	console.log(oldPerson+"asdasdasda222");
	
	$scope.zip =oldPerson.zipcode;
	$http.get('https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20weather.forecast%20WHERE%20location%3D%22' + $scope.zip + '%22&format=json&diagnostics=true&callback=')
		.success(function(data){
			$scope.weather = data.query.results.channel
			$scope.forecast = data.query.results.channel.item.forecast
			$scope.tempIndex = (parseInt($scope.weather.item.condition.temp) - parseInt($scope.forecast[0].low)) / (parseInt($scope.forecast[0].high) - parseInt($scope.forecast[0].low)) * 100
			
		})
	}
	console.log("asdasdasdas"+$scope.zip);
	//decide which weather icon SVG to display for the current weather
	$scope.weatherImg = function(code){
		if([6, 9, 11, 12, 35, 40].indexOf(parseInt(code)) > -1){
			return "Cloud-Drizzle"
		} else if ([3, 4, 37, 38, 39, 45, 47].indexOf(parseInt(code)) > -1){
			return "Cloud-Lightning"
		} else if ([26, 27, 28, 29, 30, 44].indexOf(parseInt(code)) > -1){
			return "Cloud-Sun"
		} else if ([32, 36].indexOf(parseInt(code)) > -1){
			return "Sun"
		} else {
			return "Cloud-Sun"
		}
	}

	//clear parameters that each well is dependent on
	$scope.resetWeather = function(){
		$scope.zip = null
		$scope.weather = null
	}

	$scope.drawChart = function(forecast){
		var data = {
	    labels: [],
	    datasets: [
        {
          label: "High",
          fillColor: "rgba(220,220,220,0)",
          strokeColor: "#ff4136",
          pointColor: "#ff4136",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: []
        },
        {
          label: "Low",
          fillColor: "rgba(151,187,205,0)",
          strokeColor: "#379DC4",
          pointColor: "#379DC4",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: []
        }
	    ]
		}

		Chart.defaults.global.responsive = true


		for (var i=0; i<forecast.length; i++){
			data.labels.push(forecast[i].day)
			data.datasets[0].data.push(forecast[i].high)
			data.datasets[1].data.push(forecast[i].low)
		}
		var ctx = document.getElementById("forecast-chart").getContext("2d")
		var myNewChart = new Chart(ctx).Line(data,lineOptions)
		$scope.chartDrawn = true
	}

})






