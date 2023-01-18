function GetMailTemplate() {
    $('.content_file_to_upload').html('')
    $('#attached_files_mail').val('');
    $.ajax({
        type: 'post',
        url: base_url_ajax + "agent/agent/GetMailTemplate",
        data: {
            ref_campagne: ref_campagne
        },
        async: false,
        success: function (option_mail) {
            $('#template_mail').html(option_mail);
        }

    });
}


function GetDataMail() {



    $.ajax({
        type: 'post',
        url: base_url_ajax + "agent/agent/GetDataMail",
        data: {
            ref_mail: $('#template_mail').val(),
            ref_campagne: ref_campagne,
            name_fichier: name_fichier,
            user: user,
            ref_campagne : ref_campagne,
                    num_contact: num_contact,
        },
        dataType: 'json',
        async: false,
        success: function (data_mail_responce) {
            $('.subject_mail_template').html(data_mail_responce.subject);
            $('.content_preview_template_mail').html(data_mail_responce.mailbodyText);

            $('#cmk_nom_destinataire').val(data_mail_responce.name_destination)
            $('#cmk_email_destinataire').val(data_mail_responce.mail_destination)
        }

    });
}

$(document).on('click', '.send_mail', function () {
    SendPostTmp(current_ecran);
    GetMailTemplate();

    if($('#template_mail').val()==null){
        // show_msg_log('Aucun modÃ¨le de mail', 'warning');
       // $('#send_mail_modal').modal('hide');

        return false;
    }else {
        $('#send_mail_modal').modal('show');
        GetDataMail();
    }

});


$(document).on('change', '#template_mail', function () {
    if($('#template_mail').val()!=null)
    GetDataMail();

});


$(function () {
    var inputFile = $('input[name=file]');
    var uploadURI = $('#form-upload-attached').attr('action');

    $('#upload-btn').on('click', function (event) {
        var fileToUpload = inputFile[0].files[0];
        // make sure there is file to upload
        if (fileToUpload != 'undefined') {
            // provide the form data
            // that would be sent to sever through ajax
            var formData = new FormData();
            formData.append("file", fileToUpload);

            // now upload the file using $.ajax
            $.ajax({
                url: base_url_ajax + 'agent/agent/upload_jointe',
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    listFilesOnServer();
                }
            });
        }
    });

    function listFilesOnServer() {
        var items = [];
        var input_elem = [];
        $.getJSON(base_url_ajax + 'agent/agent/upload_jointe', function (data) {
            $.each(data, function (index, element) {
                items.push('<li class="list-group-item">' + element + '<div class="pull-right"><a href="#"><i class="glyphicon glyphicon-remove"></i></a></div></li>');
                input_elem.push(element)

            });
            $('.list-group').html("").html(items.join(""));
            $('#attached_files_mail').val('').val(input_elem.join(';'));
        });
    }
});



$(document).on('click', '#send_mail_from_modal', function () {

    var cmk_nom_destinataire = $('#cmk_nom_destinataire').val();
    var cmk_email_destinataire = $('#cmk_email_destinataire').val();

    if (cmk_nom_destinataire == "") {
        show_msg_log(lbl_saisir_nom_destinataire_error, 'warning');
        return false;
    }

    if (cmk_email_destinataire == "") {
        show_msg_log(lbl_saisir_email_destinataire_error, 'warning');
        return false;
    }
    $.ajax({
        type: 'post',
        url: base_url_ajax + "agent/agent/SendExternalMail",
        data: {
            ref_mail: $('#template_mail').val(),
            ref_campagne: ref_campagne,
            name_fichier: name_fichier,
            ref_fichier: ref_fichier,
            user: user,
            ref_campagne : ref_campagne,
            num_contact: num_contact,
            attached_files_mail: $('#attached_files_mail').val(),
            nom_destinataire: cmk_nom_destinataire,
            email_destinataire: cmk_email_destinataire
        },
        async: false,
        success: function (data_result) {
            show_msg_log(data_result, 'success');
            $('#send_mail_modal').modal('hide');

        }

    });
});