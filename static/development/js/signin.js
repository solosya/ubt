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
    $('.message').toggleClass('hide');
};
Acme.Signin.prototype.handle = function(e) {
    var self = this;
    var $elem = this.parent.handle.call(this, e);
    if ( $elem.is('a') ) {
        if ($elem.hasClass('close')) {
            $('body').removeClass("active");
            console.log('removing active');
            this.closeWindow();
        }
    }
    if ($elem.is('button')) {
        if ($elem.hasClass('signin')) {
            e.preventDefault();
            var formData = {};
            console.log($elem);
            $.each($('#loginForm').serializeArray(), function () {
                formData[this.name] = this.value;
            });
            console.log(formData);
            Acme.server.create('/api/auth/login', formData).done(function(r) {
                console.log(r);
                if (r.success === 1) {
                    console.log(location);
                    window.location.href = location.origin;
                    // location.reload();
                } else {
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
    "expired"  : 'expiredNotice'
}
var signin = new Acme.Signin('modal', '#signin', layouts);



$('#header_login_link').on('click', function() {
    $('body').addClass('active');
    signin.render("signin", "Sign in");
});

$('a.register').on('click', function(e) {
    e.preventDefault();
    $('body').addClass('active');
    signin.render("register", "Register your interest");
});






}(jQuery));