(function ($) {

    // console.log(window.Acme.templatePath);
    // console.log(_appJsConfig);

	var dropdown = function(date) {
		return '<div class="weather-date">' + 
    					'<h1>Weather</h1>' + 
    					'<p>' + date + '</p>' + 
    				'</div>' + 
    				'<div id="weather-panels"><div id="panel-containter"></div></div>';
	}

    var localWeather = function(name, icon) {
        return '<div id="' + name + '-weather" class="weather visible-sm-block visible-md-block visible-lg-block">' +
                    '<img class="show-weather" src="' + _appJsConfig.templatePath + '/static/icons/weather/pointer-arrow-thin.svg">' + 
                    '<div style="margin-right:15px;">' +
                        '<p class="location" style="text-align:right;"></p>' + 
                        '<p class="description"></p>' + 
                    '</div>' + 
                    '<img class="icon" src="' + _appJsConfig.templatePath + '/static/icons/weather/' + icon + '.svg">' + 
                    '<p class="temp"></p>' + 
                '</div>';
        }

    var weatherPanel = function(name, icon) {
    	return '<div id="' + name + '-weather" class="panel visible-sm-block visible-md-block visible-lg-block">' +
                    '<div style="display: flex">' + 
                        '<img class="icon" src="' + _appJsConfig.templatePath + '/static/icons/weather/' + icon + '.svg">' + 
                        '<p class="temp"></p>' + 
                    '</div>' +
                    '<p class="location"></p>' + 
                    '<p class="description"></p>' +
                '</div>';
	    }

    var getLocations = function(country) {
        switch (country) {
            case 'nz':
                return [
                    'NZ/Auckland',
                    'NZ/Wellington',
                    'NZ/Nelson',
                    'NZ/Christchurch',
                    'NZ/Dunedin',
                    'NZ/Invercargill',
                ];
                break;
            default:
                return [
                    'Australia/Sydney',
                    'Australia/Melbourne',
                    'Australia/Brisbane',
                    'Australia/Perth',
                    'Australia/Adelaide',
                    'Australia/Hobart',
                    'Australia/Canberra',
                    'Australia/Darwin',
                ];
        }
    }

    var country = _appJsConfig.appHostName.split('.').reverse()[0];
    var locations = getLocations(country)

    Acme.server.fetch('https://weather.pagemasters.com.au/weather?q=' + locations[0])
        .done(function(res) {
            var local = res.data[0];
            var name = local.location.split('/')[1];
            console.log('success');
            $('#weather').html(localWeather(name + '-local', local.icon));
            $('#' + name + '-local-weather > div > p.location').text(name);
            $('#' + name + '-local-weather > div > p.description').text(local.description);
            $('#' + name + '-local-weather > p.temp').html(Math.round(local.temperature) + '&#176;');


            $('.show-weather').on("click", function () {
                
                Acme.server.fetch('https://weather.pagemasters.com.au/weather?q=' + locations.join(','))
                    .done(function(res) {
                        $('.show-weather').toggleClass('flip');

                        $('.weather-dropdown').toggleClass('hidden');
                        $('.weather-dropdown').html(dropdown('Thursday, 28th September'));

                        res.data.forEach(function(l) {
                            var name = l.location.split('/')[1];

                            $('#panel-containter').append(weatherPanel(name, l.icon));

                            $('#' + name + '-weather > .location').text(name);
                            $('#' + name + '-weather > .description').text(l.description);
                            $('#' + name + '-weather > div > p.temp').html(Math.round(l.temperature) + '&#176;');
                        });
                });
            });
    });
}(jQuery));