(function ($) {


Acme.Signin = function(template, parent, layouts) {
    this.template = template;
    this.parentCont = parent;
    this.layouts = layouts;
    this.parent = Acme.modal.prototype;
};
Acme.Signin.prototype = new Acme.modal();
Acme.Signin.constructor = Acme.Signin;
Acme.Signin.prototype.errorMsg = function(msg) {
    $('.message').removeClass('hide');
};
Acme.Signin.prototype.handle = function(e) {
    var self = this;
    var $elem = this.parent.handle.call(this, e);

    if ( $elem.is('a') ) {
        if ($elem.hasClass('close')) {
            e.preventDefault();
            $('body').removeClass("active");
            this.closeWindow();
        }
    }
    if ($elem.is('button')) {
        $('.message').addClass('hide');
        if ($elem.hasClass('signin')) {
            $elem.text('')
                 .addClass('spinner');
            e.preventDefault();
            var formData = {};

            $.each($('#loginForm').serializeArray(), function () {
                formData[this.name] = this.value;
            });
            // rememberMe sets flag to store login for 30 days in cookie
            formData['rememberMe'] = 1;
            Acme.server.create('/api/auth/login', formData).done(function(r) {

                if (r.success === 1) {
                    window.location.href = location.href;

                } else {
                    $elem.text("Sign in")
                         .removeClass('spinner');
                    self.errorMsg();
                }
            }).fail(function(r) { console.log(r);});
        }


        if ($elem.hasClass('register')) {
            e.preventDefault();
            var formData = {};
            $.each($('#registerForm').serializeArray(), function () {
                formData[this.name] = this.value;
            });

            if (formData['email'] !== '' && formData['name'] !== ''){
                $.get( 'https://submit.pagemasters.com.au/ubt/submit.php?email='+encodeURI(formData['email'])+'&name='+encodeURI(formData['name']) );
                $elem.addClass('spinner');
                function close() {
                    self.closeWindow();
                    self.render('userPlan', "Thank you for registering.");

                };
                setTimeout(close, 2000);

            } else {
                alert ("Please fill out all fields.");
            }
        }


        if ($elem.hasClass('forgot')) {
            e.preventDefault();
            var formData = {};
            $.each($('#forgotForm').serializeArray(), function () {
                formData[this.name] = this.value;
            });

            Acme.server.create('/api/auth/forgot-password', formData).done(function(r) {
                if (r.success === 1) {
                    location.reload();
                } else {
                    self.errorMsg();
                }

            }).fail(function(r) { console.log(r);});
        }

        if ($elem.hasClass('default-weather')) {
            var newDefault = Acme.State.Country + '/' + Acme.State.City;

            localStorage.setItem('city', newDefault);
            function close() {

                Acme.PubSub.publish("update_state", {'localweather': newDefault });                

                self.closeWindow();
            };
            setTimeout(close, 500);            
        }     


        if ($elem.hasClass('close')) {
            $('body').removeClass("active");
            this.closeWindow();
        }
   

    }
    if ($elem.hasClass('layout')) {
        var layout = $elem.data('layout');
        this.renderLayout(layout);
    }



};

var layouts = {
    "signin"   : 'signinFormTmpl',
    "register" : 'registerTmpl',
    "forgot"   : 'forgotFormTmpl',
    "expired"  : 'expiredNotice',
    "default_weather" : 'defaultWeatherTmpl',
    "userPlan" : 'userPlanMessage',
    "userPlanChange" : 'userPlanOkCancel',
    "spinner": 'spinnerTmpl'
}
Acme.SigninView = new Acme.Signin('modal', 'signin', layouts);


$('#header_login_link').on('click', function() {
    Acme.SigninView.render("signin", "Sign in");
});
$('#body_login_link').on('click', function() {
    Acme.SigninView.render("signin", "Sign in");
});

$('a.j-register').on('click', function(e) {
    e.preventDefault();
    Acme.SigninView.render("register", "Register your interest");
});




}(jQuery));