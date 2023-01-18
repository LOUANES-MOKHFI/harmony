$('#default-suggestions-tel .typeahead').typeahead('destroy');
var source_row_ctc= $("#entry-template-info-ctc").html();
var template_row_ctc = Handlebars.compile(source_row_ctc);
/*$(function() {
 loadinfoprospect();
 });
 */
var champs_modifiable_creation_obligatoire = [];
var champs_modifiable_obligatoire = [];
var name_contact = "";


function loadinfoprospect(data_return,GetHistoContact){

	champs_modifiable_creation_obligatoire = [];
	champs_modifiable_obligatoire = [];
    $.each(data_return.planning,function(k,v) {
        $("#ctPlanningForm").find('[name="'+k+'"]').editable("setValue",moment(v,'HH:mm:ss'));
    })
	//LoadInterfaceAgentSKILS();
	var context;
	var is_required = false;
	var obligatoire = [];
	$('#ctc_contact_list').html('');

    $('#container_histo_ctc').parent().parent().slimScroll({
        height: '200px'
    });
	$('#container_histo_ctc').html('');
	$('.info-ctc-name').html('');
	var tels = [];

	$.each(data_return.data, function(index, value) {
		var html = template_row_ctc(value);
		obligatoire = value.obligatoire;

		if(value.disabled_field ===false && $.inArray( value.name_field, obligatoire )!== -1 && value.type_field_edit=="edit_creation"){
			champs_modifiable_creation_obligatoire.push(value.name_field);
		}


		if(value.disabled_field ===false && $.inArray( value.name_field, obligatoire )!== -1 && value.type_field_edit=="edit"){
			champs_modifiable_obligatoire.push(value.name_field);
		}
		if (value.name_field == "cmk_input_info_nom")
			name_contact = value.value_field;

		if (value.name_field == "cmk_input_info_tel1"
			&& value.value_field != "") {
			tels.push({v: value.value_field,i:'tel1'})
		}

		if (value.name_field == "cmk_input_info_tel2"
			&& value.value_field != "") {
			tels.push({v: value.value_field,i:'tel2'})
		}

        if (value.name_field == "cmk_input_info_tel3"
            && value.value_field != "") {
            tels.push({v: value.value_field,i:'tel3'})
        }

		if (value.name_field == "cmk_input_info_fax1"
			&& value.value_field != "") {
			tels.push({v: value.value_field,i:'fax1'})
		}
		if (value.name_field == "cmk_input_info_fax2"
			&& value.value_field != "") {
			tels.push({v: value.value_field,i:'fax2'})
		}
		if(typeof(global_televente_champs_raison_sociale) != "undefined"){
		if (value.label_field == global_televente_champs_raison_sociale) {
            global_televente_valeur_raison_sociale = value.value_field;
		}
		}


		$('#ctc_contact_list').append(html);
	});
	addons_rappel = "";
	if (is_rappel && !is_rappel_auto) {
		addons_rappel = ' <span class="label label-danger pulsate-regular-rappel">'+lbl_info_prospect_rappel+'</span>';
	}
	//alert(data_return.resume)
	var info_ctc_name = data_return.resume;
	if(info_ctc_name==""){
		if(name_contact==""){
			info_ctc_name = lbl_info_prospect_contact_num+" : "+num_contact
		}else{
			info_ctc_name = name_contact
		}
	}
	//console.log(obligatoire);
	$('.info-ctc-name').append(
		'&nbsp;' + info_ctc_name +' <button type="button" class="btn yellow-crusta btn-xs appel_auto_prog mode_auto_num" data-toggle="tooltip" data-placement="top"	title="Lancer la numÃ©rotation automatiquement"><i class="fa fa-phone"></i> NumÃ©rotation automatique</button> '+ addons_rappel);

	//console.log(is_reception,'Mode Reception');
	if(is_reception==1)  $('.info-ctc-name').append(' <span class="label label-info">'+lbl_info_prospect_reception+'</span>');
	jQuery('.pulsate-regular-rappel').pulsate({
		color: "#bf1c56"
	});

	$('#ctc_contact_list .editable-click').editable({


		emptytext : '----------',
		mode : 'popup',
		placement : 'right',
		pk : ref_campagne,
		url : base_url_ajax+'agent/agent/UpdateContact?num_contact='+num_contact+"&name_fichier="+name_fichier,

		validate: function(value) {
			id = $(this).attr('id')
			$('[data-idfield="'+id+'"]').attr('data-value',value)
			if($.trim(value) == '' && jQuery.inArray( $(this).attr('id'), obligatoire )!== -1) {
				return lbl_info_prospect_champs_obligatoire;
			}
		}
	});
    var option_tels_rappel = "";
    var option_tels = "";


	$('#tel_prefered_cmk').html('');

	var tels_list = tels.filter( onlyUnique ); // returns ['a', 1, 2, '1']
	//console.log(tels,'telstelstelstelstelstelstelstelstels');

	$.each(tels_list,function(i,item){

        option_tels += '<option value="'+item.i+'">'+item.v+'</option>'
        option_tels_rappel += '<option value="'+item.v+'">'+item.v+'</option>'
	})

	$('#tel_rappel_cmk_list').html(option_tels_rappel);
	$('#tel_prefered_cmk').html(option_tels);
    $('#tel_prefered_cmk').val(data_return.tel_prefered_cmk)

//	$.formUtils.suggest($('#tel_rappel_cmk'), tels);
	data_return = GetHistoContact;
	$('#container_histo_ctc').html('');
	$('#container_histo_ctc').html(contact_history(data_return.history,data_return.enreg_path));


	$("#timeLineItemsContainer").html(contact_timeline(data_return.timeline,data_return.enreg_path));


	$('#cmk_commentaires').val(data_return.observation);


	//console.log(champs_modifiable_creation_obligatoire);
	new_file = "";
}

