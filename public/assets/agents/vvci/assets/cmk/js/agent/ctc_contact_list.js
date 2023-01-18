

function ctc_contact_list(){
	$.fn.editable.defaults.inputclass = 'form-control';
	//$.fn.editable.defaults.url = '../agent/agent/UpdateContact?num_contact='+num_contact+"&name_fichier="+name_fichier;
	$.fn.editable.defaults.mode = 'inline';
	var ref_campagne = $('#ref_campagne').val();


	$('#ctc_contact_list .editable').on('hidden', function(e, reason) {

		if (reason === 'save' || reason === 'nochange') {
			var $next = $(this).closest('tr').next().find('.editable');
			if ($('#autoopen').is(':checked')) {
				setTimeout(function() {
					$next.editable('show');
				}, 300);
			} else {
				$next.focus();
			}
		}
	});
}