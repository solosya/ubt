(function ($) {

    Acme.Clock = function() {
        this.date = new Date();
        this.datetime = this.date.toISOString().substring(0, 16);
        this.monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        this.dayNames = [
            "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday", "Sunday"
        ];
    };
    // Acme.Signin.prototype = {};
    // Acme.Signin.constructor = Acme.Signin;
    Acme.Clock.prototype.formatTo12hrTime = function() 
    {
      var hours = this.date.getHours();
      var minutes = this.date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0'+minutes : minutes;
      return hours + '.' + minutes + ampm;
    };


    Acme.Clock.prototype.formatDate = function() 
    {
        var day = this.date.getDate();
        var daystring = this.dayNames[this.date.getDay()];
        var monthIndex = this.date.getMonth();
        var year = this.date.getFullYear();
        var time = this.formatTo12hrTime(this.date);
        var output = [day, this.monthNames[monthIndex], year, time];
                    // 4   JULY                    2017  4:32PM 
        return output.join(' ');
    }

    
    Acme.Clock.prototype.render = function()
    {
        var field = document.getElementById('screentime');
        if (field) {
            field.setAttribute('datetime', this.datetime);
            field.innerHTML = this.formatDate();
        }
    }


}(jQuery));