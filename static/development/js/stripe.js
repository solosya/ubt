// Create a Stripe client
if ($('#stripekey').length) {
var stripekey = $('#stripekey').html();
console.log(stripekey)

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
var form = document.getElementById('payment-form');
if (form != null) {
form.addEventListener('submit', function(event) {
    event.preventDefault();

    $('#card-errors').text('');
    var userdata = $('#listingForm').serializeArray();

    $.each(userdata, function(i, val) {

        if (val.value == '') {
            $('#card-errors').text('Please fill out the '+ val.name + ' field.');
            return;
        }
    });
    if ( $('#password').val() !== $('#verifypassword').val() ) {
        $('#card-errors').text('Password fields do not match.');
        return;
    }

    // modal.render("spinner", "Authorising payment");
    stripe.createToken(card).then(function(result) {
        if (result.error) {
            // modal.closeWindow();
            // Inform the user if there was an error
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            // Send the token to your server
            console.log(result);
            formhandler(result.token, userdata, '/auth/paywall-signup');
        }
    });
});
}


var formhandler = function(stripeToken, formdata, path) {
    var csrfToken = $('meta[name="csrf-token"]').attr("content");
    console.log(formdata);
    console.log(csrfToken);
    console.log(_appJsConfig.baseHttpPath);
    console.log(_appJsConfig);
    console.log(stripeToken);
    var token = new Object();
    token['name'] = 'stripetoken';
    token['value'] = stripeToken.id;
    formdata.push(token);
    console.log(formdata);
    $.ajax({
        url: _appJsConfig.appHostName + path,
        type: 'post',
        data: formdata,
        dataType: 'json',
        success: function(data){

            if(data.success) {
                console.log('success')
                $('#card-errors').text('Completed successfully.');
            } else {

                console.log(data)
                console.log(data.error)
                var text = ''
                for (var key in data.error) {
                    text = text + data.error[key] + " ";
                } 
                $('#card-errors').text(text);
            }   
        },
        error: function(data){
            console.log('fail'); 
            console.log(data);   
        }
    });

}



var udform = document.getElementById('update-form');
console.log(udform)
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
            console.log(result);
            formhandler(result.token, [], '/user/update-payment-details');
        }
    });
});
}




} 