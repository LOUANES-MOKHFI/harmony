var span_rdv_contact;

function display_agenda(data_return){
	if (data_return != 0) {

		//console.log('show agendapartager! ');
		$('#agendapartager').removeClass('hidden');
		$('#tabagendapartager').removeClass('hidden');
		$("#rdvDiv").hide().appendTo($("#rdvHistoryDiv").parent());
		$.ajax({
			type : 'POST',
			url : base_url_ajax+'agent/calendar/gethistory',
			data : { 'ref_fichier' : ref_fichier , 'num_contact' : num_contact },
			dataType : 'json',
			success : function(response) {
				redraw_agenda();
				var htmlRdv = '<h2>Historique des RDVs</h2>';
				$.each(response,function(k,rdv) {
					//htmlRdv += '<div class="col-md-12" >';
					htmlRdv += '<div class="todo-tasklist-item todo-tasklist-item-border-green">';
					htmlRdv += '<div class="todo-tasklist-item-title">';
					htmlRdv += rdv.commercial;
					htmlRdv += '</div>';
					htmlRdv += '<div class="todo-tasklist-item-text">';
					htmlRdv += 'Observation : '+rdv.observation;
					htmlRdv += '</div>';
					htmlRdv += '<div class="todo-tasklist-controls pull-left">';
					htmlRdv += '<span class="todo-tasklist-date"><i class="fa fa-calendar"></i> '+moment(rdv.date).format('DD/MM/YYYY HH:mm')+' </span>';
					htmlRdv += '<span class="todo-tasklist-badge badge badge-roundless" style="background-color:'+rdv.statutcolor+'">'+rdv.statutrdv+'</span>';
					htmlRdv += '</div>';
					htmlRdv += '<div class="clearfix"></div>';
                    htmlRdv += '<div class="todo-tasklist-item-text">';
                    htmlRdv += 'Retour comm. : '+rdv.retour;
                    htmlRdv += '</div>';
					htmlRdv += '<div class="todo-tasklist-controls pull-left">';
					htmlRdv += '<button class="btn btn-xs blue modify-rdv" type="button" data-numrdv="'+rdv.num_rdv+'"><i class="fa fa-pencil"></i> Modifier</button>';
					htmlRdv += '</div>';
					htmlRdv += '</div>';
					htmlRdv += '</div>';
					//htmlRdv += '<hr>';


					//htmlRdv += '<div class="timeline-item">';
					//htmlRdv += '<div class="timeline-badge">';
					//htmlRdv += '<div class="timeline-icon">';
					//htmlRdv += '<i class="icon-calendar font-green-haze"></i>';
					//htmlRdv += '</div>';
					//htmlRdv += '</div>';
					//htmlRdv += '<div class="timeline-body">';
					//htmlRdv += '<div class="timeline-body-arrow"> </div>';
					//htmlRdv += '<div class="timeline-body-head">';
					//htmlRdv += '<div class="timeline-body-head-caption">';
					//htmlRdv += '<a href="javascript:;" class="timeline-body-title font-blue-madison">'+rdv.commercial+'</a>';
					//htmlRdv += '<span class="timeline-body-time font-grey-cascade">'+moment(rdv.date).format('DD/MM/YYYY HH:mm')+'</span>';
					//htmlRdv += '</div>';
					//htmlRdv += '</div>';
					//htmlRdv += '<div class="timeline-body-content">';
					//htmlRdv += '<span class="font-grey-cascade"> Observation : '+rdv.observation+' </span>';
					//htmlRdv += '</div>';
					//htmlRdv += '</div>';
					//htmlRdv += '</div>';

				});
				$("#rdvHistoryDiv").html(htmlRdv);
				if (response.length > 0) {
					var rdv = response[0];
					span_rdv_contact = '<small><span><strong>'+lbl_info_ctc_rdv_date+' :</strong> <i class="font-green fa fa-calendar"></i> '+moment(rdv.date).format('DD/MM/YYYY HH:mm')+' <strong>'+lbl_info_ctc_rdv_commercial+' :</strong> <i class="font-green fa fa-user"></i> '+rdv.commercial+'</span></small>';
				} else {
					span_rdv_contact = '';
				}

				$('.info-ctc-name').append('&nbsp;'+span_rdv_contact);
			}
		})

	} else {
		$('#agendapartager').addClass('hidden');
		$('#tabagendapartager').addClass('hidden');
	}
}