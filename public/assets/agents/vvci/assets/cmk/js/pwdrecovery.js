var adFrame = true;
$('#username').focus();
$('#login_info').hide();
function CMK_reloadVerifyLang() {
    var language = $('#language').val();
    var newurl = base_url_ajax+"login/login_lang/?lang=" + language;
    $.ajax({
        url: newurl,
        type: "post",
        success: function(data_result) {
            window.location.href = base_url_ajax+'login/forgotpasswd?lang='+language
        }
    });
}


function checkLoginKey(e)
{
    //alert(e.keyCode);
    if ((e.keyCode == 192) && ($('#username').is(':focus'))){
        var loginValue=$('#username').val();
        $('#username').val(loginValue.substring(0, loginValue.length - 1));
        $( "#account" ).focus();
        $( "#account" ).select();
    }else{
        if (e.keyCode == 13) checkLogin();
    }
}




function checkLogin()
{


    //window.location.href = "dashboard/dashboard";

    
    var sDataForm = $('#login_form').serialize();
    return;
    $.ajax({
        url: base_url_ajax+"login/login_check", // override for form's 'action' attribute
        type: "post", // 'get' or 'post', override for form's 'method' attribute
        data: sDataForm + "&language=" + $('#language').val(),
        success: function(data_result) {
        	console.log(data_result);
        }
    });
}



$(document).ready(function() {

    $.formUtils.addValidator({
        name : 'custom_recaptcha',
        validatorFunction : function(value, $el, config, language, $form) {
            return grecaptcha.getResponse() != "";
        },
        errorMessage : lbl_bad_recaptcha,
        errorMessageKey: 'badRecaptcha'
    });



    var errors = [];
    var conf = {
        modules : 'security',
        form : '#login_form',
        lang : 'lang/fr',
        validateOnBlur : false
    };




    $.validate(conf);

    // $("#btn-confirm").click(function() {
    //     // reset error array
    //     errors = [];
    //     var lang = {
    //         badreCaptcha : lbl_bad_recaptcha
    //     };
    //     if( !$("#login_form").isValid(lang, conf, true) ) {
    //         console.log(errors);
    //         alert("KO");
    //         //displayErrors( errors );
    //     } else {
    //         alert("OK");
    //     }
    // })


})



