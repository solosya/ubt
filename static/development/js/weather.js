(function ($) {

    Acme.Locations = function(){
        this.country = _appJsConfig.appHostName.split('.').reverse()[0];
        console.log(this.country);
        this.data = this.getLocations(this.country);
        console.log(this.data);
    };
    Acme.Locations.prototype.getLocations = function(country) 
    {
        switch (country) {
            case 'nz':
                Acme.State.Country = 'NZ';
                return [
                    'NZ/Auckland',
                    'NZ/Wellington',
                    'NZ/Nelson',
                    'NZ/Christchurch',
                    'NZ/Dunedin',
                    'NZ/Invercargill',
                    'NZ/Palmerston%20North',
                    'NZ/New%20Plymouth',
                ];
                break;
            default:
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
                    'Australia/Launceston',
                    'Australia/Albany',
                    'Australia/Darwin',
                    'Australia/Alice Springs',
                    'Australia/Mount Gambier',
                    'Australia/Cairns',
                    'Australia/Gympie',
                    'Australia/Newcastle',
                    'Australia/Wagga wagga',
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
                ];
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
            }
        };
    };
    Acme.Weather.prototype = new Acme._Model();
    Acme.Weather.constructor = Acme.Weather;
    Acme.Weather.prototype.fetch = function(location, view)
    {
        var self = this;
        Acme.server.fetch('https://weather.pagemasters.com.au/weather?q=' + location)
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
                    '<i id="default_weather">Set default city</i>' +
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
        };

        this.events();
    };
    Acme.WeatherHeader_View.prototype = new Acme.WeatherHeader_View_Class();
    Acme.WeatherHeader_View.constructor = Acme.WeatherHeader_View;

    Acme.WeatherHeader_View.prototype.renderLocal = function()
    {
        var local = this.localdata[0];
        var name = local.location.split('/')[1];
        var weatherTmp = Handlebars.compile(this.templates.localWeather); 
        this.container.html(
            weatherTmp( {
                "name": name + '-local', 
                "icon": local.icon,
                "location": name,
                "description" : local.description,
                "temp" : Math.round(local.temperature)
            }
        ));
    };
    Acme.WeatherHeader_View.prototype.renderNational = function()
    {
        var self = this;
        var local = this.localdata[0];
        var national = this.nationaldata;
        var dropdown = Handlebars.compile(this.templates.dropdown); 
        var weatherPanel = Handlebars.compile(this.templates.weatherPanel); 

        $('.show-weather').toggleClass('flip');
        $('.weather-dropdown').toggleClass('hidden')
                              .html(dropdown({'date': local.date}));
        
        national.forEach(function(l) {
            var name = l.location.split('/')[1];
            $('#panel-containter').append(
                weatherPanel({
                    "name" : name,
                    "icon": l.icon,
                    "location": name,
                    "description" : l.description,
                    "temp" : Math.round(l.temperature)
                }
            ));
        });

        $('#default_weather').on('click', function(e) {

            Acme.SigninView.render("default_weather", "Set default city");

            Acme.WeatherSelector = new Acme.listMenu({
                        'parent'        : $('#weather-dropdown'),
                        'list'          : self.locations.data.map(function(l) {
                            return l.split('/')[1];
                        }),
                        'defaultSelect' : {"label": 'Select default city'},
                        'name'          : 'city',
                        'key'           : 'city'
            }).init().render();            
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
            'Acme.weather_view.listener' : ["state_changed"]
        });
        this.listeners = {
            "localweather" : function(data) {
                this.localdata = data.localweather.data;
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
        this.container.html(
            weatherTmp( {
                "city": name,
                "country" : local.description,
                "temp" : Math.round(local.temperature)
            }
        ));
    };


}(jQuery));