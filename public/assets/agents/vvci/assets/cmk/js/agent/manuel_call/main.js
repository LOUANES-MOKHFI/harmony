var str = "";
var display_dtmf = "none";
var tableTransfertSup = "";
var HISTOAPP = [];
var $no_appel_man =false;
$(document).on("click", '#originate_call', function() {

	if (is_web_phone){
		var checkSip = checkRegistred();
		if(!checkSip){
		return false;
		}
	}

	var poste = $('#poste_hidden').val();
	var cmk_select_numsortant = $('#cmk_select_numsortant').val();
	var cmk_manualcall_number = $('#cmk_manualcall_number').val();

	if(cmk_manualcall_number=="") return false;

	cmk_manualcall_number = cmk_manualcall_number.replace(/[^0-9]/gi, ''); // Replace everything that is not a number with nothing
	$('#cmk_manualcall_number').val(cmk_manualcall_number);
	if(type_global_prod=="man"){

		if(window.sessionStorage['HISTOAPP']!=undefined) {
			HISTOAPP = 	window.sessionStorage['HISTOAPP'].split(',');
		}else{
			HISTOAPP = [];
			//HISTOAPP.push($('#cmk_manualcall_number').val());
		}

		if(!$('#cmk_manualcall_number').prop('readonly')){
			HISTOAPP.push($('#cmk_manualcall_number').val());
			HISTOAPP= $.grep(HISTOAPP, function(v, k){
				return $.inArray(v ,HISTOAPP) === k;
			});
			var HISTOAPP = HISTOAPP.filter(function (el) {
				return el != '';
			});
			HISTOAPP = (HISTOAPP.length>3) ? HISTOAPP.slice(HISTOAPP.length-3) : HISTOAPP;
			var optionListPhone = '';
			$.each( HISTOAPP,function(i,item){
				if(item!="")
					optionListPhone += '<option value="'+item+'">';
			})

			$('#PhoneList').html(optionListPhone);

			$('#ref_qualif_prd_man').html('');

			$.ajax({
				url : "agent/play",
				type : "post",
				global : false,
				data : 'user=' + user + '&poste=' + poste,
				dataType : 'json',
				async : false,
				success : function(data_result) {
					//console.log(data_result)
					$no_appel_man = data_result.data_prd;
				}
			});

			if($no_appel_man!=false){
				ref_campagne  = $no_appel_man.ref_campagne;
				ref_fichier = $no_appel_man.ref_fichier;
				name_campagne = $no_appel_man.name_campagne;
				name_fichier = $no_appel_man.name_fichier;

			}else{
				ref_campagne  = "";
				ref_fichier ="";
				name_campagne ="";
				name_fichier = "";
				show_msg_log('','warning')
				return false;
			}





			//par ici le traitement des alertes
			//systÃ¨me d'alerte s'il veut appeler un numÃ©ro dÃ©passant le quota des qualifications (appels)

			var data_notif_tentative = false;
			$.ajax({
				type: 'post',
				url: base_url_ajax + 'agent/agent/VerifqualifContactAjax',
				async: false,
				dataType: 'json',
				data: {
					ref_fichier: ref_fichier,
					name_fichier: name_fichier,
					tel: cmk_manualcall_number,
				},
				success: function (response) {
					if (response.bloquer_qualification) {

						data_notif_tentative = {
							message : response.bloquer_qualification_msg
						};

					}else{
						data_notif_tentative = false;
					}
				}
			})


			if(data_notif_tentative==false){


				status_number  = checkNumber();
				if(status_number==0){
					if(confirm(lbl_msg_waring_number_phone_contact)) {
						processProdManuel();
						processCallManuel();
					}else{
						return false;
					}
				}else{
					processProdManuel();
					processCallManuel();
				}

			}else{


				bootbox.confirm({
					message: data_notif_tentative.message,
					callback: function (result) {
						if (result) {
							status_number = checkNumber();

							if(status_number==0){
								if(confirm(lbl_msg_waring_number_phone_contact)) {
									processProdManuel();
									processCallManuel();
								}else{
									return false;
								}
							}else{
								processProdManuel();
								processCallManuel();
							}
						}
					},
					buttons: {
						confirm: {
							label: 'Poursuivre',
							className: 'blue'
						},
						cancel: {
							label: 'Annuler',
							className: 'default'
						}
					}
				});

			}

		}else{

			show_msg_log(msg_statuer_appel, 'warning');
			return false;
		}
	}else {
		ref_campagne = $('#ref_campagne').val();
		ref_fichier = $('#ref_fichier').val();
		status_number = checkNumber();
		if(status_number==0){
			if(confirm(lbl_msg_waring_number_phone_contact)) {
				processCallManuel();
			}else{
				return false;
			}
		}else{
			processCallManuel();
		}
	}


	/*data_options = {
		ref_campagne : ref_campagne,
		cmk_select_numsortant : cmk_select_numsortant,
		cmk_manualcall_number : cmk_manualcall_number,
		ref_fichier : ref_fichier,
		name_fichier : name_fichier,
		tel : cmk_manualcall_number,
		num_contact : num_contact
	};
	addObsctel(cmk_manualcall_number);
	addObscclid(cmk_select_numsortant);


	$.ajax({
		url : "agent/CallMannuel",
		type : "post",
		data : data_options,
		success : function(data_return) {
			console.log(data_return)

		}
	});*/



});