function contact_timeline(data,enreg_path) {
	var htmlItems = '';
	$.each(data,function(k,v) {
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
		} else if (v.itemtype == '8') {
            htmlItems += '<li class="mt-item ' + (v.item_dir == 'IN' ? 'item-in' : 'item-out') + '" data-itemid="' + v.id + '" data-itemtype="' + v.itemtype + '">';
            htmlItems += '<div class="mt-timeline-icon bg-' + v.bgcolor + ' bg-font-' + v.bgcolor + ' border-grey-steel">';
            htmlItems += '<i class="' + v.icon + '"></i>';
            htmlItems += '</div>';
            htmlItems += '<div class="mt-timeline-content">';
            htmlItems += '<div class="mt-content-container">';
            htmlItems += '<div class="mt-title">';
            htmlItems += '<h3 class="mt-content-title">' + v.title + '</h3>';
            htmlItems += '</div>';
            htmlItems += '<div class="mt-author">';
            //htmlItems += '<div class="mt-avatar">';
            //htmlItems += '<img src="../assets/pages/media/users/avatar80_2.jpg" />';
            //htmlItems += '</div>';
            htmlItems += '<div class="mt-author-name">';
            htmlItems += '<a href="javascript:;" class="font-blue-madison">' + v.header + '</a>';
            htmlItems += '</div>';
            htmlItems += '<div class="mt-author-notes font-grey-mint">' + v.created + '</div>';
            htmlItems += '</div>';
            htmlItems += '<div class="mt-content border-grey-salt">';
            htmlItems += '<p>';
            htmlItems += v.description;
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
	return htmlItems;
}

function contact_history(data,enreg_path) {
	var html = '';
    //console.log("cthistory2");
    var currentObs = false;
    var nbQualifs = 0;
    var currentRs = 1;
    var currentMonth = 0;
    var currentRowMonth;
	$.each(data,function(k,value) {
		currentRowMonth = moment(value['obs_c_date_fin']).format('MM-YYYY');
		if (!currentMonth || currentRowMonth != currentMonth) {
            var monthLabel = moment(value['obs_c_date_fin']).format('MMMM YYYY');
            monthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
            html += '<tr class="histrow-group open" style="cursor:pointer" data-month="'+currentRowMonth+'"><td colspan="'+(value['filename'] != '' && recordings==1 ? '10' : '8')+'" class="ct_history_month_cell"><strong><i class="fa fa-minus-square-o"></i> '+monthLabel+'</strong></td></tr>';
			currentMonth = currentRowMonth;
		}
        if (currentObs != value.num_observation_contact) {
            nbQualifs++;
            currentObs = value.num_observation_contact;
            html = html.split('{%currentRs%}').join(currentRs);
            currentRs = 1;
            html += '<tr data-parent-month="'+currentRowMonth+'">';
            html += '<td rowspan="{%currentRs%}"> ' + date_format_fr(value['obs_c_date_debut']) + ' </td>';
            html += '<td rowspan="{%currentRs%}"> ' + date_format_fr(value['obs_c_date_fin']) + ' </td>';
            html += '<td rowspan="{%currentRs%}"> ' + (value['user_obs'] ? value['user_obs'] : '...') + ' </td>';
            html += '<td rowspan="{%currentRs%}"> ' + value['qualif'] + ' </td>';
            html += '<td rowspan="{%currentRs%}"> ' + value['obs_c_tel'] + ' </td>';
            html += '<td rowspan="{%currentRs%}"> ' + value['obs_c_poste'] + ' </td>';
            html += '<td rowspan="{%currentRs%}"> ' + (value['obs_c_observation'] != '' ? value['obs_c_observation'] : '...' ) + ' </td>';
            html += '<td rowspan="{%currentRs%}"> ' + date_format_fr(value['obs_c_date_rappel']) + ' </td>';
        } else {
        	currentRs++;
        	html += '<tr>';
		}
		if (value['filename'] != '' && recordings==1) {
			html += '<td>';
            html += '<button class="btn btn-xs btn-outline blue play_enreg_btn" data-grhtitle="" data-width="300px" data-ref_campagne="" data-ref_qualification="" data-ref_user="" data-selector="jquery_jplayer_'+k+'" data-index="'+k+'" data-ancestor="jp_container_'+k+'" data-enreg_path="'+enreg_path+'" data-filename="'+value['filename']+'"><i class="fa fa-play"></i> '+ lbl_button_play_enreg +'</button>';
			html +=	'</td>';
		}

		html += (recordings==1) ? '<td><a href="'+enreg_path+value['filename']+'" download><i class="fa fa-download"></i></a></td>' : '';
		html += '</tr>';
	});
    html = html.split('{%currentRs%}').join(currentRs);
    $("#histoContactNbQualifs").html(' <small>('+ct_details_history_info1+' <strong>'+nbQualifs+'</strong> '+ct_details_history_info2+')</small>')
	return html;
}



function contact_history_man(data,enreg_path) {
	var html = '';
	//console.log("cthistory2");
	var currentObs = false;
	var nbQualifs = 0;
	var currentRs = 1;
	$.each(data,function(k,value) {

		if (currentObs != value.num_observation_contact) {
			nbQualifs++;
			currentObs = value.num_observation_contact;
			html = html.split('{%currentRs%}').join(currentRs);
			currentRs = 1;
			html += '<tr>';
			html += '<td rowspan="{%currentRs%}"> ' + value['name_fichier'] + ' </td>';
			html += '<td rowspan="{%currentRs%}"> ' + date_format_fr(value['obs_c_date_debut']) + ' </td>';
			html += '<td rowspan="{%currentRs%}"> ' + date_format_fr(value['obs_c_date_fin']) + ' </td>';
			html += '<td rowspan="{%currentRs%}"> ' + (value['user_obs'] ? value['user_obs'] : '...') + ' </td>';
			html += '<td rowspan="{%currentRs%}"> ' + value['qualif'] + ' </td>';
			html += '<td rowspan="{%currentRs%}"> ' + value['obs_c_tel'] + ' </td>';
			html += '<td rowspan="{%currentRs%}"> ' + value['obs_c_poste'] + ' </td>';
			html += '<td rowspan="{%currentRs%}"> ' + (value['obs_c_observation'] != '' ? value['obs_c_observation'] : '...' ) + ' </td>';
			html += '<td rowspan="{%currentRs%}"> ' + date_format_fr(value['obs_c_date_rappel']) + ' </td>';
		} else {
			currentRs++;
			html += '<tr>';
		}
		html += '<td>';
		if (value['filename'] != '' && recordings==1) {
			html += '<button class="btn btn-xs btn-outline blue play_enreg_btn" data-grhtitle="" data-width="300px" data-ref_campagne="" data-ref_qualification="" data-ref_user="" data-selector="jquery_jplayer_'+k+'" data-index="'+k+'" data-ancestor="jp_container_'+k+'" data-enreg_path="'+enreg_path+'" data-filename="'+value['filename']+'"><i class="fa fa-play"></i> '+ lbl_button_play_enreg +'</button>';
		}
		html +=	'</td>';
		html += (recordings==1) ? '<td><a href="'+enreg_path+value['filename']+'" download><i class="fa fa-download"></i></a></td>' : '<td></td>';
		html += '</tr>';
	});
	html = html.split('{%currentRs%}').join(currentRs);
	return html;
}
function date_format_fr(date) {
	var arr = date.split(" ");
	var ndate = arr[0];
	var ntime = arr[1];
	ndate = ndate.split("-");

	return ndate[2]+"/"+ndate[1]+"/"+ndate[0]+" "+ntime;
}

function createEnregPlayer(index,selector,ancestor,filename,enreg_path,ref_campagne,ref_qualification,ref_user,grhtitle,width,element) {
    var html = '<div class="demo-player" '+(width ? 'style="width:'+width+'"' : '')+'>';
    html += '<div id="'+selector+'" data-filename="'+filename+'" class="jp-jplayer"></div>';
    html += '<div id="'+ancestor+'" class="jp-audio" role="application" aria-label="media player">';
    html += '<div class="jp-interface">';
    html += '<div class="jp-button jp-playpaus-button">';
    html += '<button class="jp-play" role="button" tabindex="0">play</button>';
    html += '</div>';
    html += '<div class="jp-time-rail">';
    html += '<div class="jp-progress">';
    html += '<div class="jp-seek-bar">';
    html += '<div class="jp-play-bar"></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="jp-button jp-volume-button">';
    html += '<button class="jp-mute" role="button" tabindex="0">max volume</button>';
    html += '</div>';
    html += '<div class="jp-volume-bar">';
    html += '<div class="jp-volume-bar-value"></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    element.replaceWith(html);

    $("#"+selector).jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                title: "",
                mp3: enreg_path+filename,

            });
            $(this).jPlayer("tellOthers","stop");
            $(this).jPlayer("play");
        },
        size : {
            width : '0px'
        },
        swfPath: "../../dist/jplayer",
        cssSelectorAncestor: "#"+ancestor,
        supplied: "mp3",
        wmode: "window",
        globalVolume: true,
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true
    });

}

$(document).on('click','.play_enreg_btn',function() {
    var index = $(this).data('index');
    var selector = $(this).data('selector');
    var ancestor = $(this).data('ancestor');
    var filename = $(this).data('filename');
    var enreg_path = $(this).data('enreg_path');
    var ref_qualification = $(this).data('ref_qualification');
    var ref_campagne = $(this).data('ref_campagne');
    var ref_user = $(this).data('ref_user');
    var grhtitle = $(this).data('grhtitle');
    var width = $(this).data('width');
    createEnregPlayer(index,selector,ancestor,filename,enreg_path,ref_campagne,ref_qualification,ref_user,grhtitle,width,$(this));
})

$(document).on('click','.ct_history_month_cell',function() {
    $("[data-parent-month='"+$(this).parent().data('month')+"']").toggle();
    $(this).parent().toggleClass("open").toggleClass("closed");
    $(this).find('i').toggleClass("fa-plus-square-o").toggleClass("fa-minus-square-o")
})