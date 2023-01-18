function edit_details(contact,nom,tel,group) {
	$("#ctToEdit").val(contact);
	$.ajax({
		type : 'POST',
		url : base_url_ajax+'gestioncontacts/gestioncontacts/details/',
		data: { 'contact' : contact },
		success : function(response) {
			response = $.parseJSON(response);
			$("#ctInfo-form").html(contact_info(response.details));
			$("#ctHist-table").html(contact_history(response.history));
			/*$("#ctHist-table audio").mediaelementplayer({
				audioWidth: 280,
				audioHeight : 20,
				features: ['playpause','progress','current','duration','volume']
			});*/
			$("#selectNewQualif").select2("destroy");
			$("#selectNewQualif").html(contact_qualifddown(response.qualifs))
			$("#selectNewQualif").select2();
			$('#contactDetailInfo').slimScroll({
		        height: '300px'
		    });
			$('#contactHistory').slimScroll({
		        height: '200px'
			});

			$("#updateQualif1").iCheck("check");
			var ct_info = $.split(contact,'||');
			$("#contactDetails .modal-title").html(lbl_details_contact_n+ct_info[2]+'<small style="color:#fff;padding-left:15px"> <i class="fa fa-list"></i> '+group+'</small><small style="color:#fff;padding-left:15px"> <i class="fa fa-user"></i> '+nom+'</small><small style="color:#fff;padding-left:15px"> <i class="fa fa-phone"></i> '+tel+'</small>');
			$("#ctHistoryTab").tab("show");
			$("#addRappel").iCheck("uncheck");
			$("#updateQualif1").iCheck("check");
			$("#contactDetails").modal("show");
		}
	});
}

function contact_info(data) {
	var html = '';

	$.each(data,function(label,value) {
	html += '<div class="col-md-6 col-xs-12">';
	html += '<div class="form-group">';
	html += '<label class="control-label" for="detail_'+label+'"> '+label+' </label>';
	html += '<input type="text" class="form-control input-sm"';
	html += 'id="detail_'+label+'" name="detail_'+label+'" value="'+value+'">';
	html += '</div>';
	html += '</div>';
	});

	return html;
}

function date_format_fr(date) {
	var arr = date.split(" ");
	var ndate = arr[0];
	var ntime = arr[1];
	ndate = ndate.split("-");

	return ndate[2]+"/"+ndate[1]+"/"+ndate[0]+" "+ntime;
}
/*function contact_history(data) {
	var html = '';
	$.each(data,function(k,value) {
		html += '<tr><td> '+date_format_fr(value['obs_c_date_debut'])+' </td><td> '+date_format_fr(value['obs_c_date_fin'])+' </td>';
		html += '<td> '+ (value['user_obs'] ? value['user_obs'] : '...') +' </td><td> '+value['qualif']+' </td>';
		html += '<td> ' + (value['obs_c_tel']) + ' </td><td> ' + value['obs_c_poste'] + ' </td>';
		html += '<td> '+ (value['obs_c_observation'] != '' ? value['obs_c_observation'] : '...' ) +' </td>';
		html += '<td> '+ date_format_fr(value['obs_c_date_rappel']) +' </td>';
		//html += '<td> <audio id="player2" src="../media/test_record.mp3" type="audio/mp3" controls="controls"> </tr>';
		html += '<td> </td> </tr>';
	});
	return html;
}*/

function contact_qualifddown(data) {
	//console.log(data);
	var html = '';
	$.each(data,function(key,val) {
		if (val['children'].length > 0) {
			html += '<optgroup label="'+val['text']+'">';
			$.each(val['children'],function(keyc,valc) {
				html += '<option value="'+keyc+'">'+valc['text']+'</option>';
			});
			html += '</optgroup>';
		} else {
			html += '<option value="'+key+'">'+val['text']+'</option>';
		}

	});
	return html;
}
var ctInfoModified = false;
$(document).ready(function() {
	$("#ctInfo-form").on("change", "input", function() {
		ctInfoModified = true;
	});
});