function checkNumber(){
	var cmk_select_numsortant = $('#cmk_select_numsortant').val();
	var cmk_manualcall_number = $('#cmk_manualcall_number').val();
	var status_number = 1;
	$.ajax({
		type: "POST",
		url: "agent/checkNumber",
		data: {
			ref_campagne : ref_campagne,
			cmk_select_numsortant : cmk_select_numsortant,
			cmk_manualcall_number : cmk_manualcall_number,
			ref_fichier : ref_fichier,
			name_fichier : name_fichier,
			tel : cmk_manualcall_number,
			num_contact : num_contact
		},
		dataType: 'json',
		async: false,
		global: false,
		success : function(data_return) {
			//console.log(data_return)
			status_number =  (data_return.msg=="1") ? 1 : 0;

		}
	});



	return status_number;
}
function processCallManuel() {



	var cmk_select_numsortant = $('#cmk_select_numsortant').val();
	var cmk_manualcall_number = $('#cmk_manualcall_number').val();

	//si la case de non indexation est cochÃ©
	if($('#no_index').is(':checked')){
		data_options = {

			cmk_select_numsortant : cmk_select_numsortant,
			cmk_manualcall_number : cmk_manualcall_number,
			tel : cmk_manualcall_number,
			num_contact : -2


		};
	}else{
		data_options = {
			ref_campagne : ref_campagne,
			cmk_select_numsortant : cmk_select_numsortant,
			cmk_manualcall_number : cmk_manualcall_number,
			ref_fichier : ref_fichier,
			name_fichier : name_fichier,
			tel : cmk_manualcall_number,
			num_contact : num_contact
		};
	}


	if(type_global_prod!="" && ($('.bloc_attente').css('display') == 'none')){
		addObsctel(cmk_manualcall_number);
		addObscclid(cmk_select_numsortant);
	}



	$.ajax({
		url : "agent/CallMannuel",
		type : "post",
		data : data_options,
		success : function(data_return) {
			//console.log(data_return)

		}
	});



}

function processProdManuel(){


	var cmk_manualcall_number = $('#cmk_manualcall_number').val();




	$('#ref_qualif_prd_man').html('<option></option>');
	option_list_qualif = $.ajax({
		url: base_url_ajax+"formbuilder/formbuilder/LoadQualifElement",
		async: false,
		type: "post", // 'get' or 'post', override for form's 'method'
		data: 'ref_campagne=' + ref_campagne
	}).responseText;

	$('#ref_qualif_prd_man').append(option_list_qualif)


	$('#ref_fichier').val(ref_fichier);
	$('#ref_campagne').val(ref_campagne);
	$('.bloc_man_prod').removeClass('hidden');
	$('button.valider_man_prod').data('action','valider_man_prod')
	$('.not_bloc_man_prod').addClass('hidden');
	$('.default_prod').addClass('hidden');



	$('#obs_c_tel_histo').val('');
	$('#obs_c_clid_histo').val('');

	$.ajax({
		url : "agent/GetDateDebutIntial",
		global : false,
		async : false,
		success : function(data_result) {
			cmk_date_debut_init = $.trim(data_result);
			cmk_date_debut = cmk_date_debut_init
		}
	});


	window.sessionStorage['HISTOAPP'] = HISTOAPP.join(',');
	window.sessionStorage['num_contact'] = num_contact;
	window.sessionStorage['name_fichier'] = name_fichier;
	window.sessionStorage['ref_fichier'] = ref_fichier;
	window.sessionStorage['ref_campagne'] = ref_campagne;
	create_contact_man_prod(cmk_manualcall_number,ref_fichier);
	if(cmk_manualcall_number_activate_readonly=="true"){
		$('#cmk_manualcall_number').attr('readonly',true);
	
	}
	$('.close_modal_man_call').addClass('hidden');
	$('.bloc_man_prod_qualif').removeClass('hidden');
	$('.alert-man-rappel').addClass('hidden');
	InitAgent('PRODUCTION', '')

}


