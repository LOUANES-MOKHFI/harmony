var source_objecttion = $("#entry-template-objection").html();
var template_content_objection = Handlebars.compile(source_objecttion);
var query_search_objection = "";



$('.show_objection_result').click(function(){
	loadobjection();
});


$( "#query_search_objection" ).keypress(function (e) {
	if (e.which == 13) {
		loadobjection();
		return false;    //<---- Add this line
	}
});

function loadobjection(){
	$('.objection-container').html('');
	query_search_objection  = $('#query_search_objection').val();
	query_search_objection = (query_search_objection) ? query_search_objection : -1;

	$.ajax({
		type : "POST",
		url : "agent/GetObjection/"+ref_campagne+"/"+query_search_objection+"/"+name_fichier+"/"+num_contact+"/"+user,
		dataType : "json",
		global : false,
		async : false,
		success : function(data_return) {
			//console.log('Get Objection data '+data_return)
			if(data_return=="0" || data_return.length==0){
				$('#li_objection').hide();
			}else{
				$('#li_objection').show();
				$.each(data_return, function(index, value) {
					var html = template_content_objection(value);
					$('.objection-container').append(html);
				});
			}


		}
	});

	var dataAgent={
		logAction:"recherche_objection",
		logref_campagne:ref_campagne,
		logref_fichier:ref_fichier,
		lognum_contact:num_contact,
	};
	agentLogAction(dataAgent);

}