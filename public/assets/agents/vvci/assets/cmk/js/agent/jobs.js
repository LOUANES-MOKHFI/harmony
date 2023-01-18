var activeJob = false;
//fetchMyJobs();
//setInterval(function() {
//    fetchMyJobs();
//}, 15000);

function fetchMyJobs() {
    $.ajax({
        type : 'POST',
        global : false,
        dataType : 'JSON',
        url : base_url_ajax+'agent/jobs/getMyJobs',
        success : function(response) {
            var htmlJobs = '';
            htmlJobs += '<li class="todo-padding-b-0">';
            htmlJobs += '<div class="todo-head">';
            htmlJobs += '<h3>Jobs</h3>';
            htmlJobs += '<p class="todo-inline todo-float-r"><i class="fa fa-lg fa-refresh" data-toggle="tooltip" data-original-title="Actualiser" id="refreshJobData" style="cursor:pointer;"></i></p>';
            htmlJobs += '</div>';
            htmlJobs += '</li>';
            $.each(response,function(k,v) {
                htmlJobs += '<li class="todo-projects-item" data-refjob="'+ v.reference+'" data-idjob="'+ v.id +'" data-group="'+ v.num_groupe+'" data-etat="'+ v.etat+'">';
                htmlJobs += '<h3>'+lbl_job_reference+' : '+ v.reference +'</h3>';
                htmlJobs += '<h5>'+lbl_fichier_global+' : '+ v.nomgroupe+'</h5>';
                htmlJobs += '<h5>'+lbl_campagne_global+' : '+ v.nomcampagne +'</h5>';
                htmlJobs += '<p><i class="fa fa-user"></i> '+ v.ctInfo.nom +' <i class="fa fa-phone"></i> ' + v.ctInfo.tel1 + ' <i class="fa fa-info-circle" data-toggle="qtip" data-original-title="';
                $.each(v.ctInfo,function(i,u) {
                    htmlJobs += '<div style=\'text-align:left;\'><b>'+i+' : </b>'+(u == null ? '' : u)+'</div><br>';
                });
                htmlJobs += '"></i></p>';
                htmlJobs += '<div class="todo-project-item-foot">';
                htmlJobs += '<p class="todo-red todo-inline">'+lbl_job_open+' : '+ moment(v.created).format('DD/MM/YYYY HH:mm') +'</p>';
                htmlJobs += '<p class="todo-inline todo-float-r">';
                htmlJobs += '<a class="todo-add-button job-close" href="#todo-members-modal" data-toggle="modal" data-original-title="'+lbl_job_close+'" data-idjob="'+ v.id +'"><i class="fa fa-check"></i></a>';
                htmlJobs += '</p>';
                htmlJobs += '</div>';
                htmlJobs += '</li>';
                htmlJobs += '<div class="todo-projects-divider"></div>';
            });

            $("#myJobsContainer").html(htmlJobs);
            $("#refreshJobData").removeClass("fa-spinner");
            $(".job-close").tooltip();
            $("#myJobsContainer i[data-toggle='qtip']").each(function() {
                $(this).qtip({
                    content: {
                        text: $(this).data('original-title'),
                        style : 'qtip-light'
                    }
                });
            });

            var refSearch = $("#refJobSearch").val();
            var groups = $("#selectGroups").multipleSelect('getSelects');
            var etat = $("input[name='etatJobSearch']:checked").val();
            filterJobs(groups,refSearch,etat);
        }
    })
}