$(document).on("keypress", '#cmk_manualcall_number', function(e) {


	var key = e.which;
	if(key == 13)  // the enter key code
	{
		var poste = $('#poste_hidden').val();
		var cmk_select_numsortant = $('#cmk_select_numsortant').val();
		var cmk_manualcall_number = $('#cmk_manualcall_number').val();

		if(cmk_manualcall_number=="") return false;

		cmk_manualcall_number = cmk_manualcall_number.replace(/[^0-9]/gi, ''); // Replace everything that is not a number with nothing
		$('#cmk_manualcall_number').val(cmk_manualcall_number);
		if(type_global_prod=="man"){

			$('#ref_qualif_prd_man').html('')

			$.ajax({
				url : "agent/play",
				type : "post",
				global : false,
				data : 'user=' + user + '&poste=' + poste,
				dataType : 'json',
				async : false,
				success : function(data_result) {
					//console.log(data_result)
					$no = data_result.data_prd;



				}
			});


			ref_campagne  = $no.ref_campagne;
			ref_fichier = $no.ref_fichier;
			name_campagne = $no.name_campagne;
			name_fichier = $no.name_fichier;



			$('#ref_qualif_prd_man').html('<option></option>');
			option_list_qualif = $.ajax({
				url: base_url_ajax+"formbuilder/formbuilder/LoadQualifElement",
				async: false,
				type: "post", // 'get' or 'post', override for form's 'method'
				data: 'ref_campagne=' + ref_campagne
			}).responseText;

			$('#ref_qualif_prd_man').append(option_list_qualif)


			$('#ref_fichier').val(ref_fichier);
			$('#ref_campagne').val(ref_campagne);
			$('.bloc_man_prod').removeClass('hidden');
			$('button.valider_man_prod').data('action','valider_man_prod')
			$('.not_bloc_man_prod').addClass('hidden');
			$('.default_prod').addClass('hidden');



			$('#obs_c_tel_histo').val('');
			$('#obs_c_clid_histo').val('');
			$.ajax({
				url : "agent/GetDateDebutIntial",
				global : false,
				async : false,
				success : function(data_result) {
					cmk_date_debut_init = $.trim(data_result);
					cmk_date_debut = cmk_date_debut_init
				}
			});

			create_contact_man_prod(cmk_manualcall_number,ref_fichier);


			window.sessionStorage['num_contact'] = num_contact;
			window.sessionStorage['name_fichier'] = name_fichier;
			window.sessionStorage['ref_fichier'] = ref_fichier;
			window.sessionStorage['ref_campagne'] = ref_campagne;
			if(cmk_manualcall_number_activate_readonly=="true"){
				$('#cmk_manualcall_number').attr('readonly',true);
			}
			$('.close_modal_man_call').addClass('hidden');
			$('.bloc_man_prod_qualif').removeClass('hidden');
			$('.alert-man-rappel').addClass('hidden');
			InitAgent('PRODUCTION', '')

		}else {
			ref_campagne = $('#ref_campagne').val();
			ref_fichier = $('#ref_fichier').val();
		}
		data_options = {
			ref_campagne : ref_campagne,
			cmk_select_numsortant : cmk_select_numsortant,
			cmk_manualcall_number : cmk_manualcall_number,
			ref_fichier : ref_fichier,
			num_contact : num_contact
		};
		addObsctel(cmk_manualcall_number);
		$.ajax({
			url : "agent/CallMannuel",
			type : "post",
			data : data_options,
			success : function(data_return) {
				//console.log(data_return)

			}
		});
	}


});

$(document).on("click", '#hangup_call,#stop_echo_test', function() {

	$.ajax({
		url : base_url_ajax+"agent/agent/Raccrocher",
		success : function(data_return) {
			//console.log(data_return)

		}
	});
});
var TimeTransfertAgent;
var TimeTransfertSup;
var in_prod_mode_transfert;
$(document).on("click", '.GetTransfert', function() {
	LoadDataLisedTransfert();
	TimeTransfertSup= setInterval( function () {
		tableTransfertSup.ajax.reload();
	}, 10000 );
	if($('.cdashboard').hasClass('in_prod_mode')) {
		in_prod_mode_transfert = 1;

	}else{
		in_prod_mode_transfert = 0;

	}
	LoadTransfertAgent();
	TimeTransfertAgent= setInterval( function () {
		LoadTransfertAgent();


	}, 10000 );

	TimeTransfertAgentCss  = setInterval(function(){ $('#LoadDataLisedTransfertAgent tr').find('td').removeClass('sorting_1');}, 1);
});


