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
    card.mount('#card-element');

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

        };

        this.errorFields = [];

        this.validateRules = {
            "username"  : ["notEmpty"], 
            "firstname" : ["notEmpty"], 
            "lastname"  : ["notEmpty"], 
            "email"     : ["notEmpty"],
            "phone_no"  : ["notEmpty"],
            "address1"  : ["notEmpty"],
            "suburb"    : ["notEmpty"],
            "state"     : ["notEmpty"],
            "trial"     : [],
            "terms"     : ["isTrue"],
            "postcode"  : ["notEmpty", "isNumeric"]
        };

        this.validateFields = Object.keys(this.validateRules);

        this.events();

        this.data['trial'] = $('#trial').is(":checked");

    };

    SubscribeForm.prototype = new Acme.Form(Acme.Validators);
    SubscribeForm.constructor = SubscribeForm;
    SubscribeForm.prototype.render = function(checkTerms) 
    {
        this.clearInlineErrors();
        this.addInlineErrors();
        if (checkTerms) {
            if (!this.data.terms) {
                this.confirmView = new Acme.Confirm('modal', 'signin', {'terms': 'subscribeTerms'});
                this.confirmView.render("terms", "Terms of use");
            }
        }
    };


    SubscribeForm.prototype.submit = function(event) 
    {

        console.log('submit?');

        var self = this;
        event.preventDefault();
        var validated = self.validate();
        console.log('validate?');
        self.render(true);
        console.log(validated);
        if (!validated) return;
        console.log('validated');

        $('#card-errors').text('');
        // var userdata = $('#listingForm').serializeArray();
        // console.log(userdata);
        // console.log(self.data);
        // $.each(userdata, function(i, val) {

        //     if (val.value == '') {
        //         $('#card-errors').text('Please fill out the '+ val.name + ' field.');
        //         return;
        //     }
        // });
        if ( $('#password').val() !== $('#verifypassword').val() ) {
            $('#card-errors').text('Password fields do not match.');
            return;
        }
        console.log('password good');

        modal.render("spinner", "Authorising payment");
        stripe.createToken(card).then(function(result) {
            if (result.error) {
                modal.closeWindow();
                // Inform the user if there was an error
                var errorElement = document.getElementById('card-errors');
                errorElement.textContent = result.error.message;
            } else {
                // Send the token to your server
                subscribe.data['stripetoken'] = result.token.id;
                subscribe.data['planid'] = $('#planid').val();
                formhandler(subscribe.data, '/auth/paywall-signup');
            }
        });    
    };
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








    var formhandler = function(formdata, path) {
        var csrfToken = $('meta[name="csrf-token"]').attr("content");

        $.ajax({
            url: _appJsConfig.appHostName + path,
            type: 'post',
            data: formdata,
            dataType: 'json',
            success: function(data) {

                if(data.success) {
                    $('#card-errors').text('Completed successfully.');
                } else {
                    modal.closeWindow();

                    var text = ''
                    for (var key in data.error) {
                        text = text + data.error[key] + " ";
                    } 
                    $('#card-errors').text(text);
                }   
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