function fetchJobData(idJob) {
    $.ajax({
        type : 'POST',
        dataType : 'JSON',
        url : base_url_ajax+'agent/jobs/getJobItems',
        data : { 'idjob' : idJob },
        success : function(response) {
            var htmlItems = '';
            $.each(response,function(k,v) {
                if (v.itemtype == '1') {
                    htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" ' + (v.item_dir == 'IN' ? 'data-inbound="' + v.inboundid + '"' : 'data-outbound="' + v.outboundid + '"') + ' data-itemid="' + v.item_id + '" data-itemtype="' + v.itemtype + '">';
                    htmlItems += '<div class="mt-timeline-icon bg-red bg-font-red border-grey-steel">';
                    htmlItems += '<i class="icon-envelope"></i>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-timeline-content">';
                    htmlItems += '<div class="mt-content-container">';
                    htmlItems += '<div class="mt-title">';
                    htmlItems += '<h3 class="mt-content-title">' + (v.item_dir == 'IN' ? ct_timeline_mail_in : ct_timeline_mail_out) + '</h3>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author">';
                    //htmlItems += '<div class="mt-avatar">';
                    //htmlItems += '<img src="../assets/pages/media/users/avatar80_2.jpg" />';
                    //htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-name">';
                    htmlItems += '<a href="javascript:;" class="font-blue-madison">' + (v.item_dir == 'IN' ? v.FROM_NAME : v.TO) + '</a>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-notes font-grey-mint">' + moment((v.item_dir == 'IN' ? v.DATE_RECEIVED : v.DATE_SENT)).format('DD/MM/YYYY HH:mm') + '</div>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-content border-grey-salt">';
                    htmlItems += '<p>';
                    htmlItems += ct_timeline_mail_subject_label+' : ' + v.SUBJECT;
                    htmlItems += '</p>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</li>';
                } else if (v.itemtype == '4') {
                    htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" data-itemtype="' + v.itemtype + '">';
                    htmlItems += '<div class="mt-timeline-icon bg-blue bg-font-blue border-grey-steel">';
                    htmlItems += '<i class="' + (v.item_dir == 'IN' ? 'icon-call-in' : 'icon-call-out') + '"></i>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-timeline-content">';
                    htmlItems += '<div class="mt-content-container">';
                    htmlItems += '<div class="mt-title">';
                    htmlItems += '<h3 class="mt-content-title">' + (v.item_dir == 'IN' ? ct_timeline_call_in : ct_timeline_call_out) + '</h3>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author">';
                    //htmlItems += '<div class="mt-avatar">';
                    //htmlItems += '<img src="../assets/pages/media/users/avatar80_2.jpg" />';
                    //htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-name">';
                    htmlItems += '<a href="javascript:;" class="font-blue-madison">' + v.user_obs + '</a>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-notes font-grey-mint">' + moment(v.obs_c_date_fin).format('DD/MM/YYYY HH:mm') + '</div>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-content border-grey-salt">';
                    htmlItems += '<p>';
                    //BEGIN INFOS CALL
                    htmlItems += '<div class="profile-info">';
                    htmlItems += '<ul class="list-unstyled">';
                    htmlItems += '<li><i class="fa fa-check"></i> '+tableheader_qualif+' : <strong>'+ v.qualif +'</strong></li>';
                    htmlItems += '<li><i class="fa fa-calendar"></i> '+tableheader_recalldate+' : <strong>'+ (v.obs_c_date_rappel != '0000-00-00 00:00:00' ? moment(v.obs_c_date_rappel).format('DD/MM/YYYY HH:mm') : '...') +'</strong></li>';
                    if (v.recordings.length > 0 && recordings==1) {
                        htmlItems += '<li><i class="fa fa-volume-up"></i> '+tooltip_recordings+' : </li>';
                        htmlItems += '</ul>';
                        htmlItems += '</div>';
                        $.each(v.recordings,function(l,u) {
                            //END INFOS CALL
                            //BEGIN ENREG
                            if (u.filename != '') {
                                htmlItems += '<div class="media text-center">';
                                htmlItems += '<button class="btn btn-xs btn-outline blue play_enreg_btn" data-grhtitle="" data-ref_campagne="" data-ref_qualification="" data-ref_user="" data-selector="jquery_jplayer_timeline' + k + l + '" data-index="'+k+l+'" data-ancestor="p_container_timeline' + k + l + '" data-enreg_path="'+enreg_path+'" data-filename="'+u.filename+'"><i class="fa fa-play"></i> '+ lbl_button_play_enreg +'</button>';
                                htmlItems += '</div>';
                            }
                        })
                    } else {
                        htmlItems += '</ul>';
                        htmlItems += '</div>';
                    }
                    //END ENREG
                    htmlItems += '</p>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</li>';
                } else if (v.itemtype == '5') {
                    htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" data-mailid="' + v.id + '" data-itemtype="' + v.itemtype + '">';
                    htmlItems += '<div class="mt-timeline-icon bg-red bg-font-red border-grey-steel">';
                    htmlItems += '<i class="icon-envelope"></i>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-timeline-content">';
                    htmlItems += '<div class="mt-content-container">';
                    htmlItems += '<div class="mt-title">';
                    htmlItems += '<h3 class="mt-content-title">' + (v.item_dir == 'IN' ? ct_timeline_mail_in : ct_timeline_mail_out) + '</h3>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author">';
                    //htmlItems += '<div class="mt-avatar">';
                    //htmlItems += '<img src="../assets/pages/media/users/avatar80_2.jpg" />';
                    //htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-name">';
                    htmlItems += '<a href="javascript:;" class="font-blue-madison">' + v.expediteur + '</a>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-notes font-grey-mint">' + moment(v.date_envoi).format('DD/MM/YYYY HH:mm') + '</div>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-content border-grey-salt">';
                    htmlItems += '<p>';
                    htmlItems += ct_timeline_mail_subject_label+' : ' + v.subject;
                    htmlItems += '</p>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</li>';
                } else if (v.itemtype == '6') {
                    htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" data-faxid="' + v.id + '" data-itemtype="' + v.itemtype + '">';
                    htmlItems += '<div class="mt-timeline-icon bg-green bg-font-green border-grey-steel">';
                    htmlItems += '<i class="icon-printer"></i>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-timeline-content">';
                    htmlItems += '<div class="mt-content-container">';
                    htmlItems += '<div class="mt-title">';
                    htmlItems += '<h3 class="mt-content-title">' + (v.item_dir == 'IN' ? ct_timeline_fax_in : ct_timeline_fax_out) + '</h3>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author">';
                    //htmlItems += '<div class="mt-avatar">';
                    //htmlItems += '<img src="../assets/pages/media/users/avatar80_2.jpg" />';
                    //htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-name">';
                    htmlItems += '<a href="javascript:;" class="font-blue-madison">' + v.expediteur + '</a>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-notes font-grey-mint">' + moment(v.date_envoi).format('DD/MM/YYYY HH:mm') + '</div>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-content border-grey-salt">';
                    htmlItems += '<p>';
                    htmlItems += '<strong> '+ct_timeline_sent_to+' '+v.destinataire+'</strong><br>';
                    htmlItems += v.contenu;
                    htmlItems += '</p>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</li>';
                } else if (v.itemtype == '7') {
                    htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" data-smsid="' + v.id + '" data-itemtype="' + v.itemtype + '">';
                    htmlItems += '<div class="mt-timeline-icon bg-yellow-lemon bg-font-yellow-lemon border-grey-steel">';
                    htmlItems += '<i class="icon-bubble"></i>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-timeline-content">';
                    htmlItems += '<div class="mt-content-container">';
                    htmlItems += '<div class="mt-title">';
                    htmlItems += '<h3 class="mt-content-title">' + (v.item_dir == 'IN' ? ct_timeline_sms_in : ct_timeline_sms_out) + '</h3>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author">';
                    //htmlItems += '<div class="mt-avatar">';
                    //htmlItems += '<img src="../assets/pages/media/users/avatar80_2.jpg" />';
                    //htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-name">';
                    htmlItems += '<a href="javascript:;" class="font-blue-madison">' + (v.item_dir == 'IN' ? v.from : v.expediteur) + '</a>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-notes font-grey-mint">' + moment((v.item_dir == 'IN' ? v.date_received : v.date_envoi)).format('DD/MM/YYYY HH:mm') + '</div>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-content border-grey-salt">';
                    htmlItems += '<p>';
                    htmlItems += '<strong> '+ct_timeline_sent_to+' '+(v.item_dir == 'IN' ? v.to : v.destinataire)+'</strong><br>';
                    htmlItems += (v.item_dir == 'IN' ? v.msg : v.contenu);
                    htmlItems += '</p>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</li>';
                } else if (v.itemtype == '9') {
                    htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" data-itemtype="' + v.itemtype + '">';
                    htmlItems += '<div class="mt-timeline-icon bg-grey bg-grey border-grey-steel">';
                    htmlItems += '<i class="icon-doc"></i>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-timeline-content">';
                    htmlItems += '<div class="mt-content-container">';
                    htmlItems += '<div class="mt-title">';
                    htmlItems += '<h3 class="mt-content-title">'+ct_timline_attachment+'</h3>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author">';
                    //htmlItems += '<div class="mt-avatar">';
                    //htmlItems += '<img src="../assets/pages/media/users/avatar80_2.jpg" />';
                    //htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-name">';
                    htmlItems += '<a href="javascript:;" class="font-blue-madison">' + v.commentaire + '</a>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-notes font-grey-mint">' + moment(v.date).format('DD/MM/YYYY HH:mm') + '</div>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-content border-grey-salt">';
                    htmlItems += '<p>';
                    htmlItems += '<strong><a href="'+v.path_dir+'/'+ v.path+'" target="_blank"><i class="fa fa-download"></i> TÃ©lÃ©charger</a></strong><br>';
                    htmlItems += '</p>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</li>';
                } else if (v.itemtype == '10') {
                    htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" data-smsid="' + v.id + '" data-itemtype="' + v.itemtype + '">';
                    htmlItems += '<div class="mt-timeline-icon bg-yellow-lemon bg-font-yellow-lemon border-grey-steel">';
                    htmlItems += '<i class="icon-bubble"></i>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-timeline-content">';
                    htmlItems += '<div class="mt-content-container">';
                    htmlItems += '<div class="mt-title">';
                    htmlItems += '<h3 class="mt-content-title">' + (v.item_dir == 'IN' ? ct_timeline_sms_in : ct_timeline_sms_out) + '</h3>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author">';
                    //htmlItems += '<div class="mt-avatar">';
                    //htmlItems += '<img src="../assets/pages/media/users/avatar80_2.jpg" />';
                    //htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-name">';
                    htmlItems += '<a href="javascript:;" class="font-blue-madison">Campagne SMS</a>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-notes font-grey-mint">' + moment((v.item_dir == 'IN' ? v.date_received : v.date_sent)).format('DD/MM/YYYY HH:mm') + '</div>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-content border-grey-salt">';
                    htmlItems += '<p>';
                    htmlItems += '<strong> '+ct_timeline_sent_to+' '+v.to +'</strong><br>';
                    htmlItems +=  v.msg;
                    htmlItems += '</p>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</li>';
                } else if (v.itemtype == '11') {
                    htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" data-chatid="' + v.id + '" data-itemtype="' + v.itemtype + '">';
                    htmlItems += '<div class="mt-timeline-icon bg-blue bg-font-blue border-grey-steel">';
                    htmlItems += '<i class="icon-bubbles"></i>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-timeline-content">';
                    htmlItems += '<div class="mt-content-container">';
                    htmlItems += '<div class="mt-title">';
                    htmlItems += '<h3 class="mt-content-title">' + (v.item_dir == 'IN' ? ct_timeline_msg_in : ct_timeline_msg_out) + '</h3>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author">';
                    //htmlItems += '<div class="mt-avatar">';
                    //htmlItems += '<img src="../assets/pages/media/users/avatar80_2.jpg" />';
                    //htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-name">';
                    htmlItems += '<a href="javascript:;" class="font-blue-madison">'+v.name+'</a>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-notes font-grey-mint">' + moment(v.datetime).format('DD/MM/YYYY HH:mm') + '</div>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-content border-grey-salt">';
                    htmlItems += '<p>';
                    htmlItems +=  v.body;
                    htmlItems += '</p>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</li>';
                } else if (v.itemtype == '12') { //facebook
                    var fb_app_name;
                    var fb_item_title;
                    var fb_sent_to=v.nom_page;
                    var fb_sent_by=v.senderFirstName + ' ' +v.senderLastName;
                    if (v.type=="message") {
                        fb_app_name="Messenger";
                        if (v.feedType=="image") {
                            fb_item_title = "Image";
                        } else if (v.feedType=="file") {
                            fb_item_title = "Fichier";
                        } else {
                            fb_item_title = "Message";
                        }
                    } else {
                        fb_app_name="Facebook Feed";
                        if (v.feedType=="post")
                            fb_item_title="Post";
                        else if (v.feedType=="photo")
                            fb_item_title="Photo";
                        else if (v.feedType=="video")
                            fb_item_title="VidÃ©o";
                        else
                            fb_item_title="Commentaire";
                    }

                    htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" data-smsid="' + v.id + '" data-itemtype="' + v.itemtype + '">';
                    htmlItems += '<div class="mt-timeline-icon bg-blue-steel  bg-font-yellow-lemon border-grey-steel">';
                    htmlItems += '<i class="icon-social-facebook"></i>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-timeline-content">';
                    htmlItems += '<div class="mt-content-container">';
                    htmlItems += '<div class="mt-title">';
                    htmlItems += '<h3 class="mt-content-title"> ' +fb_item_title+ ' ' + (v.item_dir == 'IN' ? 'reÃ§u' : 'envoyÃ©') + '</h3>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author">';
                    //htmlItems += '<div class="mt-avatar">';
                    //htmlItems += '<img src="../assets/pages/media/users/avatar80_2.jpg" />';
                    //htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-name">';

                    htmlItems += '<a href="javascript:;" class="font-blue-madison">'+fb_app_name+'</a>';

                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-notes font-grey-mint">' + moment((v.item_dir == 'IN' ? v.date_received : v.date_sent)).format('DD/MM/YYYY HH:mm') + '</div>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-content border-grey-salt">';
                    htmlItems += '<p>';


                    if (v.item_dir == 'IN') {
                        htmlItems += '<strong> EnvoyÃ© par ' + fb_sent_by + ' sur ' + fb_sent_to + '</strong><br>';
                    } else {
                        htmlItems += '<strong> Repondu par ' + fb_sent_by +  '</strong><br>';
                    }

                    if (v.feedType=="image") {
                        htmlItems +=  '<a onclick="showPhoto(\''+v.msg+'\')">Open Image </a>';
                    } else if (v.feedType=="file") {
                        htmlItems += '<a onclick="showPhoto(\'' + v.msg + '\')">Open File </a>';
                    } else if (v.feedType=="photo" || v.feedType=="video") {
                        htmlItems +=  '<a onclick="showPhoto(\''+v.link+'\')">'+v.msg+'(clicker pour ouvrir) </a>';
                    } else {
                        htmlItems +=  v.msg;
                    }

                    htmlItems += '</p>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</li>';

                } else if (v.itemtype == '13') { //SMS CAMPAGNE
                    htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" data-smsid="' + v.id + '" data-itemtype="' + v.itemtype + '">';
                    htmlItems += '<div class="mt-timeline-icon bg-yellow-lemon bg-font-yellow-lemon border-grey-steel">';
                    htmlItems += '<i class="icon-bubble"></i>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-timeline-content">';
                    htmlItems += '<div class="mt-content-container">';
                    htmlItems += '<div class="mt-title">';
                    htmlItems += '<h3 class="mt-content-title">' + (v.item_dir == 'IN' ? ct_timeline_sms_in : ct_timeline_sms_out) + '</h3>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author">';
                    //htmlItems += '<div class="mt-avatar">';
                    //htmlItems += '<img src="../assets/pages/media/users/avatar80_2.jpg" />';
                    //htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-name">';
                    htmlItems += '<a href="javascript:;" class="font-blue-madison">Campagne SMS</a>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-notes font-grey-mint">' + moment((v.item_dir == 'IN' ? v.date_received : v.date_sent)).format('DD/MM/YYYY HH:mm') + '</div>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-content border-grey-salt">';
                    htmlItems += '<p>';
                    htmlItems += '<strong> '+ct_timeline_sent_to+' '+v.to +'</strong><br>';
                    htmlItems +=  v.msg;
                    htmlItems += '</p>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</li>';
                } else if (v.itemtype == '14') { //trace dÃ©pot
                    htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" data-itemtype="' + v.itemtype + '">';
                    htmlItems += '<div class="mt-timeline-icon bg-grey bg-grey border-grey-steel">';
                    htmlItems += '<i class="icon-doc"></i>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-timeline-content">';
                    htmlItems += '<div class="mt-content-container">';
                    htmlItems += '<div class="mt-title">';
                    htmlItems += '<h3 class="mt-content-title"> '+ct_timline_attachment+' (DÃ©pot)</h3>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author">';
                    htmlItems += '<div class="mt-author-name">';
                    htmlItems += '<a href="javascript:;" class="font-blue-madison">' + v.name_user + '</a>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-author-notes font-grey-mint">' + moment(v.created).format('DD/MM/YYYY HH:mm') + '</div>';
                    htmlItems += '</div>';
                    htmlItems += '<div class="mt-content border-grey-salt">';
                    htmlItems += '<p>';
                    htmlItems += '<strong><a href="'+v.url+'" target="_blank"><i class="fa fa-download"></i> TÃ©lÃ©charger</a></strong><br>';
                    htmlItems += '</p>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</div>';
                    htmlItems += '</li>';
                }
            });
            $("#jobItemsContainer").html(htmlItems);
            $("#jobItemsContainer .jp-jplayer").each(function(k,v) {
                var filename = $(this).data('filename');
                var fileduration = $(this).data('fileduration');
                var selector = $(this).data('selector');
                if (filename == '') return false;
                $(this).jPlayer({
                    ready: function () {
                        $(this).jPlayer("setMedia", {
                            title: "",
                            mp3: enreg_path+filename,
                            duration : parseInt(fileduration)
                        });
                    },
                    swfPath: "../../dist/jplayer",
                    cssSelectorAncestor: selector,
                    supplied: "mp3",
                    wmode: "window",
                    globalVolume: true,
                    useStateClassSkin: true,
                    autoBlur: false,
                    smoothPlayBar: true,
                    keyEnabled: true
                });
            });
            $("#jobItemsDiv").fadeIn(function() {
                $("html").animate({ scrollTop: $('#jobItemsDiv').offset().top }, {
                    duration : 500
                });
            });
        }
    })
}