$(document).on('click','.SplitRecordAct',function(){


	var r = confirm("Etes-vous sur de vouloir diviser l'enregistrement Ã  partir de ce moment?");
	if (r == true) {
		//var user=$('#cmk_id_user').val();
		//var poste=$('#cmk_poste_user').val();
		//var datatopost='cmk_switch_function=CMK_SPLITREC'+ '&poste='+poste+'&user='+user;
		$.ajax({
			url : "agent/splitMonitorFileName",
			success : function(data_return) {
				//console.log(data_return);

			}
		});
	}
	return false;





})


$('#transfer_list').on('hidden.bs.modal', function (e) {
	clearInterval(TimeTransfertSup);
	clearInterval(TimeTransfertAgent);
	clearInterval(TimeTransfertAgentCss);
});



$(function() {
	function reposition() {
		var modal = $(this),
			dialog = modal.find('.modal-dialog');
		modal.css('display', 'block');

		// Dividing by two centers the modal exactly, but dividing by three
		// or four works better for larger screens.
		dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
	}
	// Reposition when a modal is shown
	$('#modal-appel-manuel').on('show.bs.modal', reposition);
	// Reposition when the window is resized
	$(window).on('resize', function() {
		$('#modal-appel-manuel:visible').each(reposition);
	});
});

$('#modal-appel-manuel').on('hidden.bs.modal', function() {
	str = "";

	if(userCurrentState=="SUCCESSPLAY"){
		$('.no_index').show();
	}else{
		$('.no_index').hide();
	}

	$("#cmk_manualcall_number").val('');
	$('.dtmf_bloc').hide();

	$('#cmk_manualcall_number').attr("disabled",false);
	$('#cmk_manualcall_label').hide();
	$('#no_index').prop('checked',false);
    $('#no_index').uniform();

});

$('#modal-appel-manuel').on('show.bs.modal', function(event) {
	//GetListmSortatnt();
	str = "";
	//$("#cmk_manualcall_number").val('');

	$('#no_index').prop('checked',false);
    $('#no_index').uniform();
	var fromMenu =$(event.relatedTarget).data('from-menu');

	if(fromMenu==1){
		$("#cmk_manualcall_number").val('');
		$('#obs_c_tel_histo').val('');
		$('#obs_c_clid_histo').val('');
	}

	if(userCurrentState=="PLAY"){
		$('#obs_c_tel_histo').val('');
		$('#obs_c_clid_histo').val('');
	}

	if(userCurrentState=="SUCCESSPLAY"){
		$('.no_index').show();
	}else{
		$('.no_index').hide();
	}

	//console.log("xTriggered ::::::::::::::: " + str)
});
$(document).on("click", '.show_dtmf', function() {
	$('.dtmf_bloc').slideToggle('fadeIn');

});

