var tablelistfichier_joint;

function resetForm($form) {

    $form.find('input:text, input:password, input:file, select, textarea').val('');

    $form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr(
        'selected');
    $('input,textarea').removeClass('edited')
}

function LoadDataLisedfichier_joint(response,response_timeline) {
    $('#piece_jointe').removeClass('hidden');

    if (!tablelistfichier_joint) {
        tablelistfichier_joint = $('#LoadDataLisedfichier_joint').DataTable( {
            "data" : response.data,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tout"]],

        });
    } else {
        tablelistfichier_joint.clear().rows.add(response.data).columns.adjust().draw();
        //$("html, body").animate({ scrollTop: $('.form-actions').offset().top }, 2000);
    }


    LoadTimeLineFichier(response_timeline);
}



function LoadTimeLineFichier(data_return){

    var temp_time_linge ="";
    $('.timelinefichier').html('')
    if(data_return.rows!='0'){

        $.each(data_return.rows, function( value, row ) {

            temp_time_linge = '<div class="timeline-item">';
            temp_time_linge += '<div class="timeline-badge">';
            temp_time_linge += '<div class="timeline-icon">';
            temp_time_linge += '<i class="icon-docs font-red-intense"></i>';
            temp_time_linge += '</div>';
            temp_time_linge += '</div>';
            temp_time_linge += '<div class="timeline-body">';
            temp_time_linge += '<div class="timeline-body-arrow"> </div>';
            temp_time_linge += '<div class="timeline-body-head">';
            temp_time_linge += '<div class="timeline-body-head-caption">';
            //temp_time_linge += '<span class="timeline-body-alerttitle font-green-haze"></span>';
            temp_time_linge += '<span class="timeline-body-time font-grey-cascade">'+row.date+'</span>';
            temp_time_linge += '</div>';
            temp_time_linge += '</div>';
            temp_time_linge += '<div class="timeline-body-content">';
            temp_time_linge += '<span class="font-grey-cascade"> '+row.commentaire;
            temp_time_linge += '  <a href="'+data_return.path_dir+'/'+row.path+'" target="_blank"><i class="fa fa-download"></i></a>';
            temp_time_linge += '</span>';
            temp_time_linge += '</div>';
            temp_time_linge += '</div>';
            temp_time_linge += '</div>';
            $('.timelinefichier').append(temp_time_linge)

        });
    }
}


var files;

// Add events
$('#file_joint input[type=file]').on('change', prepareUpload);

// Grab the files and set them to our variable
function prepareUpload(event) {
    files = event.target.files;
}
$(document)
    .on(
        "click",
        ".save-fichier_joint",
        function(event) {

            var data = new FormData($('#upload_form_jointe')[0]);
            data.append('ref_campagne', ref_campagne);
            data.append('ref_fichier', ref_fichier);
            data.append('num_contact', num_contact);
            data.append('ref_fichier', ref_fichier);
            data.append('ref_user', user);
            data.append('commentaire',$('#commentaire_f_joint').val());
            data.append('oper', 'add');

            var oper_fichier_joint = $(this).data('action');

            $
                .ajax({
                    type : "POST",
                    processData : false,
                    contentType : false,
                    url : "agent/Actionsfichier_joint",
                    data : data,

                    success : function(data_return) {
                        data_return = $.trim(data_return);
                        if (data_return != "") {

                            switch (data_return) {


                                case 'ERROR_UPLOAD':

                                    show_msg_log(
                                        LBL_MSG_ERROR_UPLOAD,
                                        'error');
                                    break;

                                case 'LIBELLE_REQ':
                                    show_msg_log(
                                        LBL_MSG_FORMRDV_LIBELLE_REQ_JOINT,
                                        'warning');
                                    break;
                                case 'FILE_REQ':
                                    show_msg_log(
                                        LBL_MSG_FORMRDV_FILE_REQ_JOINT,
                                        'warning');
                                    break;
                                case 'LIBELLE_EXIST':
                                    show_msg_log(
                                        LBL_MSG_FORMRDV_LIBELLE_EXIST_JOINT,
                                        'warning');
                                    break;

                                case 'OK_UPDATE':

                                    show_msg_log(
                                        LBL_MSG_OPER_SUCCESS,
                                        'info');
                                    $('#modal-gestion-fichier_joint')
                                        .modal('hide');
                                    resetForm($('.form-modal-gestion-fichier_joint'));
                                    $.ajax({
                                        url : base_url_ajax + "agent/agent/Listfichier_jointAjax",
                                        type : "post",
                                        data : {
                                            ref_campagne : ref_campagne,
                                            ref_fichier : ref_fichier,
                                            num_contact : num_contact
                                        },
                                        dataType : 'json',
                                        success : function(data_result) {

                                            LoadDataLisedfichier_joint(data_result.Listfichier_joint,data_result.TimeLineFichierJoint);
                                            $("#timeLineItemsContainer").html(contact_timeline(data_result.timeline,data_result.enreg_path));
                                        }
                                    });
                                    break;

                                case 'OK_DELETE':

                                    show_msg_log(
                                        LBL_MSG_OPER_SUCCESS,
                                        'info');
                                    $('#modal-gestion-fichier_joint-delete').modal('hide')
                                    break;
                            }

                        }

                        $('.fileinput-exists .red').click();
                        $('.jointfileinput').fileinput('clear')
                        $('#commentaire_f_joint').val('')
                        //LoadDataLisedfichier_joint();

                    }
                });
        });