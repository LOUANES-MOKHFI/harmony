var stats = "";
var search_contact = "";
var fiche_vierge = "";
var recordings = "";
var appel_manuel = "";
var exit_debrief = "";
var duplictc = "";
var get_reception = "";
var bdcon_read = "";
var bdcon_add = "";
var bdcon_edit = "";
var bdcon_delete = "";
function LoadInterfaceAgentSKILS(){


	$.ajax({
		type : "GET",
		url : base_url_ajax + "skillsgroup/skillsgroup/ListInterfaceAgent",
		data : "id=" + cmk_groupe_comptence,
		cache : false,
		async : false,
		dataType : "json",
		success : function(data_return) {
			$.each(data_return.data, function(key, value) {
				stats = value.stats.toString();
				search_contact = value.search_contact.toString();
				fiche_vierge = value.fiche_vierge.toString();
				recordings = value.recordings.toString();
				appel_manuel = value.appel_manuel.toString();
				exit_debrief  = value.exit_debrief;
				duplictc  = value.duplictc;
				get_reception = value.get_reception;
				bdcon_read= value.bdcon_read;
				bdcon_add = value.bdcon_add;
				bdcon_edit = value.bdcon_edit;
				bdcon_delete = value.bdcon_delete;
			});
		}
	});

	if (stats == 1)
		$('#li_stats').removeClass('hidden');
	else
		$('#li_stats').addClass('hidden');
	if (search_contact == 1)
		$('#li_search_contact').removeClass('hidden')
	else
		$('#li_search_contact').addClass('hidden');
	if (fiche_vierge == 1)
		$('#li_fiche_vierge').removeClass('hidden')
	else
		$('#li_fiche_vierge').addClass('hidden');
	if (recordings == 1)
		$('#li_recordings').removeClass('hidden')
	else
		$('#li_recordings').addClass('hidden');
	if (appel_manuel == 1) {
        $('#li_appel_manuel').removeClass('hidden');
		$('#cmk_originate_manuel_shortcut').removeClass('hidden');
    } else {
        $('#li_appel_manuel').addClass('hidden');
        $('#cmk_originate_manuel_shortcut').addClass('hidden');
    }

	if (exit_debrief == 1)
		$('.exitdebrief').removeClass('hidden');
	else
		$('.exitdebrief').addClass('hidden');

	if(get_reception==1)
		$('#lost_call').removeClass('hidden');
	else
		$('#lost_call').addClass('hidden');







}