// Manuel
$(document).on("click", ".call_contact", function() {


	$(".bootbox").modal("hide");
	$('#modal-add-event').modal('hide');
	$('#modal-rappel-calendar').modal('hide');
	$('#modal-gestioncontacts').modal('hide');

	$('.tooltip').remove();
	//if (mainCalendar) $("#calendar").fullCalendar("refetchEvents");
	ref_campagne = $(this).data('ref_campagne');
	ref_fichier = $(this).data('ref_fichier');
	num_contact = $(this).data('num_contact');
	name_fichier = $(this).data('name_fichier');
	is_rappel_auto = 0;
	var id_lost_call = 0;
	if ($(this).data('is_lost_call') && $(this).data('id_recept') != '') {
		id_lost_call = $(this).data('id_recept');
		$.ajax({
			type : 'POST',
			url : base_url_ajax+'agent/agent/setReceptContact',
			data : {
				ref_fichier : ref_fichier,
				num_contact : num_contact,
				id_recept : id_lost_call
			}
		})
	}
	s_is_recept=0;
	if ($(this).data('is_recept')){
		s_is_recept =$(this).data('is_recept');
		s_is_recept=parseInt(s_is_recept);
	}

	name_campagne = $(this).data('name_campagne');
	is_rappel = $(this).data('is_rappel');
	is_rappel_auto = 0;
	poste = $('#poste_hidden').val();
	type_global_prod = $(this).data('type-prod');
	click_from = $(this).data('clickfrom');
	if(type_global_prod!="man"){

		$('.bloc_man_prod').addClass('hidden');
		$('button.valider_man_prod').data('action','valider_quick_qualif');
		$('.not_bloc_man_prod').removeClass('hidden');
		$('.default_prod').removeClass('hidden');

		cmk_manualcall_number =  $(this).data('tel');

		call_form_search = 1;

		GetListmSortatnt();

		SuccessPlay();
		if ($(this).data('makecall')) {
			data_options = {
				ref_campagne: ref_campagne,
				cmk_select_numsortant: $('#cmk_select_numsortant').val(),
				cmk_manualcall_number: cmk_manualcall_number,
				ref_fichier: ref_fichier,
				num_contact: num_contact,
			};
			if (rappel_launch_auto == 1) {
				//alert('Launch Call')
				addObsctel(cmk_manualcall_number);

				if (!s_is_recept) {
					$.ajax({
						url: "agent/CallMannuel",
						type: "post",
						data: data_options,
						success: function (data_return) {
							//console.log(data_return)

						}
					});
				}
			}
		}


	}else{
		cmk_manualcall_number =  $(this).data('tel');

		$('#ref_fichier').val(ref_fichier);
		$('#ref_campagne').val(ref_campagne);
		$('.bloc_man_prod').removeClass('hidden');
		$('button.valider_man_prod').data('action','valider_man_prod')
		$('.not_bloc_man_prod').addClass('hidden');
		$('.default_prod').addClass('hidden');
		$('#cmk_manualcall_number').val(cmk_manualcall_number)
		$('#ref_qualif_prd_man').html('<option></option>');
		option_list_qualif = $.ajax({
			url: base_url_ajax+"formbuilder/formbuilder/LoadQualifElement",
			async: false,
			type: "post", // 'get' or 'post', override for form's 'method'
			data: 'ref_campagne=' + ref_campagne
		}).responseText;

		$('#ref_qualif_prd_man').append(option_list_qualif)
		$('#modal-appel-manuel').modal('show');

		GetListmSortatnt();


	}

});

//appel manuel from recherche
$(document).on("click", ".appel_manuel_search", function(e) {
	e.preventDefault();

	var tel = $(this).data('tel');
	$('#ref_campagne').val($(this).data('ref_campagne'));
	$('#ref_fichier').val($(this).data('ref_fichier'));
	num_contact = $(this).data('num_contact');
	name_fichier = $(this).data('name_fichier');
	$('#modal-appel-manuel').modal('show');
	$('#cmk_manualcall_number').val(tel);
	//if($('.cdashboard').hasClass('in_prod_mode'))  $('#originate_call').click();
	setTimeout(function () {
		$('#originate_call').click();
	}, 500);
});

//appel manuel from info contact
$(document).on("click", ".appel_manuel", function(e) {
	e.preventDefault();
	$('#cmk_manualcall_number').val("");


	var tel = $(this).attr('data-value');

	$('#cmk_manualcall_number').val(tel);
	if($(this).data('hide-field')==0){
		$('#modal-appel-manuel').modal('show');
	}else{
		if(!$('.in_call').hasClass('hidden')) $('#li_appel_manuel').hide();
	}

	if(softphone == 1) {
		$('#cmk_manualcall_number').attr("disabled",false);
	} else {
		$('#cmk_manualcall_number').attr("disabled",true);
	}
	if (current_grp_conf_telecom.num_out != "-3") {
		setTimeout(function () {
			$('#originate_call').click();
		}, 500);
	}


	//console.log($(this).data('hide_tel'));
	//console.log($(this).data('label_field'));
	//console.log($(this));
	if( $(this).data('hide_tel')=='1') {
		$('#cmk_manualcall_number').hide();

		var label_field= $(this).data('label_field');
		$('#cmk_manualcall_label').html(label_field);
		$('#cmk_manualcall_label').show();

	} else {
		$('#cmk_manualcall_number').show();
	}


});

//appel  manuel from transfert
$(document).on("click", ".call_contact_transfert", function() {

	ref_campagne = $(this).data('ref_campagne');
	ref_fichier = $(this).data('ref_fichier');
	num_contact = $(this).data('num_contact');
	name_fichier = $(this).data('name_fichier');
	cmk_manualcall_number = $(this).data('call_number');
	cmk_select_numsortant = $('#cmk_select_numsortant').val();
	data_options = {
		ref_campagne : ref_campagne,
		cmk_select_numsortant : cmk_select_numsortant,
		cmk_manualcall_number : cmk_manualcall_number,
		ref_fichier : ref_fichier,
		num_contact : num_contact
	};
	//console.log(data_options);
	addObsctel(cmk_manualcall_number);

	$.ajax({
		url : "agent/CallMannuel",
		type : "post",
		data : data_options,
		success : function(data_return) {
			//console.log(data_return)

		}
	});

});

//ListTransfert

