// Create a Stripe client
if ($('#stripekey').length > 0) {


    var stripekey = $('#stripekey').html();


    var modal = new Acme.Signin('spinner', 'acme-dialog', {"spinner": 'spinnerTmpl'});

    var stripe = Stripe(stripekey);

    // Create an instance of Elements
    var elements = stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
        base: {
            color: '#32325d',
            lineHeight: '24px',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };

    // Create an instance of the card Element
    var card = elements.create('card', {style: style});

    // Add an instance of the card Element into the `card-element` <div>
    var cardElement = document.getElementById('card-element');
    if (cardElement != null) {
        card.mount('#card-element');
    }

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function(event) {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    }); 

    // Handle form submission

    var SubscribeForm = function() {
        this.data = {
            "country_id" : null,
        };

        this.errorFields = [];

        this.validateRules = {
            // "username"      : ["notEmpty"], 
            "firstname"     : ["notEmpty"], 
            "lastname"      : ["notEmpty"], 
            "email"         : ["notEmpty"],
            "address1"      : ["notEmpty"],
            "trial"         : [],
            "country_id"    : ['notEmpty'],
            "terms"         : ["isTrue"],
            "postcode"      : ["notEmpty"],
            "city"          : ["notEmpty"]
        };

        this.validateFields = Object.keys(this.validateRules);

        this.events();

        // this.data['trial'] = $('#trial').is(":checked");
        var trial = $('#trial').val();
        if (trial == 1) {
            this.data['trial'] = 'true';
            this.validateRules['changeterms'] = ["isTrue"];
            this.validateRules['cancelterms'] = ["isTrue"];
        }

        this.validateFields = Object.keys(this.validateRules);

        this.addMenu();
    };

    SubscribeForm.prototype = new Acme.Form(Acme.Validators);
    SubscribeForm.constructor = SubscribeForm;
    SubscribeForm.prototype.listeners =  {
        "country" : function(data) {
            this.data.country_id = data.country_id || null;
            var validated = this.validate(['country_id']);
            this.render();
        }
    };
    SubscribeForm.prototype.render = function(checkTerms) 
    {
        this.clearInlineErrors();
        this.addInlineErrors();
        if (checkTerms) {
            if (!this.data.terms || (this.data.trial === 'true' && (!this.data.cancelterms || !this.data.changeterms))) {
                this.confirmView = new Acme.Confirm('modal', 'signin', {'terms': 'subscribeTerms'});
                this.confirmView.render("terms", "Terms of use");
            }
        }
    };
    SubscribeForm.prototype.addMenu = function(event) 
    {

        this.menu = new Acme.listMenu({
            'parent'        : $('#countrySelect'),
            'defaultSelect' : {"label": 'Select Country'},
            'name'          : 'country_id',
            'key'           : 'country_id',
            'allowClear'    : true,
            'callback'      : this.listeners.country.bind(this),
            'list'   : [ 
                {'label': "Argentina",      'value' : 10},
                {'label': "Australia",      'value' : 13},
                {'label': "Barbados",       'value' : 18},
                {'label': "Canada",         'value' : 38},
                {'label': "Denmark",        'value' : 59},
                {'label': "France",         'value' : 75},
                {'label': "Germany",        'value' : 57},
                {'label': "Ireland",        'value' : 102},
                {'label': "Italy",          'value' : 110},
                {'label': "Jamaica",        'value' : 112},
                {'label': "Netherlands",    'value' : 166},
                {'label': "New Zealand",    'value' : 171},
                {'label': "Saint Vincent \
                           and the \
                           Grenadines",     'value' : 237},
                {'label': "Spain",          'value' : 68},
                {'label': "Sweden",         'value' : 197},
                {'label': "Switzerland",    'value' : 43},
                {'label': "Trinidad and \
                           Tobago",         'value' : 226},
                {'label': "UK",             'value' : 77},
                {'label': "US",             'value' : 233},
                {'label': "Other",          'value' : -1},
            ],
        }).init().render();
    };
    SubscribeForm.prototype.submit = function(event) 
    {
        var self = this;
        event.preventDefault();
        var validated = self.validate();
        self.render(true);
        if (!validated) {
            return;
        }
        $('#card-errors').text('');
        if ( $('#password').val() !== $('#verifypassword').val() ) {
            $('#card-errors').text('Password fields do not match.');
            return;
        }



        self.data['paymentIntent'] = true;
        self.data['redirect'] = false;

        
        if (!this.data['username']) {
            this.data['username'] = Math.floor(100000000 + Math.random() * 90000000000000);
        }
        if ($("#code-redeem").length > 0){
            modal.render("spinner", "Authorising code");
            subscribe.data['planid'] = $('#planid').val();
            subscribe.data['giftcode'] = $('#code-redeem').val();
            formhandler(subscribe.data, '/auth/paywall-signup');
        } else {
            subscribe.data['planid'] = $('#planid').val();
            
            // tokens are no longer needed, however running createToken() will alert card errors,
            // and stop the sign up process from continuing. 
            stripe.createToken(card).then(function(result) {
                if (result.error) {
                    modal.closeWindow();
                    // Inform the user if there was an error
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    modal.render("spinner", "Creating account");
                    
                    var usingCaptcha = false;
                    if (typeof window.Acme.captcha_site_key !== 'undefined') {
                        usingCaptcha = true;
                        grecaptcha.ready(function() {
                            grecaptcha.execute(window.Acme.captcha_site_key, {action: 'submit'}).then(function(token) {
                                subscribe.data['g-recaptcha-response'] = token;
                                self.submitForm(subscribe.data, modal);
                            });
                        });
                    }
            

                    if (!usingCaptcha) {
                        self.submitForm(subscribe.data, modal);
                    }
                }
            });
        }
    };

    
    SubscribeForm.prototype.paymentIntent = function(clientSecret, card) {
        var self = this;

        return stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    address: {
                        city:self.data.city,
                        line1:self.data.address1,
                        line2:self.data.address2,
                    },
                    name: self.data.firstname + " " + self.data.lastname,
                    email: self.data.email
                }
            },
            setup_future_usage: 'off_session'
        });
    }


    SubscribeForm.prototype.setupIntent = function(clientSecret, card) {
        var self = this;

        return stripe.confirmCardSetup(clientSecret,
            {
              payment_method: {
                card: card,
                billing_details: {
                    address: {
                        city:self.data.city,
                        line1:self.data.address1,
                        line2:self.data.address2,
                    },
                    name: self.data.firstname + " " + self.data.lastname,
                    email: self.data.email
                }
              },
            }
        )
    }

    SubscribeForm.prototype.events = function()
    {
        var self = this;
        $('input, textarea').on("change", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var data = {};
            var elem = $(e.target);
            var elemid = elem.attr('name');
            var inputType = elem.attr('type');

            if (inputType == 'text' || inputType == 'email' || inputType == 'password') {
                data[elemid] = elem.val();
            } else if (inputType =='checkbox') {
                data[elemid] = elem.is(":checked");
            }

            self.updateData(data);
            var validated = self.validate([elemid]);
            self.render();
        });

        var form = document.getElementById('payment-form');

        if (form != null) {
            form.addEventListener('submit', function(event) {
                self.submit(event);
            });
        }


    };

    var subscribe = new SubscribeForm();



    SubscribeForm.prototype.submitForm = function(formdata, modal) {
        var self = this;
        var profilePage = location.origin + "/user/edit-profile";
        var thankYouPage = window.location.origin + "/auth/thank-you";

        var idempotency_key = $("#idempotency_key").html();
        if (typeof idempotency_key !== "undefined" && idempotency_key != "") {
            self.data["idempotency_key"] = idempotency_key; // Duplicate Request Prevent
        }

        formhandler(formdata, '/auth/paywall-signup').done( function(r) {
            var clientSecret = typeof r.client_secret !== 'undefined' && r.client_secret ? r.client_secret : null;
            if (!clientSecret || r.error) {
                return false;
            }

            modal.render("spinner", "Authenticating payment");
            if (!r.trial) {
                self.paymentIntent(clientSecret, card).then(function(result) {
                    if (result.error) {
                        window.location.href = profilePage;
                    } else {
                      // The setup has succeeded. Display a success message.
                      window.location.href = thankYouPage;
        
                    }
                });
            } else {
                self.setupIntent(clientSecret, card).then(function(result) {
                    if (result.error) {
                        window.location.href = profilePage;
                    } else {
                      // The setup has succeeded. Display a success message.
                      window.location.href = thankYouPage;
        
                    }
                });
            }
        });

    };



    var formhandler = function(formdata, path) {


        return $.ajax({
            url: _appJsConfig.appHostName + path,
            type: 'post',
            data: formdata,
            dataType: 'json',
            success: function(data) {
                if(data.success) {
                    $('#card-errors').text('Completed successfully.');

                } else {
                    modal.closeWindow();
                    var text = '';

                    if (!Object.prototype.toString.call(data.error) === '[object Array]') {
                        var err = {
                            "error": data.error
                        };
                        data.error = err;
                    };
                    for (var key in data.error) {
                        text = text + data.error[key] + " ";
                    } 
                    $('#card-errors').text(text);
                }   
                modal.closeWindow();

            },
            error: function(data) {
                modal.closeWindow();
            }
        });

 
    }


    var random = function(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    var udform = document.getElementById('update-card-form');
    if (udform != null) {

        udform.addEventListener('submit', function(event) {
            event.preventDefault();
            modal.render("spinner", "Updating card details...");
             $('#card-errors').text('');

             var submitbutton = $('button[type="submit"]');
             submitbutton.prop('disabled', true);
             
            stripe.createToken(card).then(function(result) {
                if (result.error) {
                    modal.closeWindow();

                    // Inform the user if there was an error
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                    submitbutton.prop('disabled', false);
                } else {
                    // Send the token to your server

                    formdata = {"stripetoken":result.token.id, "uitoken": "ui." + random(8)};
                    var idempotency_key = $("#idempotency_key").html();
                    if (typeof idempotency_key !== "undefined" && idempotency_key != "") {
                        formdata["idempotency_key"] = idempotency_key; // Duplicate Request Prevent
                    }
                    formhandler(formdata, '/user/update-payment-details').then(function(r) {
                        modal.closeWindow();
                        // console.log(r);
                        if (r.success === 1) {
                            cardElement.remove();
                            submitbutton.hide();
                        } else {
                            submitbutton.prop('disabled', false);
                        }
                    });

                }
            });
        });
    }
} 