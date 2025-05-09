(function ($) {

    Acme.Locations = function(country){
        if (!country) {
          country = localStorage.getItem("weather-country");   
        }
        if (!country) { 
            country = 'default';
        }
        this.data = this.getLocations(country);
        this.regional = this.getLocations(country + '-regional');
    };
    Acme.Locations.prototype.getLocations = function(country) 
    {
        switch (country) {
            case 'USA':
                Acme.State.Country = 'America';
                return [
                    'America/New%20York',
                    'America/Baltimore',
                    'America/Boston',
                    'America/Chicago',
                    'America/Columbus',
                    //'America/Edmonton',
                    'America/Knoxville',
                    'America/Minneapolis',
                    //'America/Montreal',
                    'America/Portland',
                    'America/San%20Antonio',
                    'America/San%20Francisco',
                    'America/Seattle',
                    'America/Los%20Angeles',
                    //'America/Toronto',
                    //'America/Vancouver',
					'America/Washington%20DC',
                    //'America/Winnipeg'
                ];
            case 'United Kingdom':
                Acme.State.Country = 'GB';
                return [
                    'GB/London',
                    'GB/Birmingham',
                    'GB/Bristol',
                    'GB/Cardiff',
                    'GB/Dublin',
                    'GB/Edinburgh',
                    'GB/Glasgow',
                    'GB/Leeds',
                    'GB/Liverpool',
                    'GB/Manchester',
                    'GB/Newcastle',
                    'GB/Norwich',
                    'GB/Nottingham',
                    'GB/Sheffield',
                    'GB/Southampton',
                    'GB/St%20Austell'
                ];
                break;
            case 'United Kingdom-regional':
                return [
                    'GB/London'
                ];
                break;
            case 'New Zealand':
                Acme.State.Country = 'NZ';
                return [
                    'NZ/Wellington',
                    'NZ/Auckland',
                    'NZ/Christchurch',
                    'NZ/Dunedin',
                    'NZ/Invercargill',
                    'NZ/Nelson',
                    'NZ/New%20Plymouth',
                    'NZ/Palmerston%20North',
                    'NZ/Tauranga',
                ];
                break;


            case 'New Zealand-regional':
                return [
                    'NZ/Ashburton',
                    'NZ/Blenheim',
                    'NZ/Dargaville',
                    'NZ/Gisborne',
                    'NZ/Gore',
                    'NZ/Greymouth',
                    'NZ/Hamilton',
                    'NZ/Hastings',
                    'NZ/Kaitaia',
                    'NZ/Kerikeri',
                    'NZ/Masterton',
                    'NZ/Napier',
                    'NZ/Oamaru',
                    'NZ/Thames',
                    'NZ/Timaru',
                    'NZ/Wanganui',
                    'NZ/Westport',
                    'NZ/Whangarei'
                ];
                break;


            case 'Australia-regional':
                return [
                    'Australia/Launceston',
                    'Australia/Albany',
                    'Australia/Alice%20Springs',
                    'Australia/Mount%20Gambier',
                    'Australia/Cairns',
                    'Australia/Gympie',
                    'Australia/Newcastle',
                    'Australia/Wagga%20Wagga',
                    'Australia/Bairnsdale',
                    'Australia/Northam',
                    'Australia/Bundaberg',
                    'Australia/Tamworth',
                    'Australia/Orange',
                    'Australia/Griffith',
                    'Australia/Wollongong',
                    'Australia/Bendigo',
                    'Australia/Albury',
                    'Australia/Toowoomba',
                    'Australia/Warrnambool'
                ];
                break;

            case 'Australia':
                Acme.State.Country = 'Australia';
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
                break;
            case 'Canada':
                Acme.State.Country = 'Canada';
                return [
                    'America/Edmonton',
                    'America/Calgary',
                    'America/Mississauga',
                    'America/Montréal',
                    'America/Ottawa',
                    'America/Scarborough%20Village',
                    'America/Toronto',
                    'America/Vancouver',
                    'America/Winnipeg',
                ];
                break;
            case 'Europe':
                Acme.State.Country = 'Europe';
                return [
                    'Europe/Amsterdam',
                    'Europe/Barcelona',
                    'Europe/Berlin',
                    'Europe/Dublin',
                    'Europe/Madrid',
                    'Europe/Milan',
                    'Europe/Paris',
                    'Europe/Rome',
                    'Europe/Stockholm',
                    'Europe/Zurich',
                ];
            break;
            case 'Caribbean':
                Acme.State.Country = 'Caribbean';
                return [
                    'America/Bridgetown',
                    'America/Havana',
                    'America/Kingston',
                    'America/Kingstown',
                    'America/Port-au-Prince',
                    'America/Port of Spain',
                    'America/Santo%20Domingo',
                    'America/San%20Juan',
                ];

            default:
                Acme.State.Country = 'America';
                return [];
        }
    };

    



    Acme.Weather = function()
    {
        this.subscriptions = Acme.PubSub.subscribe({
            'Acme.weather_model.listener' : ["update_state"]
        });
        this.listeners = {
            "localweather" : function(data) {
                if (data['localweather']) {
                    return this.fetch(data['localweather'], 'localweather');
                }
            },
            "nationalweather" : function(data) {
                
                return this.fetch(data['nationalweather'], 'nationalweather');
            },
            "city": function(data) {
                Acme.State.City = data.city;
            },
            "country": function(data) {
                Acme.State.Country = data.country;
            }
        };
    };
    Acme.Weather.prototype = new Acme._Model();
    Acme.Weather.constructor = Acme.Weather;
    Acme.Weather.prototype.fetch = function(location, view)
    {
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('weather')){
            location = urlParams.get('weather');
        }
        var self = this;
        // Acme.server.fetch('https://weather.pagemasters.com.au/weather?q=' + location)
        Acme.server.fetch('https://weather.publish.net.au/weather?q=' + location)
            .done(function(r) {
                self.data = r.data;
                var publishData = {};
                publishData[view] = self;
                Acme.PubSub.publish("state_changed", publishData);
            }).fail(function(r) {
                console.log(r);
            });
    };







    Acme.WeatherHeader_View_Class = function()
    {
        this.localdata = null;
        this.subscriptions = Acme.PubSub.subscribe({
            'Acme.weather_view.listener' : ["state_changed"]
        });
        this.listeners = {
            "localweather" : function(data) {
                this.localdata = data.localweather.data;
                return this.renderLocal();
            },
            "nationalweather" : function(data) {
                this.nationaldata = data.nationalweather.data;
                return this.renderNational();
            },
        };
    };
    Acme.WeatherHeader_View_Class.prototype = new Acme._View();
    Acme.WeatherHeader_View_Class.constructor = Acme.WeatherHeader_View;


    // inherit from WeatherHeader_View_Class
    Acme.WeatherHeader_View = function(config)
    {
        this.container = config.container || null;
        this.locations = config.locations || null;

        this.templates = {
            "dropdown" : 
                '<div class="weather-date">' + 
                    '<h1>Weather</h1>' + 
                    '<p>{{date}}</p>' + 
                    '<i id="default_weather">Set default city</i><br />' +
                    '<i id="scale_weather">Set Fahrenheit/Celsius</i>' +
                '</div>' + 
                '<div id="weather-panels"><div id="panel-containter"></div></div>'
            ,
            "localWeather" : 
                '<div id="{{name}}-weather" class="weather visible-sm-block visible-md-block visible-lg-block">' +
                    '<img class="show-weather" src="' + _appJsConfig.templatePath + '/static/icons/weather/pointer-arrow-thin.svg">' + 
                    '<div style="margin-right:15px;">' +
                        '<p class="location" style="text-align:right;">{{location}}</p>' + 
                        '<p class="description">{{description}}</p>' + 
                    '</div>' + 
                    '<img class="icon" src="' + _appJsConfig.templatePath + '/static/icons/weather/{{icon}}.svg">' + 
                    '<p class="temp">{{temp}}&#176;</p>' + 
                '</div>'
            ,
            "weatherPanel" : 
                '<div id="{{name}}-weather" class="panel visible-sm-block visible-md-block visible-lg-block">' +
                    '<div style="display: flex">' + 
                        '<img class="icon" src="' + _appJsConfig.templatePath + '/static/icons/weather/{{icon}}.svg">' + 
                        '<p class="temp">{{temp}}&#176;</p>' + 
                    '</div>' +
                    '<p class="location">{{location}}</p>' + 
                    '<p class="description">{{description}}</p>' +
                '</div>'
            ,
            "weatherSelect" :
                '<div class="default-weather__select visible-sm-block visible-md-block visible-lg-block">' +
                    '<div class="default-weather__text">WEATHER</div>' + 
                    '<div id="default_weather" class="default-weather__link">SELECT LOCATION</div>' +
                '</div>'
        };

        this.events();
    };
    Acme.WeatherHeader_View.prototype = new Acme.WeatherHeader_View_Class();
    Acme.WeatherHeader_View.constructor = Acme.WeatherHeader_View;

    Acme.WeatherHeader_View.prototype.renderLocal = function()
    {
        var country = localStorage.getItem("weather-country"); 
        var local = this.localdata[0];
        var name = local.location.split('/')[1];
        console.log(country);
        if (!country){
            var weatherTmp = Handlebars.compile(this.templates.weatherSelect);
        } else {
            var weatherTmp = Handlebars.compile(this.templates.localWeather);
        }
        var temp = local.temperature;
        if  (localStorage.getItem('temp-scale') == 'F') {
            temp = (local.temperature * 1.8) + 32;
        }
        this.container.html(
            weatherTmp( {
                "name": name + '-local', 
                "icon": local.icon,
                "location": name,
                "description" : local.description,
                "temp" : Math.round(temp)
            }
        ));
        if (!country){
            return this.renderNational();
        }
    };
    Acme.WeatherHeader_View.prototype.renderNational = function()
    {
        var country = localStorage.getItem("weather-country");
        var self = this;
        var local = this.localdata[0];
        var national = this.nationaldata;
        var dropdown = Handlebars.compile(this.templates.dropdown); 
        var weatherPanel = Handlebars.compile(this.templates.weatherPanel);

        if (!country){

        } else {
            $('.show-weather').toggleClass('flip');
            $('.weather-dropdown').toggleClass('hidden')
                                  .html(dropdown({'date': local.date}));
        
        
            national.forEach(function(l) {
                var name = l.location.split('/')[1];
                var temp = l.temperature;

                if  (localStorage.getItem('temp-scale') == 'F') {
                    temp = (l.temperature * 1.8) + 32;
                }
                $('#panel-containter').append(
                    weatherPanel({
                        "name" : name,
                        "icon": l.icon,
                        "location": name,
                        "description" : l.description,
                        "temp" : Math.round(temp)
                    }
                ));
            });
        }

        $('#default_weather').unbind().on('click', function(e) {
            var countries = ['Australia','New Zealand','United Kingdom','USA', 'Canada', 'Europe', 'Caribbean']

            Acme.SigninView.render("default_weather", "Select default weather location");
            if (localStorage.getItem("weather-country")) {
                var locations = new Acme.Locations(localStorage.getItem("weather-country"));
                if (locations.regional[0] !=  locations.data[0] ) {
                    var locations = locations.data.concat(locations.regional);
                
                } else {
                    locations = locations.data;
                }
                    
                Acme.CountrySelector = new Acme.listMenu({
                    'parent'        : $('#country-dropdown'),
                    'list'          : countries,
                    'class'         : 'country-pulldown u-margin-bottom-30 default-weather__pulldown',
                    'defaultSelect' : {"label": localStorage.getItem("weather-country")},
                    'name'          : 'country-weather',
                    'key'           : 'country'
                }).init().render();

                Acme.WeatherSelector = new Acme.listMenu({
                    'parent'        : $('#weather-dropdown'),
                    'list'          : locations.map(function(l) {
                        return l.split('/')[1].replaceAll('%20', ' ');
                    }),
                    'class'         : 'weather-pulldown u-no-margin-top default-weather__pulldown',
                    'defaultSelect' : {"label": 'Select city'},
                    'name'          : 'city-weather',
                    'key'           : 'city'
                }).init().render();
            } else {
                Acme.CountrySelector = new Acme.listMenu({
                    'parent'        : $('#country-dropdown'),
                    'list'          : countries,
                    'class'         : 'country-pulldown u-margin-bottom-30 default-weather__pulldown',
                    'defaultSelect' : {"label": 'Select country'},
                    'name'          : 'country-weather',
                    'key'           : 'country'
                }).init().render();
            }

            $('#country-weather > .Acme-pulldown__list > li').on('click', function(e) {
                var countrySelect = this.innerText;
                // console.log(this,countrySelect);
                localStorage.setItem('weather-country', countrySelect);
                var locations = new Acme.Locations(localStorage.getItem("weather-country"));
                if (locations.regional[0] !=  locations.data[0] ) {
                    var locations = locations.data.concat(locations.regional);
                
                } else {
                    locations = locations.data;
                }
               $('.weather-pulldown').remove(); 
                Acme.WeatherSelector = new Acme.listMenu({
                    'parent'        : $('#weather-dropdown'),
                    'list'          : locations.map(function(l) {
                        return l.split('/')[1].replaceAll('%20', ' ');
                    }),
                    'class'         : 'weather-pulldown u-no-margin-top default-weather__pulldown',
                    'defaultSelect' : {"label": 'Select city'},
                    'name'          : 'city-weather',
                    'key'           : 'city'
                }).init().render();

                $('#city-weather > .Acme-pulldown__list > li').on('click', function(e) {
                    var locations = new Acme.Locations(localStorage.getItem("weather-country"));
                    var citySelect = this.innerText;
                    var citySet = Acme.State.Country + '/' + citySelect.replaceAll(' ', '%20');
                    localStorage.setItem('city', citySet);
                });

            });

            $('#city-weather > .Acme-pulldown__list > li').on('click', function(e) {
                var locations = new Acme.Locations(localStorage.getItem("weather-country"));
                var citySelect = this.innerText;
                var citySet = Acme.State.Country + '/' + citySelect.replaceAll(' ', '%20');
                localStorage.setItem('city', citySet);
            });
            
            
        });



        $('#scale_weather').on('click', function(e) {
            if (localStorage.getItem('temp-scale') != 'F') {
                localStorage.setItem('temp-scale', 'F'); 
            } else {
                localStorage.setItem('temp-scale', 'C');
            }
            location.reload();
        });             
    };
    Acme.WeatherHeader_View.prototype.events = function()
    {
        var self = this;
        this.container.on("click", function (e) {
            Acme.PubSub.publish("update_state", {"nationalweather": self.locations.data.join(',')})
        });
    };




    Acme.WeatherScreen_View = function(config)
    {
        this.container = config.container || null;
        this.locations = config.locations || null;

        this.subscriptions = Acme.PubSub.subscribe({
            'Acme.weather_screen_view.listener' : ["state_changed"]
        });
        this.listeners = {
            "localweather" : function(data) {
                this.localdata = data.localweather.data;
                return this.render();
            },
            "nationalweather" : function(data) {
                this.nationaldata = data.nationalweather.data;
                return this.render();
            }
        };
        this.template = '<div id="location" class="location"> \
                            <p id="city" class="city">{{city}}</p> \
                            <p id="country" class="country">{{country}}</p> \
                        </div> \
                        <div id="temp" class="temp">{{temp}}&deg;</div>';
    };

    Acme.WeatherScreen_View.prototype = new Acme._View();
    Acme.WeatherScreen_View.constructor = Acme.WeatherScreen_View_Class;

    Acme.WeatherScreen_View.prototype.render = function()
    {
        var local = this.localdata[0];
        var name = local.location.split('/')[1];
        var weatherTmp = Handlebars.compile(this.template);
        var temp = local.temperature;
        if  (localStorage.getItem('temp-scale') == 'F') {
            temp = (local.temperature * 1.8) + 32;
        }
        this.container.html(
            weatherTmp( {
                "city": name,
                "country" : local.description,
                "temp" : Math.round(temp)
            }
        ));
    };




}(jQuery));