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

        // self.data['login'] = false;
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

                    formhandler(subscribe.data, '/auth/paywall-signup').done( function(r) {
                        console.log(r);
                        var clientSecret = typeof r.client_secret !== 'undefined' && r.client_secret ? r.client_secret : null;
                        if (!clientSecret || r.error) {
                            return false;
                        }
        
                        modal.render("spinner", "Authorising payment");
                        if (!r.trial) {
                            self.paymentIntent(clientSecret, card);
                        } else {
                            self.setupIntent(clientSecret, card);
                        }
                    });
                }
            });    

            
            
            
        }
    };

    
    SubscribeForm.prototype.paymentIntent = function(clientSecret, card) {
        var self = this;

        stripe.confirmCardPayment(clientSecret, {
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
        }).then(function(result) {
            console.log(result);
            if (result.error) {
                console.log(result.error.message);
                console.log("redirecting to profile page")
                window.location.href = location.origin + "/user/edit-profile?signup=true";

            } else {

                // The payment has been processed!
                if (result.paymentIntent.status === 'succeeded') {
                    console.log('IT WORKED!!!');
                    window.location.href = location.origin + "/auth/thank-you";
                }
            }
        });
    }
    SubscribeForm.prototype.setupIntent = function(clientSecret, card) {
        var self = this;
        console.log("confirming card SETUP");
        stripe.confirmCardSetup(clientSecret,
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
          ).then(function(result) {
            if (result.error) {
                console.log(result);
                console.log(result.error.message);
                console.log("redirecting to profile page");
                window.location.href = location.origin + "/user/edit-profile?signup=true";
            } else {
              // The setup has succeeded. Display a success message.
              console.log('IT WORKED!!!');
              window.location.href = location.origin + "/auth/thank-you";

            }
          });
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
                console.log('submitting');
                self.submit(event);
            });
        }


    };

    var subscribe = new SubscribeForm();








    var formhandler = function(formdata, path) {
        var csrfToken = $('meta[name="csrf-token"]').attr("content");

        return $.ajax({
            url: _appJsConfig.appHostName + path,
            type: 'post',
            data: formdata,
            dataType: 'json',
            success: function(data) {
                console.log('success');
                if(data.success) {
                    $('#card-errors').text('Account created...');

                } else {
                    modal.closeWindow();
                    var text = ''
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



    var udform = document.getElementById('update-card-form');

    if (udform != null) {

        udform.addEventListener('submit', function(event) {
            event.preventDefault();
             $('#card-errors').text('');
            stripe.createToken(card).then(function(result) {
                if (result.error) {
                    // Inform the user if there was an error
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server

                    formdata = {"stripetoken":result.token.id}
                    formhandler(formdata, '/user/update-payment-details');
                }
            });
        });
    }
} 