function LoadDataLisedTransfert() {

	$('#LoadDataLisedTransfert').dataTable({

		"bDestroy" : true,
		"width" : "100%",
		"bServerSide" : false,
		"sAjaxSource" : "agent/GetListTransfert",
		"bProcessing" : true,

		"fnServerParams" : function(aoData) {

			aoData.push({
				"name" : 'ref_campagne',
				"value" : ref_campagne
			}, {
				"name" : 'ref_fichier',
				"value" : ref_fichier
			}, {
				"name" : 'num_contact',
				"value" : num_contact
			});

		},
		"fnServerData" : function(sSource, aoData, fnCallback) {
			$.getJSON(sSource, aoData, function(json) {
				fnCallback(json)

			});
		},
		"fnDrawCallback" : function(data) {
			//$('th').show()
		}
	});

}


$('#transfer_list').on('shown.bs.modal', function (e) {


	if(userCurrentState=="SUCCESSPLAY"){
		$('.tab_transfert_list_agent').removeClass('hidden').addClass('active');
		$('a[href="#tab_15_3"]').tab('show');
		$('a[href="#tab_15_1"]').parent().removeClass('active');
		$('#tab_15_1').removeClass('active');
	}else{
		$('.tab_transfert_list_agent').addClass('hidden').removeClass('active');
		$('a[href="#tab_15_1"]').tab('show');
		$('a[href="#tab_15_3"]').parent().removeClass('active');
		$('#tab_15_3').removeClass('active');
	}

	tableTransfertSup = $('#LoadDataLisedTransfertSuperviseur').DataTable({

		"bDestroy" : true,
		"width" : "100%",
		"bServerSide" : false,
		"sAjaxSource" : "agent/GetTransfertListSup",
		"bProcessing" : true,

		"fnServerParams" : function(aoData) {

			aoData.push({
				"name" : 'ref_campagne',
				"value" : ref_campagne
			}, {
				"name" : 'ref_fichier',
				"value" : ref_fichier
			}, {
				"name" : 'num_contact',
				"value" : num_contact
			});

		},
		"fnServerData" : function(sSource, aoData, fnCallback) {
			$.getJSON(sSource, aoData, function(json) {
				fnCallback(json)

			});
		},
		"fnDrawCallback" : function(data) {
			//$('th').show()
		}
	});
});





//Transert Appel Action

function CMK_transfert_blind(dest,campagne,fichier,contact) {

	var sortant=$('#cmk_select_numsortant').val();
	$.ajax({
		url : "agent/CMK_TRANSFER_CALL_Now", // override for form's 'action' attribute
		type : "post", // 'get' or 'post', override for form's 'method' attribute
		data : 'dest=' + dest +'&campagne=' + campagne+'&fichier=' + fichier+'&contact=' + contact+'&sortant=' + sortant+'&current_tel_contact=' + $('#obs_c_tel_histo_last').val() ,
		success : function(data_result) {
			//cmk_status_comm_chr_Stop();cmk_status_pa_chr_Start();
		}
	});

}

function CMK_transfert_attended(dest,userdest,campagne,fichier,contact,sendcontact) {
	var sortant=$('#cmk_select_numsortant').val();
	if (contact==0){
		if (window.sessionStorage['num_contact']){
			contact=window.sessionStorage['num_contact'];
		}
	}
	$.ajax({
		url : "agent/CMK_TRANSFER_CALL2", // override for form's 'action' attribute
		type : "post", // 'get' or 'post', override for form's 'method' attribute
		data : {
            dest : dest,
            campagne : campagne,
            fichier : fichier,
            contact : contact,
            sortant : sortant,
			userdest : userdest,
            current_tel_contact : $('#obs_c_tel_histo_last').val(),
            sendcontact : sendcontact
		},
		success : function(data_result) {
			if (data_result != '0') {
				toastr.success('Transfert en cours vers le poste : '+dest);
			} else {
				toastr.error('Transfert Ã©chouÃ©');
			}
			//cmk_status_comm_chr_Stop();
			//cmk_status_pa_chr_Start();
		}
	});
}

function handleUserAtxferProgress(userdest,postedest,channel) {
	$("button.user_atxfer_action").removeClass("hidden").data('userdest',userdest).data('postedest',postedest).data('channel',channel);
}

$(".user_atxfer_confirm").click(function() {
	var userdest = $(this).data("userdest");
	var postedest = $(this).data("postedest");
	var sendcontact = $(this).data("sendcontact");
    CMK_transfert_attended(postedest,userdest,ref_campagne,ref_fichier,num_contact,sendcontact);
})

