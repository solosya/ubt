// Create a Stripe client
if ($('#stripekey').length) {
var stripekey = $('#stripekey').html();
console.log(stripekey)

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
form.addEventListener('submit', function(event) {
    event.preventDefault();
    var userdata = $('#listingForm').serializeArray();
    console.log(userdata);
    $.each(userdata, function(i, val) {
        //userdata.append(val.name, val.value);
        if (val.value == '') {
            $('#card-errors').text('Please fill out the '+ val.name + ' field.');
        }
    });
    if ( $('#password').val() !== $('#verifypassword').val() ) {
        $('#card-errors').text('Password fields do not match.');
    }


    stripe.createToken(card).then(function(result) {
        if (result.error) {
            // Inform the user if there was an error
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            // Send the token to your server
            console.log(result);
            formhandler(result.token, userdata);
        }
    });
});


var formhandler = function(stripeToken, formdata) {
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
        url: _appJsConfig.appHostName + '/auth/paywall-signup',
        type: 'post',
        data: formdata,
        dataType: 'json',
        success: function(data){

            if(data.success) {
                console.log('success')
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




} 