function filterJobs(groups,refSearch,etat) {
    if (groups.length == 0 && refSearch == '' && etat == 2) {
        $("#myJobsContainer .todo-projects-item").show();
        return true;
    }
    $("#myJobsContainer .todo-projects-item").each(function(k,v) {
        if ((groups.length == '' ||groups.indexOf($(v).data('group').toString()) != '-1') && (refSearch == '' || $(v).data('refjob').indexOf(refSearch) != '-1') && $(v).data('etat') == '1') {
            $(v).show();
        } else {
            $(v).hide();
        }
    });
}


$(document).ready(function() {

    $(document).on("click","#refreshJobData",function() {
        $(this).addClass("fa-spinner")
        fetchMyJobs();
    });

    $('input[name="etatJobSearch"]').change(function(event, state) {
        var refSearch = $("#refJobSearch").val();
        var groups = $("#selectGroupsJobs").multipleSelect('getSelects');
        var etat = $("input[name='etatJobSearch']:checked").val();
        filterJobs(groups,refSearch,etat);
    });

    $("#refJobSearch").keyup(function() {
        var refSearch = $("#refJobSearch").val();
        var groups = $("#selectGroupsJobs").multipleSelect('getSelects');
        var etat = $("input[name='etatJobSearch']:checked").val();
        filterJobs(groups,refSearch,etat);
    });
    $("#selectGroupsJobs").multipleSelect({
        onClick : function() {
            var refSearch = $("#refJobSearch").val();
            var groups = $("#selectGroupsJobs").multipleSelect('getSelects');
            var etat = $("input[name='etatJobSearch']:checked").val();
            filterJobs(groups,refSearch,etat);
        },
        onCheckAll : function() {
            var refSearch = $("#refJobSearch").val();
            var groups = $("#selectGroupsJobs").multipleSelect('getSelects');
            var etat = $("input[name='etatJobSearch']:checked").val();
            filterJobs(groups,refSearch,etat);
        },
        onUncheckAll : function() {
            var refSearch = $("#refJobSearch").val();
            var groups = $("#selectGroupsJobs").multipleSelect('getSelects');
            var etat = $("input[name='etatJobSearch']:checked").val();
            filterJobs(groups,refSearch,etat);
        },
        onOptgroupClick : function() {
            var refSearch = $("#refJobSearch").val();
            var groups = $("#selectGroupsJobs").multipleSelect('getSelects');
            var etat = $("input[name='etatJobSearch']:checked").val();
            filterJobs(groups,refSearch,etat);
        }
    });

    $("#myJobsContainer").on("click",".job-close",function() {
        var idjob = $(this).data("idjob");
        $.ajax({
            type : 'POST',
            url : base_url_ajax+'jobs/jobs/closejob',
            data : { 'id' : idjob},
            success : function(response) {
                fetchMyJobs();
            }
        })
    });
    $("#myJobsContainer").on("click",".todo-projects-item",function(e) {
        if ($(e.target).hasClass('job-close') || $(e.target).parent().hasClass('job-close')) return false;
        $(this).siblings('.todo-projects-item').removeClass('todo-active');
        $(this).addClass('todo-active');
        var refJob = $(this).data('refjob');
        var idJob = $(this).data('idjob');
        activeJob = idJob;
        fetchJobData(idJob);

    })

    $("#jobItemsContainer,#timeLineItemsContainer").on("click",".mt-item.item-in .mt-timeline-content",function() {
        var itemtype = $(this).parent().data('itemtype');

        if (itemtype == '1') {
            var itemid = $(this).parent().data('itemid');
            var inbound = $(this).parent().data('inbound');
            $("#mail_trash").hide();
            $("#mail_dispatch").hide();
            $("#mail_save").hide();
            $("#mail_reply").show();
            $.ajax({
                global : false,
                type: 'POST',
                dataType: 'json',
                url: base_url_ajax + 'agent/inbox/getMail',
                data: {id: itemid, 'source': 'inbox', 'inbound': inbound},
                success: function (response) {
                    $("#references_reply").val(response.mail.REFERENCES);
                    $("#fullmailid_reply").val(response.mail.FULLMAILID);
                    $("#campagne_reply").val(response.mail.ref_campagne);
                    $("#inbox_reply").val(response.mail.ref_inbox);
                    $("#jobid_reply").val(response.mail.REF_UNIQUEID);
                    $("#mail_dest_addr_reply").val(response.mail.FROM_MAIL);
                    $("#mail_subject_reply").val('Re : '+response.mail.SUBJECT);
                    $("#mail_date").text('ReÃ§u le : '+moment(response.mail.DATE_RECEIVED).format('DD/MM/YYYY HH:mm'));
                    $("#mail_from_mail").text(response.mail.FROM_NAME);
                    $("#mail_to").text(response.mail.TO + ' ' + response.mail.CC);
                    $("#mail_subject").text(lbl_mail_object + ' ' + response.mail.SUBJECT);
                    $("#mail_reply_div").hide();

                    var html = '';
                    $.each(response.attach, function (k, v) {
                        response.mail.BODY = response.mail.BODY.split('cid:'+v.CID).join(v.PATH.replace(fcpath,base_url_ajax));
                        html += '<div class="margin-bottom-25">';
                        html += '<div>';
                        html += '<strong><a target="_blank" href="'+v.PATH.replace(fcpath,base_url_ajax)+'">' + v.FILENAME + '</a></strong>';
                        html += '</div>';
                        html += '</div>';
                    });
                    $("#mail_body_reply").data("wysihtml5").editor.setValue('<br><br><br><br>'+response.mail.BODY);
                    $("#mail_attach").html(html);
                    $("#mail_body").html(response.mail.BODY.split("\n").join("<br />"));
                    $("#modal-view").modal("show");
                }
            })
        } else if (itemtype == '8') {
            var itemid = $(this).parent().data('itemid');
            $.ajax({
                global : false,
                type: 'POST',
                dataType: 'json',
                url: base_url_ajax + 'agent/jobs/getGenrericItem',
                data: {id: itemid},
                success: function (response) {
                    $("#genitem_date").html('<b>Date : </b>'+moment(response.created).format('MM/DD/YYYY HH:mm'));
                    $("#genitem_content").html(response.content);
                    $("#genitem_details_header").html(response.details_header);
                    $("#modal-view-item").modal("show");
                }
            })
        }
    });

    $("#jobItemsContainer,#timeLineItemsContainer").on("click",".mt-item.item-out .mt-timeline-content",function() {
        var itemtype = $(this).parent().data('itemtype');
        if (itemtype == '1') {
            var itemid = $(this).parent().data('itemid');
            var outbound = $(this).parent().data('outbound');
            $("#mail_trash").hide();
            $("#mail_dispatch").hide();
            $("#mail_save").hide();
            $("#mail_reply").show();
            $.ajax({
                global : false,
                type: 'POST',
                dataType: 'json',
                url: base_url_ajax + 'agent/inbox/getMailOut',
                data: {id: itemid, 'source': 'inbox', 'outbound': outbound},
                success: function (response) {
                    $("#references_reply").val('');
                    $("#fullmailid_reply").val(response.mail.FULLMAILID);
                    $("#campagne_reply").val(response.mail.ref_campagne);
                    $("#inbox_reply").val('');
                    $("#jobid_reply").val('');
                    $("#mail_dest_addr_reply").val(response.mail.FROM_MAIL);
                    $("#mail_subject_reply").val('Re : '+response.mail.SUBJECT);
                    $("#mail_date").text('EnvoyÃ© le : '+moment(response.mail.date_envoi).format('DD/MM/YYYY HH:mm'));
                    $("#mail_from_mail").text(response.mail.FROM_MAIL);
                    $("#mail_to").text(response.mail.TO);
                    $("#mail_subject").text(lbl_mail_object + ' ' + response.mail.SUBJECT);
                    $("#mail_reply_div").hide();

                    var html = '';
                    $.each(response.attach, function (k, v) {
                        response.mail.BODY = response.mail.BODY.split('cid:'+v.CID).join(v.PATH.replace(fcpath,base_url_ajax));
                        html += '<div class="margin-bottom-25">';
                        html += '<div>';
                        if (v.REMOTE == "1") html += '<strong><a target="_blank" href="'+v.URL+'">' + v.FILENAME + '</a></strong>';
                        else html += '<strong><a target="_blank" href="'+v.PATH.replace(fcpath,base_url_ajax)+'">' + v.FILENAME + '</a></strong>';
                        html += '</div>';
                        html += '</div>';
                    });
                    $("#mail_attach").html(html);
                    $("#mail_body").html(response.mail.BODY.split("\n").join("<br />"));
                    $("#modal-view").modal("show");
                }
            })
        } else if (itemtype == '5') {
            var mailid = $(this).parent().data('mailid');
            $("#mail_trash").hide();
            $("#mail_dispatch").hide();
            $("#mail_save").hide();
            $("#mail_reply").show();
            $.ajax({
                global : false,
                type: 'POST',
                dataType: 'json',
                url: base_url_ajax + 'agent/inbox/getMailScript',
                data: {id: mailid},
                success: function (response) {
                    $("#references_reply").val('');
                    $("#fullmailid_reply").val(response.mail.FULLMAILID);
                    $("#campagne_reply").val(response.mail.ref_campagne);
                    $("#inbox_reply").val(response.mail.ref_inbox);
                    $("#jobid_reply").val(response.mail.REF_UNIQUEID);
                    $("#mail_dest_addr_reply").val(response.mail.expediteur);
                    $("#mail_subject_reply").val('Re : '+response.mail.subject);
                    $("#mail_date").text('ReÃ§u le : '+moment(response.mail.date_envoi).format('DD/MM/YYYY HH:mm'));
                    $("#mail_from_mail").text(response.mail.expediteur);
                    $("#mail_to").text(response.mail.destinataire);
                    $("#mail_subject").text(lbl_mail_object + ' ' + response.mail.subject);
                    $("#mail_reply_div").hide();

                    var html = '';
                    $.each(response.attach, function (k, v) {
                        response.mail.contenu = response.mail.contenu.split('cid:'+v.CID).join(v.PATH.replace(fcpath,base_url_ajax));
                        html += '<div class="margin-bottom-25">';
                        html += '<div>';
                        html += '<strong><a target="_blank" href="'+v.PATH.replace(fcpath,base_url_ajax)+'">' + v.FILENAME + '</a></strong>';
                        html += '</div>';
                        html += '</div>';
                    });
                    $("#mail_attach").html(html);
                    $("#mail_body").html(response.mail.contenu.split("\n").join("<br />"));
                    $("#modal-view").modal("show");
                }
            })
        } else if (itemtype == '6') {
            var faxid = $(this).parent().data('faxid');
            $("#mail_trash").hide();
            $("#mail_dispatch").hide();
            $("#mail_save").hide();
            $("#mail_reply").hide();
            $.ajax({
                global : false,
                type: 'POST',
                dataType: 'json',
                url: base_url_ajax + 'agent/inbox/getFaxScript',
                data: {id: faxid},
                success: function (response) {
                    $("#references_reply").val('');
                    $("#fullmailid_reply").val(response.fax.FULLMAILID);
                    $("#campagne_reply").val(response.fax.ref_campagne);
                    $("#inbox_reply").val(response.fax.ref_inbox);
                    $("#jobid_reply").val(response.fax.REF_UNIQUEID);
                    $("#mail_dest_addr_reply").val(response.fax.expediteur);
                    $("#mail_subject_reply").val('');
                    $("#mail_date").text('EnvoyÃ© le : '+moment(response.fax.date_envoi).format('DD/MM/YYYY HH:mm'));
                    $("#mail_from_mail").text('');
                    $("#mail_to").text(response.fax.destinataire);
                    $("#mail_subject").text('');
                    $("#mail_reply_div").hide();

                    var html = '';
                    $.each(response.attach, function (k, v) {
                        response.fax.contenu = response.fax.contenu.split('cid:'+v.CID).join(v.PATH.replace(fcpath,base_url_ajax));
                        html += '<div class="margin-bottom-25">';
                        html += '<div>';
                        html += '<strong><a target="_blank" href="'+v.PATH.replace(fcpath,base_url_ajax)+'">' + v.FILENAME + '</a></strong>';
                        html += '</div>';
                        html += '</div>';
                    });
                    $("#mail_attach").html(html);
                    $("#mail_body").html(response.fax.contenu.split("\n").join("<br />"));
                    $("#modal-view").modal("show");
                }
            })
        } else if (itemtype == '7') {
            var smsid = $(this).parent().data('smsid');
            $("#sms_reply").show();
            $.ajax({
                global: false,
                type: 'POST',
                dataType: 'json',
                url: base_url_ajax + 'agent/inbox/getSMSScript',
                data: {id: smsid},
                success: function (response) {
                    $("#sms_date").text(response.sms.date_envoi);
                    $("#sms_from").text('Du : '+response.sms.expediteur+' au : '+response.sms.destinataire);
                    $("#sms_body").html(response.sms.contenu);
                    $("#modal-view-sms").modal("show");
                }
            });
        } else if (itemtype == '8') {
            var itemid = $(this).parent().data('itemid');
            $.ajax({
                global : false,
                type: 'POST',
                dataType: 'json',
                url: base_url_ajax + 'agent/jobs/getGenrericItem',
                data: {id: itemid},
                success: function (response) {
                    $("#genitem_date").html('<b>Date : </b>'+moment(response.created).format('MM/DD/YYYY HH:mm'));
                    $("#genitem_content").html(response.content);
                    $("#genitem_details_header").html(response.details_header);
                    $("#modal-view-item").modal("show");
                }
            })
        }
    });

    $("#mail_reply").click(function() {
        $("#attach_dir_reply").val(uniqid());
        $("#collapse_3_1").collapse("hide");
        $("#mail_reply_div").slideDown();
    });

    $('.inbox-wysihtml5').wysihtml5({
        "locale" : "fr-FR",
        "stylesheets": [base_url_ajax+"assets/metronic/assets/global/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
    });

    $('#fileuploadreply').fileupload({
        url: base_url_ajax+'agent/jobs/uploadattachtemp',
        fileInput : $("#mail_attach_reply"),
        dataType : 'json',
        autoUpload : true,
        filesContainer : '#mailReplyFilesContainer'
    });

    $("#btnSendMail_reply").click(function() {
        var form_data = $("#fileuploadreply").serializeArray();
        $.ajax({
            'type' : 'post',
            'url' : base_url_ajax+'agent/inbox/sendmailjob',
            'data' : form_data,
            'success' : function(response) {
                fetchJobData(activeJob);
                $("#modal-view").modal("hide");
                toastr.success('Mail envoyÃ©');
                //$("#mail_reply_div").slideUp();
            }
        })
    });

    function uniqid (prefix, moreEntropy) {
        //  discuss at: http://locutusjs.io/php/uniqid/
        // original by: Kevin van Zonneveld (http://kvz.io)
        //  revised by: Kankrelune (http://www.webfaktory.info/)
        //      note 1: Uses an internal counter (in locutus global) to avoid collision
        //   example 1: var $id = uniqid()
        //   example 1: var $result = $id.length === 13
        //   returns 1: true
        //   example 2: var $id = uniqid('foo')
        //   example 2: var $result = $id.length === (13 + 'foo'.length)
        //   returns 2: true
        //   example 3: var $id = uniqid('bar', true)
        //   example 3: var $result = $id.length === (23 + 'bar'.length)
        //   returns 3: true

        if (typeof prefix === 'undefined') {
            prefix = ''
        }

        var retId
        var _formatSeed = function (seed, reqWidth) {
            seed = parseInt(seed, 10).toString(16) // to hex str
            if (reqWidth < seed.length) {
                // so long we split
                return seed.slice(seed.length - reqWidth)
            }
            if (reqWidth > seed.length) {
                // so short we pad
                return Array(1 + (reqWidth - seed.length)).join('0') + seed
            }
            return seed
        }

        var $global = (typeof window !== 'undefined' ? window : GLOBAL)
        $global.$locutus = $global.$locutus || {}
        var $locutus = $global.$locutus
        $locutus.php = $locutus.php || {}

        if (!$locutus.php.uniqidSeed) {
            // init seed with big random int
            $locutus.php.uniqidSeed = Math.floor(Math.random() * 0x75bcd15)
        }
        $locutus.php.uniqidSeed++

        // start with prefix, add current milliseconds hex string
        retId = prefix
        retId += _formatSeed(parseInt(new Date().getTime() / 1000, 10), 8)
        // add seed hex string
        retId += _formatSeed($locutus.php.uniqidSeed, 5)
        if (moreEntropy) {
            // for more entropy we add a float lower to 10
            retId += (Math.random() * 10).toFixed(8).toString()
        }

        return retId
    }
})