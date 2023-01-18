function validLoginForm() {
    var error = false;
    $('#login-email,#login-pass,#login-name').parent().removeClass('has-error');
    if (!checkEmail($('#login-email').val())) {
        error = true;
        $('#login-email').parent().addClass('has-error');
    }
    if ($('#login-pass').val().length < 4) {
        error = true;
        $('#login-pass').parent().addClass('has-error');
    }
    if ($('#login-name').length > 0 && $('#login-name').val().length < 4) {
        error = true;
        $('#login-name').parent().addClass('has-error');
    }

    if (!error) {
        $('#formLogin').submit();
    }
}

function checkEmail(email) {
    if (email.indexOf("@") != "-1" && email.indexOf(".") != "-1" && email != null)
        return true;
    return false;
}

function sendPass() {
    var error = false;
    $('#modal_lostpass .alert').fadeOut(250);
    $('#lost-email').parent().removeClass('has-error');
    if (!checkEmail($('#lost-email').val())) {
        error = true;
        $('#lost-email').parent().addClass('has-error');
    }
    if (!error) {
        $.ajax({
            url: 'include/serverAjax.php',
            type: 'post',
            data: {
                action: 'vcht_recoverPass',
                email: $('#lost-email').val()
            },
            success: function(rep) {
                if (rep == 'no') {
                    alert('no');
                    $('#modal_lostpass .alert').fadeIn(250);
                } else {
                $('#modal_lostpass').modal('hide');
                    alert('Your password has been send to you by email');

                }
            }
        });
    }

}