$(".user_atxfer_cancel").click(function() {
	var channel = $(this).data("channel");
	$.ajax({
		type : 'POST',
		url : base_url_ajax+"agent/agent/cancelAtXFER",
		data : {
			channel : channel
		},
		success : function(response) {
			$('.user_atxfer_action').addClass("hidden");
		}
	})

})
function CMK_transfert_attended_fiche(user,userdest,poste,postedest,num_groupe,num_contact){


	//alert('poste '+poste+" / postedest "+postedest);

	var cmk_tel_contact= "";
	obs_c_tel_histo = $('#obs_c_tel_histo').val();
	if(sRemoteNumber){
		TsRemoteNumber =  sRemoteNumber.split(' ');
		cmk_tel_contact=  TsRemoteNumber[0];//$('#cmk_manualcall_number').val();
	}else{
		Tobs_c_tel_histo = obs_c_tel_histo.split(',');
		cmk_tel_contact = (Tobs_c_tel_histo.length==1) ? obs_c_tel_histo : Tobs_c_tel_histo[Tobs_c_tel_histo.length];
	}

	cmk_tel_contact = (!cmk_tel_contact) ?  telcall_auto_trans : cmk_tel_contact;

	var datatopost='user='+user+'&userdest='+userdest+'&poste='+poste+'&postedest='+postedest+'&num_groupe='+num_groupe+'&num_contact='+num_contact+'&cmk_tel_contact='+cmk_tel_contact+'&type=3';
	$('#transfer_alert_div').html('');
	//alert(datatopost);

	$.ajax({
		url : "agent/CMK_TRANSFER_CALL3_now", // override for form's 'action' attribute
		type : "post", // 'get' or 'post', override for form's 'method' attribute
		data: datatopost,
		success: function(data_result){
			var alertTrsfrtText='TRANSFER ORDERED, please wait while the callee is still online with you, click on "Cancel transfert" to cancel the order<br/>';
			alertTrsfrtText +='<a onclick="CMK_CANCEL_transfert_attended_fiche('+user+','+userdest+','+num_groupe+','+num_contact+');">CANCEL TRANSFERT</a>';
			$('#transfer_alert_div').html(alertTrsfrtText);
			is_transfered = 1;
		}
	});


}
function CMK_CANCEL_transfert_attended_fiche(user,userdest,num_groupe,num_contact){
	var datatopost='user='+user+'&userdest='+userdest+'&num_groupe='+num_groupe+'&num_contact='+num_contact;
	$('#transfer_alert_div').html('');
	//alert(datatopost);
	$.ajax({
		url: "agent/CMK_CANCEL_TRANSFER_CALL3_Now", // override for form's 'action' attribute
		type: "post", // 'get' or 'post', override for form's 'method' attribute
		data: datatopost,
		success: function(data_result){
			$('#transfer_alert_div').html("TRANSFER CANCELED");
		}
	});
}

function CMK_transfert_aveugle(){
	alert('Transfert Aveugle Not Yet Implemented');
}

//Nouveau transfert
$(document).on("click", "#new_transfert", function() {
	$('#transfer_list').modal('hide');
	$('#NewTransfert').modal('show');

});


$(document).on("click", ".transfert_direct_new", function() {
	var dest = $('#numero_transfert').val();

	if(dest==""){
		show_msg_log(lbl_intorduire_num_transfert_error,'warning');
		return false;
	}
	var campagne=0;var fichier=0;
	if ($('#ref_campagne')) campagne=$('#ref_campagne').val();
	if ($('#ref_fichier')) fichier=$('#ref_fichier').val();

	CMK_transfert_blind(dest,campagne,fichier,0);

});

$(document).on("click", ".transfert_accomp_new", function() {
	var dest = $('#numero_transfert').val();
	if(dest==""){
		show_msg_log(lbl_intorduire_num_transfert_error,'warning');
		return false;
	}
	var campagne=0;var fichier=0;
	if ($('#ref_campagne')) campagne=$('#ref_campagne').val();
	if ($('#ref_fichier')) fichier=$('#ref_fichier').val();
	CMK_transfert_attended(dest,0,campagne,fichier,0);

});


var info_transfer = "";

