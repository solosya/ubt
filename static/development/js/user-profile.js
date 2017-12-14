
var UserProfielController = (function ($) {
    return {
        load: function () {
            UserProfielController.Load.init();
        }
    };
}(jQuery));

UserProfielController.Load = (function ($) {
    var csrfToken = $('meta[name="csrf-token"]').attr("content");

    var attachEvents = function () {
          console.log('events!');

        $('#addManagedUser').on('click', function(e) {
            console.log('add user');
            e.preventDefault()
            var userTemp = Handlebars.compile(window.templates.managed_user);
            var data = {
                firstname: "FIRSTNAME", 
                lastname:  "LASTNAME", 
                username:  "USERNAME", 
                useremail: "EMAIL"
            };

            var html = '<li id="newUser">' + userTemp(data) + '</li>';

            $('#mangedUsers').append(html);
            $('#addManagedUser').addClass('hidden');
            $('#nousers').addClass('hidden');
            
            $('#createUser').on('click', function(e) {
                var requestData = { 
                    firstname: $('#newuserfirstname').val(), 
                    lastname:  $('#newuserlastname').val(), 
                    username:  $('#newuserusername').val(), 
                    useremail: $('#newuseruseremail').val(),
                    _csrf: csrfToken
                };

                console.log(requestData);

                $.ajax({
                    type: 'post',
                    url: _appJsConfig.baseHttpPath + '/user/create-paywall-managed-user',
                    dataType: 'json',
                    data: requestData,
                    success: function (data, textStatus, jqXHR) {
                        console.log(data);
                        if (data.success == 1) {
                            location.reload(false);             
                        } else {
                            var text = '';
                            for (var key in data.error) {
                                text = text + data.error[key] + " ";
                            } 
                            $('#createUserErrorMessage').text(text);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus);
                        console.log(jqXHR.responseText);
                         $('#createUserErrorMessage').text(textStatus);
                    },
                });        
            });

            $('#cancelUserCreate').on('click', function(e) {
                $('#newUser').remove();
                $('#addManagedUser').removeClass('hidden');
                $('#createUserErrorMessage').text('');
            });

        });

        $('.userdetails__edit').on('click', function(e) {
            var listelem = $(e.target).closest('li');
            var data = {
                firstname: listelem.find('.j-firstname').text(), 
                lastname:  listelem.find('.j-lastname').text(), 
                username:  listelem.find('.userdetails__username').text(), 
                useremail: listelem.find('.userdetails__email').text(),
            };
            console.log(data);
            var userTemp = Handlebars.compile(window.templates.managed_user);
            var html = userTemp(data);
            listelem.empty().append(html);
            // $('#mangedUsers').append($(user));
            // $('#addManagedUser').addClass('hidden');
            // $('#nousers').addClass('hidden');



            // listelem.find('.edituser').addClass('hidden');
            // listelem.find('.deleteuser').addClass('hidden');
            // listelem.find('.saveedit').removeClass('hidden');
            // listelem.find('.canceledit').removeClass('hidden');

            // listelem.find('#muFirstname').addClass('edituserfield');
            // listelem.find('#muLastname').addClass('edituserfield');
            // listelem.find('#muUsername').addClass('edituserfield');
            // listelem.find('#muEmail').addClass('edituserfield');
        });        

        $('.canceledit').on('click', function(e) {
            var listelem = $(e.target).closest('li');
            listelem.find('.edituser').removeClass('hidden');
            listelem.find('.deleteuser').removeClass('hidden');
            listelem.find('.saveedit').addClass('hidden');
            listelem.find('.canceledit').addClass('hidden');
            listelem.find('.reallydelete').addClass('hidden');


            listelem.find('#muFirstname').removeClass('edituserfield');
            listelem.find('#muLastname').removeClass('edituserfield');
            listelem.find('#muUsername').removeClass('edituserfield');
            listelem.find('#muEmail').removeClass('edituserfield');

            $('#createUserErrorMessage').text('');   
        });        


        $('.deleteuser').on('click', function(e) {
            var listelem = $(e.target).closest('li');
            listelem.find('.edituser').addClass('hidden');
            listelem.find('.deleteuser').addClass('hidden');
            listelem.find('.reallydelete').removeClass('hidden');
            listelem.find('.canceledit').removeClass('hidden');
            $('#createUserErrorMessage').text('');   
        });        

        $('.reallydelete').on('click', function(e) {
            var listelem = $(e.target).closest('li');
            var userid = listelem.attr("id");
            var requestData = { 
                id: listelem.attr("id"), 
                _csrf: csrfToken, 
            };

            $.ajax({
                type: 'post',
                url: _appJsConfig.baseHttpPath + '/user/delete-managed-user',
                dataType: 'json',
                data: requestData,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.success == 1) {
                        console.log('success');
                        location.reload(false);             
                    } else {
                        var text = '';
                        for (var key in data.error) {
                            text = text + data.error[key] + " ";
                        } 
                        $('#createUserErrorMessage').text(text);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(jqXHR.responseText);
                     $('#createUserErrorMessage').text(textStatus);
                },
            });        


        });        

        $('#cancelAccount').on('click', function(e) {
            var listelem = $(e.target).closest('li');
            var userid = listelem.attr("id");
            var requestData = { 
                status: 'cancelled', 
                _csrf: csrfToken, 
            };

            $.ajax({
                type: 'post',
                url: _appJsConfig.baseHttpPath + '/user/paywall-account-sataus',
                dataType: 'json',
                data: requestData,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.success == 1) {
                        console.log('success');
                        location.reload(false);             
                    } else {
                        var text = '';
                        for (var key in data.error) {
                            text = text + data.error[key] + " ";
                        } 
                        $('#createUserErrorMessage').text(text);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(jqXHR.responseText);
                     $('#createUserErrorMessage').text(textStatus);
                },
            });        


        });        


        $('.saveedit').on('click', function(e) {
            console.log('clicks')
            var listelem = $(e.target).closest('li');
            var userid = listelem.attr("id");
            var firstname = listelem.find('#muFirstname').text();
            var lastname = listelem.find('#muLastname').text();
            var username = listelem.find('#muUsername').text();
            var email = listelem.find('#muEmail').text();

            var requestData = { 
                id: listelem.attr("id"), 
                firstname: listelem.find('#muFirstname').text(), 
                lastname: listelem.find('#muLastname').text(), 
                username: listelem.find('#muUsername').text(), 
                _csrf: csrfToken, 
                useremail: listelem.find('#muEmail').text()
            };

            $.ajax({
                type: 'post',
                url: _appJsConfig.baseHttpPath + '/user/edit-managed-profile',
                dataType: 'json',
                data: requestData,
                success: function (data, textStatus, jqXHR) {
                    console.log(data);
                    if (data.success == 1) {
                        console.log('success');
                        $('#createUserErrorMessage').text('');   
                        listelem.find('.edituser').removeClass('hidden');
                        listelem.find('.deleteuser').removeClass('hidden');
                        listelem.find('.saveedit').addClass('hidden');
                        listelem.find('.canceledit').addClass('hidden');

                        listelem.find('#muFirstname').removeClass('edituserfield');
                        listelem.find('#muLastname').removeClass('edituserfield');
                        listelem.find('#muUsername').removeClass('edituserfield');
                        listelem.find('#muEmail').removeClass('edituserfield');

                        $('#createUserErrorMessage').text('User updated successfully.'); 
                    } else {
                        var text = '';
                        for (var key in data.error) {
                            text = text + data.error[key] + " ";
                        } 
                        $('#createUserErrorMessage').text(text);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(jqXHR.responseText);
                     $('#createUserErrorMessage').text(textStatus);
                },
            });        

        });


        $('.j-setplan').on('click', function(e) {
            var listelem = $(e.target);
            var planusers = listelem.find('#planusercount').val();
            var usercount = listelem.find('#currentusers').val();

            var requestData = { 
                planid: listelem.find('#planid').val(), 
                _csrf: listelem.find('#_csrf').text(), 
            };

            console.log(requestData);



            if (usercount <= planusers) {
                // var newcost = listelem.find('#plancost').val();
                // var oldcost = listelem.find('#currentcost').val();
                // var newdays = listelem.find('#planperiod').val();
                // var olddays = listelem.find('#currentperiod').val();
                // if (newdays = 'week') {newdays = 7;}
                // if (newdays = 'month') {newdays = 30;}
                // if (newdays = 'year') {newdays = 365;}
                // if (olddays = 'week') {olddays = 7;}
                // if (olddays = 'month') {olddays = 30;}
                // if (olddays = 'year') {olddays = 365;}
                // var newplandailycost = newcost/newdays;
                // var plandailycost = oldcost/olddays;
                // var expDate = listelem.find('#expdate').val();
                // console.log(newplandailycost);
                // console.log(oldcost);
                // console.log(olddays);
                // console.log(expDate);
                // console.log(plandailycost);

                // var remainingplandays = 10;
                Acme.SigninView.render("userPlanChange", "Are you sure you want to change plan?");

                $('#okaybutton').on('click', function(e) {
                    $('#dialog').parent().remove();
                    
                    $.ajax({
                        type: 'post',
                        url: _appJsConfig.baseHttpPath + '/user/change-paywall-plan',
                        dataType: 'json',
                        data: requestData,
                        success: function (data, textStatus, jqXHR) {
                            console.log(data);
                            if (data.success == 1) {
                                window.location.reload();
                            } else {
                                //show some error somehow
                                $('#dialog').parent().remove();
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(textStatus);
                            console.log(jqXHR.responseText);
                             $('#createUserErrorMessage').text(textStatus);
                        },
                    });        

                });



            } else {
                Acme.SigninView.render("userPlan", "You have too many users to change to that plan.");
            }
            $('#cancelbutton').on('click', function(e) {
                $('#dialog').parent().remove();
                console.log('moo');
            });

        });




        
    };
    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));


