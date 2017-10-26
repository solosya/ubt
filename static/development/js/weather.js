(function ($) {


    Acme.Locations = function(){
        this.country = _appJsConfig.appHostName.split('.').reverse()[0];
        this.data = this.getLocations(this.country);
    };
    Acme.Locations.prototype.getLocations = function(country) 
    {
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
    };

    



    Acme.Weather = function()
    {
        this.subscriptions = Acme.PubSub.subscribe({
            'Acme.weather_model.listener' : ["update_state"]
        });
        this.listeners = {
            "localweather" : function(data) {
                return this.fetch(data['weather'], 'localweather');
            },
            "nationalweather" : function(data) {
                return this.fetch(data['nationalweather'], 'nationalweather');
            }
        };
    };
    Acme.Weather.prototype = new Acme._Model();
    Acme.Weather.constructor = Acme.Weather;
    Acme.Weather.prototype.fetch = function(location, view)
    {
        console.log('fetching', 'https://weather.pagemasters.com.au/weather?q=' + location);
        var self = this;

        Acme.server.fetch('https://weather.pagemasters.com.au/weather?q=' + location)
            .done(function(r) {
                console.log(r);
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
                console.log(data, 'nationalweather');
                this.nationaldata = data.nationalweather.data;
                return this.renderNational();
            }

        };
    };
    Acme.WeatherHeader_View_Class.prototype = new Acme._View();
    Acme.WeatherHeader_View_Class.constructor = Acme.WeatherHeader_View;


    Acme.WeatherHeader_View = function(config)
    {
        this.container = config.container || null;
        this.locations = config.locations || null;
        this.templates = {
            "dropdown" : 
                '<div class="weather-date">' + 
                    '<h1>Weather</h1>' + 
                    '<p>{{date}}</p>' + 
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
                    '<div class="icon weather-{{icon}}"></div>' + 
                    '<p class="temp">{{temp}}&#176;</p>' + 
                '</div>'
            ,
            "weatherPanel" : 
                '<div id="{{name}}-weather" class="panel visible-sm-block visible-md-block visible-lg-block">' +
                    '<div style="display: flex">' + 
                        '<div class="icon weather-{{icon}}"></div>' + 
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
    };
    Acme.WeatherHeader_View.prototype.events = function()
    {
        var self = this;
        this.container.on("click", function (e) {
            Acme.PubSub.publish("update_state", {"nationalweather": self.locations.data.join(',')})
        });
    };

}(jQuery));