var tableTransfertAgent  ="";
function LoadTransfertAgent(){



	$.ajax({
		type : 'POST',
		//async : false,
		url : "agent/GetTransfertListAgent",
		data: {
			ref_campagne : ref_campagne,
			ref_fichier : ref_fichier,
			num_contact : num_contact,
			in_prod : in_prod_mode_transfert
		},
		dataType :'json',
		success : function(response) {
			info_transfer = response.info_transfer;

			if(info_transfer){
				$('#transfer_alert_div').html('');
			}
			if (!tableTransfertAgent) {

				tableTransfertAgent = $('#LoadDataLisedTransfertAgent').DataTable({

					"bDestroy" : true,
					"width" : "100%",
					"data" : response.aaData,
					"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tout"]],

					"fnRowCallback": function(nRow, aData, iDisplayIndex) {
						/* Append the grade to the default row class name */
						//console.log(nRow,'fnRowCallback')
						$(nRow)
							.children()
							.each(
								function(index, td) {
									var html_td = $(td).html();


									switch (html_td) {

										case 'PRODUCTION':
											//console.log('Production')
											$(td)
												.addClass(
													"bg-green-soft bg-font-green-soft");
											$(td).css(
												"font-weight",
												"bold");
											$(td).css('text-align',
												'center');
											break;

										case 'EN_ATTENTE':
											$(td)
												.addClass(
													"bg-yellow-gold bg-font-yellow-gold");
											$(td).css(
												"font-weight",
												"bold");
											$(td).css('text-align',
												'center');
											break;

										case 'EN_LIGNE':
											$(td)
												.addClass(
													"bg-green-jungle bg-font-green-jungle");
											$(td).css(
												"font-weight",
												"bold");
											$(td).css('text-align',
												'center');

											break;

										case 'MENU':
											$(td)
												.addClass(
													"bg-blue-ebonyclay bg-font-blue-ebonyclay");
											$(td).css(
												"font-weight",
												"bold");
											$(td).css('text-align',
												'center');

											break;

										case 'POST_APPEL':
											$(td)
												.addClass(
													"bg-blue-steel bg-font-blue-steel");
											$(td).css(
												"font-weight",
												"bold");
											$(td).css('text-align',
												'center');
											break;
										case 'P_CAFE':
											$(td)
												.addClass(
													"bg-grey-cascade bg-font-grey-cascade");
											$(td).css(
												"font-weight",
												"bold");
											$(td).css('text-align',
												'center');
											break;
										case 'DEBRIEF':
											$(td)
												.addClass(
													"bg-grey-silver bg-font-grey-silver");
											$(td).css(
												"font-weight",
												"bold");
											$(td).css('text-align',
												'center');
											break;

										case 'EN_COMM':
											$(td)
												.addClass(
													"bg-green-jungle bg-font-green-jungle");
											$(td).css(
												"font-weight",
												"bold");
											$(td).css('text-align',
												'center');
											break;
										case 'NEN_COMM':
											$(td)
												.addClass(
													"bg-blue-sharp bg-font-blue-sharp");
											$(td).css(
												"font-weight",
												"bold");
											$(td).css('text-align',
												'center');
											$(td).html('--')
											break;
									}

								});
						return nRow;

					}
				});



			} else {
				tableTransfertAgent.clear().rows.add(response.aaData).columns.adjust().draw();
				//$("html, body").animate({ scrollTop: $('.form-actions').offset().top }, 2000);
			}
		},
		error : function(response) {
		}
	});
}

//demande Ozeol rechercher un tÃ©lÃ©phone dans tous la base de ses fichiers dans une seul campagne

$('#modal-appel-manuel').on('click','.search-history-phone-number',function () {
	var phone_number = $('#cmk_manualcall_number').val();
	$('.container_histo_ctc_man').html('');
	$('.histoContactNbQualifs').html('0');


	if(phone_number!=null && phone_number!="") {
		doSearchHistory(phone_number);
	}else{
	    show_msg_log(lbl_create_fiche_enter_number,'warning');
    }

});

function doSearchHistory(tel_search){
	//getAlltHitorique
	var htmlHistoSearch ="";
	var nbCountQualif = 0;
	$.ajax({
		type : 'POST',
		//async : false,
		url : "agent/getAlltHitorique",
		data: {
			tel : tel_search
		},
		dataType :'json',
		success : function(response) {
			$.each(response, function(index, r) {

				$.each(r,function (i,data_return_histo) {
					htmlHistoSearch += contact_history_man(data_return_histo.history,data_return_histo.enreg_path);
					nbCountQualif += data_return_histo.history.length;
				})

			});
			$('.container_histo_ctc_man').html(htmlHistoSearch);
			$(".histoContactNbQualifs").html(' <small>'+ct_details_history_info1+' <strong>'+nbCountQualif+'</strong> '+ct_details_history_info2+'</small>');

			$('.container_histo_ctc_man').parent().parent().slimScroll({
				height: '200px'
			});

			//HistDtTable.rows().invalidate().draw();
			$('#modal-details-historique').modal('show');

		}

	})
}

