var fnBindToexcute = new Function();
var xundefined_variale = "";
var $messages = $('#error-message-wrapper');
var set_previous_active = "";
var current_ecran = "";
var num_qualification = "";
var cmk_input_type_rappel_final = 0;
var type_qualifcation = 0;
var argumente = 0;
var mail_global = 0;
var min_date = moment().add(1, 'days').calendar();
var max_date = moment().add(365, 'days').calendar();
var idScenario= -1;
//clearInterval(CHECKDEBRIEF_VAR_INTERVAL);
CHECKDEBRIEF_VAR_INTERVAL = "";
var curent_parent = null;
var form_id = '';
var previous = "";
var modesc = 'prod';

var $toastlast;
var myLanguage = {
	requiredFields: lbl_requiredFields,
	badTime: lbl_badTime,
	badEmail: lbl_badEmail,
	badDate: lbl_badDate,
	lengthBadStart: lbl_lengthBadStart,
	lengthBadEnd: lbl_lengthBadEnd,
	lengthTooLongStart: lbl_lengthTooLongStart,
	lengthTooShortStart: lbl_lengthTooShortStart,
	badUrl: lbl_badUrl,
	badInt: lbl_badInt,
	badStrength: lbl_badStrength,
	badNumberOfSelectedOptionsStart: lbl_badNumberOfSelectedOptionsStart,
	badNumberOfSelectedOptionsEnd: lbl_badNumberOfSelectedOptionsEnd,
	badAlphaNumeric: lbl_badAlphaNumeric,
	badAlphaNumericExtra: lbl_badAlphaNumericExtra,
	groupCheckedRangeStart: lbl_groupCheckedRangeStart,
	groupCheckedTooFewStart: lbl_groupCheckedTooFewStart,
	groupCheckedTooManyStart: lbl_groupCheckedTooManyStart,
	groupCheckedEnd: lbl_groupCheckedEnd,
	badCreditCard: lbl_badCreditCard,
	badCVV: lbl_badCVV,
	min: lbl_sc_min,
	max: lbl_sc_max
};

$('#content_ecran_conf').html('');

//$('.datepicker-default').datepicker();


if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (str) {
		return this.slice(0, str.length) == str;
	};
}

if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function (str) {
		return this.slice(-str.length) == str;
	};
}
String.prototype.containsstring = function (it) {
	return this.indexOf(it) != -1;
};


$(function () {
	moment.lang('fr');




});
//////////////////


/* helpers
 */

// runs an array of async functions in sequential order
function seq(arr, callback, index) {
	// first call, without an index
	if (typeof index === 'undefined') {
		index = 0
	}

	arr[index](function () {
		index++
		if (index === arr.length) {
			callback()
		} else {
			seq(arr, callback, index)
		}
	})
}

// trigger DOMContentLoaded
function scriptsDone() {
	var DOMContentLoadedEvent = document.createEvent('Event')
	DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true)
	document.dispatchEvent(DOMContentLoadedEvent)
}

/* script runner
 */

function insertScript($script, callback) {
	var s = document.createElement('script')
	s.type = 'text/javascript'
	if ($script.src) {
		s.onload = callback
		s.onerror = callback
		s.src = $script.src
	} else {
		s.textContent = $script.innerText
	}

	// re-insert the script tag so it executes.
	document.head.appendChild(s)

	// clean-up
	$script.parentNode.removeChild($script)

	// run the callback immediately for inline scripts
	if (!$script.src) {
		callback()
	}
}

// https://html.spec.whatwg.org/multipage/scripting.html
var runScriptTypes = [
	'application/javascript',
	'application/ecmascript',
	'application/x-ecmascript',
	'application/x-javascript',
	'text/ecmascript',
	'text/javascript',
	'text/javascript1.0',
	'text/javascript1.1',
	'text/javascript1.2',
	'text/javascript1.3',
	'text/javascript1.4',
	'text/javascript1.5',
	'text/jscript',
	'text/livescript',
	'text/x-ecmascript',
	'text/x-javascript'
]

function runScripts($container) {
	// get scripts tags from a node
	var $scripts = $container.querySelectorAll('script')
	var runList = []
	var typeAttr

	[].forEach.call($scripts, function ($script) {
		typeAttr = $script.getAttribute('type')

		// only run script tags without the type attribute
		// or with a javascript mime attribute value
		if (!typeAttr || runScriptTypes.indexOf(typeAttr) !== -1) {
			runList.push(function (callback) {
				insertScript($script, callback)
			})
		}
	})

	// insert the script tags sequentially
	// to preserve execution order
	seq(runList, scriptsDone)
}


/////////////

// ValidatorFn1_49();
var currentLanguage = ($('#currentLanguage').val() == 'us') ? 'en' : $('#currentLanguage').val();

var validatorConfig = {
	form: '#target',
	lang: currentLanguage,
	scrollToTopOnError: false,
	addValidClassOnAll: true
};

$.validate(validatorConfig);

$.fn.formIsValid = function () {
	var $form = $(this);
	if ($(this).isValid(currentLanguage, validatorConfig, true)) {
		return true;
	}
	$([document.documentElement, document.body]).animate({
		scrollTop: $form.find('.form-group.has-error').first().offset().top - 75
	}, 500);

	return false;
};

$(document).ready(function () {
	//DEBUT MODIFS HAMMA MODULE COMMENTAIRES

	$("#DialogQualificationSubmit").on('show.bs.modal', function () {
		if (type_global_prod == 'man') $("#cmk_commentaires_dupli").val($("#cmk_man_file_comment").val());
		else $("#cmk_commentaires_dupli").val($("#cmk_commentaires").val());
	})
	//FIN MODIFS HAMMA MODULE COMMENTAIRES
	$('.datepicker-default').datepicker({
		language: 'fr',
		autoclose: true
	});



	/*$.validate({
		form :'#target',
		language :myLanguage,
		errorMessagePosition : $messages,
		scrollToTopOnError : true,
		onError : function() {
			FnErrorForms()
		},
		onSuccess : function() {
			eval(fnBindToexcute);
			return false;
		},
		addValidClassOnAll : true
	});*/

	jQuery('body').trigger("date_picker");
	jQuery('body').trigger("time_picker");
});

function ContainString(data, search) {
	if (typeof (data) == 'undefined') return false;
	if (data.toLowerCase().containsstring(search.toLowerCase())) {
		return true;
	} else {
		return false;
	}
}

function EndWiths(data, search) {
	if (typeof (data) == 'undefined') return false;

	if (data.toLowerCase().endsWith(search.toLowerCase())) {
		return true;
	} else {
		return false;
	}
}

function BeginWiths(data, search) {
	if (typeof (data) == 'undefined') return false;

	if (data.toLowerCase().startsWith(search.toLowerCase())) {
		return true;
	} else {
		return false;
	}
}

function NContainString(data, search) {
	if (typeof (data) == 'undefined') return false;

	if (!data.toLowerCase().containsstring(search.toLowerCase())) {
		return true;
	} else {
		return false;
	}
}

function NEndWiths(data, search) {
	if (typeof (data) == 'undefined') return false;

	if (!data.toLowerCase().endsWith(search.toLowerCase())) {
		return true;
	} else {
		return false;
	}
}

function NBeginWiths(data, search) {
	if (typeof (data) == 'undefined') return false;

	if (!data.toLowerCase().startsWith(search.toLowerCase())) {
		return true;
	} else {
		return false;
	}
}

function FnEqual(data, search) {
	if (typeof (data) == 'undefined') return false;

	var type_data = jQuery.type(data);
	var type_search = jQuery.type(search);
	// alert(data+"==>"+type_search)
	if (type_data == "string" || type_search == "string") {
		if (data.toLowerCase() == search.toLowerCase()) {
			return true;
		} else {
			return false;
		}
	} else {

	}

}

function FnNull(data) {
	if (typeof (data) == 'undefined') return true;
	if (data == '') return true;

	return false;
}

function NFnNull(data) {
	if (typeof (data) == 'undefined') return false;
	if (data == '') return false;

	return true;
}

function NFnEqual(data, search) {
	if (typeof (data) == 'undefined') return false;

	var type_data = jQuery.type(data);
	var type_search = jQuery.type(search);
	if (type_data == "string" || type_search == "string") {
		if (data.toLowerCase() != search.toLowerCase()) {
			return true;
		} else {
			return false;
		}
	} else {
		if (data != search) {
			return true;
		} else {
			return false;
		}
	}

}

function FnLess(data, search) {
	if (typeof (data) == 'undefined') return false;

	if (data < search) {
		return true;
	} else {
		return false;
	}
}
$('#DialogQualificationSubmit').on('hidden.bs.modal', '.modal', function () {
	$('.modal-footer[data-qualif="true"]').hide();
	$('#set_qualification').html('');
	$('#prog_rappel').hide();
	$(this).removeData('bs.modal');
	$('#tel_rappel_cmk').val('');
	$('#tel_prefered_cmk').val('');


});

function clear_form_elements(id) {
	jQuery("#" + id).find(':input').each(function () {
		switch (this.type) {
			case 'password':
			case 'text':
			case 'textarea':
			case 'file':
				jQuery(this).val('');
				break;
			case 'checkbox':
			case 'radio':
				this.checked = false;
				break;
		}
	});

	$('.editable').parent().find('strong').removeClass('font-red');
	$('.info-ctc-close').click();
	$('#piece_jointe').addClass('hidden');

	jQuery("#" + id).find('select').each(function () {
		jQuery(this).val('');
	});
}

function FnLessOrEqual(data, search) {
	if (typeof (data) == 'undefined') return false;

	if (data <= search) {
		return true;
	} else {
		return false;
	}
}

function FnGreater(data, search) {
	if (typeof (data) == 'undefined') return false;

	if (data > search) {
		return true;
	} else {
		return false;
	}
}

function FnGreaterOrEqual(data, search) {
	if (typeof (data) == 'undefined') return false;

	if (data >= search) {
		return true;
	} else {
		return false;
	}
}

function FnIn(data, search) {
	if (typeof (data) == 'undefined') return false;
	if ($.inArray(search, data) !== -1) {
		return true;
	} else {
		return false;
	}
}

function NFnNi(data, search) {
	if (typeof (data) == 'undefined') return false;
	if ($.inArray(search, data) === -1) {
		return true;
	} else {
		return false;
	}
}

function Evaluer(ref_condition, form_id, element_id, method_ci, type) {
	/*console.log(ref_condition + "," + form_id + "," + element_id + ","
	 + method_ci + "," + type);
	 */
	$('.modal-footer[data-qualif="true"]').hide();
	$('#set_qualification').html('');
	$('.prog_rappel').hide();

	var status = {};
	var type_validations = {};
	var ref_ecrans = {};
	var ref_qualifications = {};
	var ref_mails = {};
	var ref_faxs = {};
	var ref_smss = {};
	var ref_depots = {};

	var type_validation_default_math = "";
	var ref_ecran_default_math = "";
	var ref_qualification_default_math = "";
	var ref_mail_default_math = "";
	var ref_fax_default_math = "";
	var ref_sms_default_math = "";
	var ref_depot_default_math = "";

	var type_validation_true_cnd_math = "";
	var ref_ecran_true_cnd_math = "";
	var ref_qualification_true_cnd_math = "";
	var ref_mail_true_cnd_math = "";
	var ref_fax_true_cnd_math = "";
	var ref_sms_true_cnd_math = "";
	var ref_depot_true_cnd_math = "";
	var tab_qualif = [];
	var sContent = $('#target').serialize();
	var rules_quota = false;

	$
		.ajax({
			type: "POST",
			url: base_url_ajax + "formbuilder/formbuilder/" + method_ci
				+ "/",
			data: "ref_condition=" + ref_condition + "&form_id=" + form_id
				+ "&" + sContent + '&element_id=' + element_id
				+ '&ref_campagne=' + ref_campagne + '&ref_fichier='
				+ ref_fichier + '&name_fichier=' + name_fichier
				+ "&num_contact=" + num_contact + "&num_user=" + user,
			async: false,
			dataType: 'json',
			success: function (data_return) {
				status = data_return.status;
				type_validations = data_return.type_validations;
				ref_ecrans = data_return.ref_ecrans;
				ref_qualifications = data_return.ref_qualifications;
				ref_mails = data_return.ref_mails;
				ref_faxs = data_return.ref_faxs;
				ref_smss = data_return.ref_smss;
				ref_depots = data_return.ref_depots;

				type_validation_default_math = data_return.type_validation_default;
				ref_ecran_default_math = data_return.ref_ecran_default;
				ref_qualification_default_math = data_return.ref_qualification_default;
				ref_mail_default_math = data_return.ref_mail_default;
				ref_fax_default_math = data_return.ref_fax_default;
				ref_sms_default_math = data_return.ref_sms_default;
				ref_depot_default_math = data_return.ref_depot_default;

				type_validation_true_cnd_math = data_return.type_validation_true_cnd;
				ref_ecran_true_cnd_math = data_return.ref_ecran_true_cnd;
				ref_qualification_true_cnd_math = data_return.ref_qualification_true_cnd;
				ref_mail_true_cnd_math = data_return.ref_mail_true_cnd;
				ref_fax_true_cnd_math = data_return.ref_fax_true_cnd;
				ref_sms_true_cnd_math = data_return.ref_sms_true_cnd;
				ref_depot_true_cnd_math = data_return.ref_depot_true_cnd;
				if (data_return.rules) rules_quota = data_return.rules;
			}
		});


	switch (type) {
		case 2:
			for (first in status)
				break;

			var count_verfier = 0;
			//console.log("Status :::::::::::::::::::::::::::::::::::::::::" + first)
			if (status[first] == "verfier") {
				var type_validation = type_validations[first];
				var ref_ecran = ref_ecrans[first];
				var ref_qualification = ref_qualifications[first];
				var ref_mail = ref_mails[first];
				var ref_fax = ref_faxs[first];
				var ref_sms = ref_smss[first];
				var ref_depot = ref_depots[first];

				switch (type_validations[first]) {
					case '0':
						SubmitToEcranSuivant(ref_ecran, ref_mail, ref_fax, ref_sms, ref_depot, '0');
						break;
					case '1':

						var tab_qualif = ref_qualification.split(',');
						if (tab_qualif.length > 1) {
							SetQualificationDialog(ref_qualification, ref_mail,
								ref_fax, ref_sms, ref_depot);
						} else {
							QualifierFiche(ref_qualification, ref_mail, ref_fax,
								ref_sms, ref_depot, 0, 0, 0, 0);
						}

						break;
				}

				count_verfier++;
				// $( "#target" ).submit();
				return false;
			} else {
				$.each(status, function (index, verfied) {

					if (verfied == "verfier" && index != first) {
						var type_validation = type_validations[index];
						var ref_ecran = ref_ecrans[index];
						var ref_qualification = ref_qualifications[index];
						var ref_mail = ref_mails[index];
						var ref_fax = ref_faxs[index];
						var ref_sms = ref_smss[index];
						var ref_depot = ref_depots[index];

						switch (type_validations[index]) {
							case '0':
								SubmitToEcranSuivant(ref_ecran, ref_mail, ref_fax,
									ref_sms, ref_depot, '0');
								break;
							case '1':

								var tab_qualif = ref_qualification.split(',');
								if (tab_qualif.length > 1) {
									SetQualificationDialog(ref_qualification, ref_mail,
										ref_fax, ref_sms, ref_depot);
								} else {
									QualifierFiche(ref_qualification, ref_mail,
										ref_fax, ref_sms, ref_depot, 0, 0, 0, 0);
								}

								break;
						}

						count_verfier++;
						// $( "#target" ).submit();
						return false;
					}

				});
			}

			if (count_verfier <= 0) {
				switch (type_validation_default_math) {
					case '0':
						SubmitToEcranSuivant(ref_ecran_default_math,
							ref_mail_default_math, ref_fax_default_math,
							ref_sms_default_math, ref_depot_default_math, '');
						break;
					case '1':

						var tab_qualif = ref_qualification_default_math.split(',');

						if (parseInt(tab_qualif.length) > 1) {
							SetQualificationDialog(ref_qualification_default_math,
								ref_mail_default_math, ref_fax_default_math,
								ref_sms_default_math, ref_depot_default_math);
						} else {
							QualifierFiche(ref_qualification_default_math,
								ref_mail_default_math, ref_fax_default_math,
								ref_sms_default_math, ref_depot_default_math, 0, 0, 0, 0);
						}
						break;
				}
				return false;
			}
			break;
		case 3:

			if (status == "verfier") {

				switch (type_validation_true_cnd_math) {
					case '0':

						SubmitToEcranSuivant(ref_ecran_true_cnd_math,
							ref_mail_true_cnd_math, ref_fax_true_cnd_math,
							ref_sms_true_cnd_math, ref_depot_true_cnd_math, 0);
						break;
					case '1':
						var tab_qualif = ref_qualification_true_cnd_math.split(',');
						if (tab_qualif.length > 1) {
							SetQualificationDialog(ref_qualification_true_cnd_math,
								ref_mail_true_cnd_math, ref_fax_true_cnd_math,
								ref_sms_true_cnd_math, ref_depot_true_cnd_math);
						} else {
							QualifierFiche(ref_qualification_true_cnd_math,
								ref_mail_true_cnd_math, ref_fax_true_cnd_math,
								ref_sms_true_cnd_math, ref_depot_true_cnd_math, 0, 0, 0, 0);
						}

						break;
				}
				return false;
			} else {

				switch (type_validation_default_math) {
					case '0':
						SubmitToEcranSuivant(ref_ecran_default_math,
							ref_mail_default_math, ref_fax_default_math,
							ref_sms_default_math, ref_depot_default_math, '');
						break;
					case '1':
						var tab_qualif = ref_qualification_default_math.split(',');
						if (tab_qualif.length > 1) {
							SetQualificationDialog(ref_qualification_default_math,
								ref_mail_default_math, ref_fax_default_math,
								ref_sms_default_math, ref_depot_default_math);
						} else {
							QualifierFiche(ref_qualification_default_math,
								ref_mail_default_math, ref_fax_default_math,
								ref_sms_default_math, ref_depot_default_math, 0, 0, 0, 0);
						}

						break;
				}
				return false;
			}

			break;

		case 4:

			if (status == "verfier") {

				switch (type_validation_true_cnd_math) {
					case '0':

						SubmitToEcranSuivant(ref_ecran_true_cnd_math,
							ref_mail_true_cnd_math, ref_fax_true_cnd_math,
							ref_sms_true_cnd_math, ref_depot_true_cnd_math, 0);
						break;
					case '1':
						var tab_qualif = ref_qualification_true_cnd_math.split(',');
						if (tab_qualif.length > 1) {
							SetQualificationDialog(ref_qualification_true_cnd_math,
								ref_mail_true_cnd_math, ref_fax_true_cnd_math,
								ref_sms_true_cnd_math, ref_depot_true_cnd_math);
						} else {
							QualifierFiche(ref_qualification_true_cnd_math,
								ref_mail_true_cnd_math, ref_fax_true_cnd_math,
								ref_sms_true_cnd_math, ref_depot_true_cnd_math, 0, 0, 0, 0);
						}

						break;
				}
				return false;
			} else {
				if (rules_quota) show_msg_log(lbl_rules_quotas + rules_quota.join(' , '), 'info');
				switch (type_validation_default_math) {
					case '0':
						SubmitToEcranSuivant(ref_ecran_default_math,
							ref_mail_default_math, ref_fax_default_math,
							ref_sms_default_math, ref_depot_default_math, '');
						break;
					case '1':
						var tab_qualif = ref_qualification_default_math.split(',');
						if (tab_qualif.length > 1) {
							SetQualificationDialog(ref_qualification_default_math,
								ref_mail_default_math, ref_fax_default_math,
								ref_sms_default_math, ref_depot_default_math);
						} else {
							QualifierFiche(ref_qualification_default_math,
								ref_mail_default_math, ref_fax_default_math,
								ref_sms_default_math, ref_depot_default_math, 0, 0, 0, 0);
						}

						break;
				}
				return false;
			}

			break;
	}
}

function SetQualificationDialog(ref_qualification, ref_mail, ref_fax, ref_sms, ref_depot) {
	$('#ref_mail').val(ref_mail);
	$('#ref_sms').val(ref_sms);
	$('#ref_fax').val(ref_fax);
	$('#ref_depot').val(ref_depot);
	// $('.modal-footer').hide();
	$('#set_qualification').html('');
	$('.prog_rappel').hide();
	var set_btn_qualification = $.ajax({
		url: base_url_ajax + "formbuilder/formbuilder/SetQualificationDialog",
		async: false,
		type: "post", // 'get' or 'post', override for form's 'method'
		data: 'ref_qualification=' + ref_qualification + "&ref_mail="
			+ ref_mail + "&ref_fax=" + ref_fax + "&ref_sms=" + ref_sms,
	}).responseText;
	$('#set_qualification').html(
		'<div class="btn-group btn-block">' + set_btn_qualification
		+ '</div>');

	jQuery('.QualiteSon').pulsate({
		color: "#bf1c56"
	});
	$('#DialogQualificationSubmit').modal('show');

	return false;
}

function ShowDialogQualifierFiche(ref_qualification, ref_mail, ref_fax, ref_sms, ref_depot) {

	$('#ref_mail').val(ref_mail);
	$('#ref_sms').val(ref_sms);
	$('#ref_fax').val(ref_fax);
	$('#ref_depot').val(ref_depot);

	$('#set_qualification').html('');
	jQuery('.QualiteSon').pulsate({
		color: "#bf1c56"
	});
	$('#DialogQualificationSubmit').modal('show');

	return false;

}

function CMK_SEND_DEPOT(data_options) {
	// $('.btn_save').click();

	//code commentÃ© jusqu'Ã  stabilisation de la part de aziz
	var data_form = $('#target').serializeArray();
	//console.log(data_options);
	if (data_options != "null") {
		$.each(data_options, function (n, v) {
			data_form.push({
				name: n,
				value: v
			});
		});
	}

	$.ajax({
		url: base_url_ajax + 'agent/validation/SendDepot',
		type: "post",
		data: data_form,
		async: false,
		success: function (data_result) {
			// $('#resultCalendar').html(data_result);
			toastr.clear();
			show_msg_log(data_result, 'success');
			// console.log(data_result);

		}
	});
}

function CMK_SEND_MAIL(data_options) {
	//$('.btn_save').click();
	var data_form = $('#target').serializeArray();
	if (data_options != "null") {
		$.each(data_options, function (n, v) {
			data_form.push({
				name: n,
				value: v
			});
		});
	}

	$.ajax({
		url: base_url_ajax + 'agent/validation/SendMail',
		type: "post",
		data: data_form,
		async: false,
		success: function (data_result) {
			// $('#resultCalendar').html(data_result);
			toastr.clear();
			show_msg_log(data_result, 'success');
			// console.log(data_result);

		}
	});

}

function CMK_SEND_FAX(data_options) {
	//$('.btn_save').click();

	var data_form = $('#target').serializeArray();
	if (data_options != "null") {
		$.each(data_options, function (n, v) {
			data_form.push({
				name: n,
				value: v
			});
		});
	}

	$.ajax({
		url: base_url_ajax + 'agent/validation/SendFax',
		type: "post",
		data: data_form,
		async: false,
		success: function (data_result) {
			// $('#resultCalendar').html(data_result);
			toastr.clear();
			show_msg_log(data_result, 'success');
			// console.log(data_result);

		}
	});

}

//function CMK_SEND_SMS(data_options) {
//	var data_form = $('#target').serializeArray();
//	if (data_options != "null") {
//		$.each(data_options, function(n, v) {
//			data_form.push({
//				name : n,
//				value : v
//			});
//		});
//	}
//
//	// console.log(data_form);
//
//	$.ajax({
//		url : base_url_ajax + 'agent/validation/SendFax',
//		type : "post", // 'get' or 'post', override for form's 'method'
//		// attribute
//		data : data_form,
//		async : false,
//		success : function(data_result) {
//			// $('#resultCalendar').html(data_result);
//			// console.log(data_result);
//		}
//	});
//}

function CMK_SEND_SMS(data_options) {
	var data_form = $('#target').serializeArray();
	if (data_options != "null") {
		$.each(data_options, function (n, v) {
			data_form.push({
				name: n,
				value: v
			});
		});
	}

	// console.log(data_form);

	$.ajax({
		url: base_url_ajax + 'agent/validation/SendSms',
		type: "post", // 'get' or 'post', override for form's 'method'
		// attribute
		data: data_form,
		async: false,
		success: function (data_result) {
			// $('#resultCalendar').html(data_result);
			// console.log(data_result);
			toastr.success('SMS EnvoyÃ©');
		}
	});
}

function ValiderFiche(data_options, action) {

	$('#piece_jointe').addClass('hidden');

	is_reception = 0;
	//rachrocher depuis le webPhone si on appel depuis le webPhone

	$transfertCallNoHangup = false;
	if (data_options['set_fichier_to_transfert']) {
		if (data_options['set_fichier_to_transfert'] > 0) $transfertCallNoHangup = true;
	}
	if ((is_web_phone == 1) && (action != "valider_duppliquer_continuer") && (!$transfertCallNoHangup)) sipHangUp();

	//sleep(1);
	data_options['cmk_validation_action'] = action;
	data_options['idScenario'] = idScenario;
	var noSoucyInternet = false;
	var textError = "";
	if (action == 'save_data_only') {
		var my_time1 = new Date(); // date object 
		my_time1 = my_time1.getTime(); // first time variable
		var XhrSaveDataScript = jQuery.ajax({
			type: 'POST', // Le type de ma requete
			url: base_url_ajax + 'agent/validation/SaveDataScript',
			data: data_options,
			async: false,
			success: function (data, textStatus, jqXHR) {
				// console.log(data)
				$('.valider_fiche').attr('disabled', false)
				clear_form_elements('DialogQualificationSubmit');//Initialiser les champs dans le modal DialogQualificationSubmit

			},

		});
		$.LoadingOverlay("hide");
		if (cmk_activate_check_connection) {

			if (XhrSaveDataScript.readyState == 0) {
				XhrSaveDataScript.abort();
				Offline.check();
				//show_msg_log('Un souci de connexion est dÃ©tectÃ©','warning');
				return false
			}

			var my_time2 = new Date(); // date object 
			show_msg_cnx_lente(my_time1, my_time2);


		}



		return false;


		/*InitAfterValidate();
		InitAgent('MENU', 'fromcontact');
		setCrmWidgetsValues();
		$('#production_tabs').hide();
		$('.dashboard_panel').show();
		$('.bloc_attente').hide();
		$("#accordion1").hide();
		CHECKDEBRIEF_VAR_INTERVAL = setInterval(CheckDebrief,10000);

		CheckDebrief(false);
		$('.user_logout').show();


		return false;*/
	}

	var dataAgent = {};
	dataAgent.logAction = "valider_fiche";
	dataAgent.logref_campagne = data_options.ref_campagne;
	dataAgent.logref_fichier = data_options.ref_fichier;
	dataAgent.lognum_contact = data_options.num_contact;
	dataAgent.logref_qualification = data_options.cmk_id_qualification;

	agentLogAction(dataAgent);

	if (action == 'valider_man_prod' || action == "valider_quick_qualif") {

		var noSoucyInternet = false;
		var textError = "";
		var my_time1 = new Date(); // date object 
		my_time1 = my_time1.getTime(); // first time variable
		var XhrValidationFiche = jQuery.ajax({
			type: 'POST', // Le type de ma requete
			url: base_url_ajax + 'agent/validation/ValidationFiche',
			data: data_options,
			dataType: 'json',
			async: false,
			beforeSend: function () {
				if (cmk_activate_check_connection) {

					Offline.check();
				}
			},
			success: function (data, textStatus, jqXHR) {
				// console.log(data)
				//$("#CMK_GO_SEARCH").click();
				$('#obs_c_tel_histo').val('');
				$('#obs_c_clid_histo').val('');
				$('div.modal-backdrop.fade.in').remove();
				$('.valider_fiche').attr('disabled', false)
				clear_form_elements('DialogQualificationSubmit');//Initialiser les champs dans le modal DialogQualificationSubmit
				$(document).trigger('cmk.fin_validation', data_options.cmk_id_qualification);

			}

		});
		$.LoadingOverlay("hide");
		if (cmk_activate_check_connection) {
			if (XhrValidationFiche.readyState == 0) {
				XhrValidationFiche.abort();
				Offline.check();
				//show_msg_log('Un souci de connexion est dÃ©tectÃ©','warning');
				return false
			}

			var my_time2 = new Date(); // date object 
			show_msg_cnx_lente(my_time1, my_time2);


		}


		$('#cmk_manualcall_number').attr('readonly', false);
		$('.close_modal_man_call').removeClass('hidden');
		$('#cmk_manualcall_number').val('');
		$('#cmk_man_file_name').val('');
		$('#cmk_man_file_comment').val('');
		$('#ref_qualif_prd_man').val('');
		$('.bloc_man_prod_qualif').addClass('hidden');
		$('.alert-man-rappel').addClass('hidden');
		$('#obs_c_tel_histo').val('');
		$('#obs_c_clid_histo').val('');
		cmk_input_type_rappel_final = 0;

		Fncdashboard(1);

		if (action == 'valider_man_prod') play();
		else lastModelUsed.click()




		return false;


		/*InitAfterValidate();
		 InitAgent('MENU', 'fromcontact');
		 setCrmWidgetsValues();
		 $('#production_tabs').hide();
		 $('.dashboard_panel').show();
		 $('.bloc_attente').hide();
		 $("#accordion1").hide();
		 CHECKDEBRIEF_VAR_INTERVAL = setInterval(CheckDebrief,10000);

		 CheckDebrief(false);
		 $('.user_logout').show();


		 return false;*/
	}

	var noSoucyInternet = false;
	var textError = "";
	var is_debrief;
	var my_time1 = new Date(); // date object 
	my_time1 = my_time1.getTime(); // first time variable
	var XhrValidationFiche = jQuery.ajax({
		type: 'POST', // Le type de ma requete
		url: base_url_ajax + 'agent/validation/ValidationFiche',
		data: data_options,
		dataType: 'json',
		async: false,
		beforeSend: function () {
			if (cmk_activate_check_connection) {
				Offline.check();
			}
		},
		success: function (data, textStatus, jqXHR) {
			clear_form_elements('DialogQualificationSubmit');//Initialiser les champs dans le modal DialogQualificationSubmit
			$('#obs_c_tel_histo').val('');
			$('#obs_c_clid_histo').val('');
			// console.log(data)
			is_debrief = data.debrief;
			data_options['num_obs_contact'] = data.num_obs_contact;
			data_options['num_new_rdv'] = (data.num_new_rdv != "" ? data.num_new_rdv : 0);
			if ($('#ref_mail').val() != '0' && $('#ref_mail').val() != '') {
				CMK_SEND_MAIL(data_options);
			}

			if ($('#ref_sms').val() != '0' && $('#ref_sms').val() != '') {
				CMK_SEND_SMS(data_options);
			}
			if ($('#ref_fax').val() != '0' && $('#ref_fax').val() != '') {
				CMK_SEND_FAX(data_options);
			}

			if ($('#ref_depot').val() != '0' && $('#ref_depot').val() != '') {
				CMK_SEND_DEPOT(data_options);
			}
			$('.valider_fiche').attr('disabled', false)
			if (rdv_data && $("#cmk_gcalendar_sync").attr("checked") && data.num_new_rdv) {
				sendToGoogle(data.num_new_rdv);
			}
			$(document).trigger('cmk.fin_validation', data_options.cmk_id_qualification);


		}
	});

	if (cmk_activate_check_connection) {
		if (XhrValidationFiche.readyState == 0) {
			XhrValidationFiche.abort();
			Offline.check();
			//show_msg_log('Un souci de connexion est dÃ©tectÃ©','warning');
			return false
		}

		var my_time2 = new Date(); // date object 
		show_msg_cnx_lente(my_time1, my_time2);

	}




	if (action == "valider_quitter") {
		// window.location.reload();

		$('.valider_fiche').attr('disabled', false)

		$.LoadingOverlay("hide");
		InitAfterValidate();
		//InitAgent('MENU', 'fromcontact');
		Fncdashboard('fromcontact');
		//setCrmWidgetsValues();
		//setCrmWidgetsValuesProd();
		//setCrmWidgetsValues();
		$('#production_tabs').hide();
		$('.in_prospect_btn').hide();
		$('.dashboard_panel').show();
		$('.bloc_attente').hide();
		$("#accordion1").hide();
		//CHECKDEBRIEF_VAR_INTERVAL = setInterval(CheckDebrief,10000);
		cmk_input_type_rappel_final = 0;
		//CheckDebrief(false);
		//$("#calendar_main.my-calendar-rappel").fullCalendar('refetchEvents');
		clearTimeout(TimeoutValiderFichie);
		clearInterval(CHECKRECEPT_VAR_INTERVAL);
		$("#header_queue_count").hide();
		$('.user_logout').show();

		if (force_to_deconnect_user) {
			window.location.href = '../login/Deconnect';

		}

	}

	if (action == "valider_continuer") {
		$('#production_tabs').hide();
		$('.in_prospect_btn').hide();
		clearInterval(CHECKRECEPT_VAR_INTERVAL);
		$('.valider_fiche').attr('disabled', false)

		$.LoadingOverlay("hide");
		InitAfterValidate();
		$('input[type="radio"]').attr('checked', false);
		$('input[type="text"]').val();
		cmk_input_type_rappel_final = 0;
		$('#DialogQualificationSubmit').modal('hide');

		//
		clearTimeout(TimeoutValiderFichie)
		setTimeout(function () {
		}, 1000);


		if (force_to_deconnect_user) {
			window.location.href = '../login/Deconnect';

		}

		var ret = verifDebrief(is_debrief);
		if (ret == false) {
			return ret;
		}
		ignoreInboundCalls = 0;

		play();
	}


	if (action == "valider_duppliquer_continuer") {

		type_global_prod = "contact_dupliquer";
		new_file = 1;
		clearInterval(CHECKRECEPT_VAR_INTERVAL);

		$.LoadingOverlay("hide");
		clearTimeout(TimeoutValiderFichie)
		$('input[type="radio"]').attr('checked', false);
		$('input[type="text"]').val();

		$('#DialogQualificationSubmit').modal('hide');
		//CHECKDEBRIEF_VAR_INTERVAL = setInterval(CheckDebrief,10000);
		//CheckDebrief(false);
		var ret = verifDebrief(is_debrief);
		if (ret == false) {
			return ret;
		}


		$.ajax({
			url: "agent/DupplicateContact",
			type: "post",
			data: 'ref_fichier=' + ref_fichier + '&name_fichier='
				+ name_fichier + "&incoming=" + "&from_contact=" + num_contact,
			dataType: 'json',
			async: false,
			success: function (data_result) {
				InitAfterValidate();

				$no = data_result.data_prd;

				ref_campagne = $no.ref_campagne;
				ref_fichier = $no.ref_fichier;
				name_campagne = $no.name_campagne;

				num_contact = $no.num_contact;
				name_fichier = $no.name_fichier;
				is_rappel = $no.is_rappel;
				type = $no.type;
				// cmk_date_debut_init = $no.cmk_date_debut_init;
				new_file = $no.new_file;
				$('#modal-gestioncontacts').modal('hide');
				$('#content_ecran_conf').html('');
				setTimeout(function () {
				}, 1000);
				if (force_to_deconnect_user) {
					window.location.href = '../login/Deconnect';

				}
				$('.valider_fiche').attr('disabled', false)

				SuccessPlay();

			}
		});

	}

	$('#tel_rappel_cmk').val('');
	$('input[name="voip_quality_select"]').prop('checked', false);

	$.uniform.update();
	// alert('Fin Script '+action)
	return false;
	// location.reload();
}


function QualifierFiche(ref_qualification, ref_mail, ref_fax, ref_sms, ref_depot, dupplicate_contact, auto_qualif, quick_qualif, set_fichier_to_transfert) {
	if (auto_qualif) {
		jQuery.ajax({
			type: 'POST', // Le type de ma requete
			url: base_url_ajax + 'formbuilder/formbuilder/GetExterneQualification',
			data: "num_contact=" + num_contact + "&ref_campagne=" + ref_campagne + '&num_user=' + user + "&ref_fichier=" + ref_fichier,
			async: false,
			beforeSend: function () {
				if (cmk_activate_check_connection) {

					Offline.check();
				}


			},
			success: function (data_qual_ext, textStatus, jqXHR) {
				ref_qualification = data_qual_ext;


			},
			error: function (jqXHR, textStatus, errorThrown) {
				// Une erreur s'est produite lors de la requete
			}
		});

		if (ref_qualification == "0") {
			show_msg_log(cant_qualify_auto_qualification, 'warning');
			return false;
		}
	}


	$('#ref_mail').val(ref_mail);
	$('#ref_sms').val(ref_sms);
	$('#ref_fax').val(ref_fax);
	$('#ref_depot').val(ref_depot);
	$('#set_fichier_to_transfert').val(set_fichier_to_transfert);
	$('#set_qualification').html('');
	$('#date_rappel').val('');
	$('#SCRIPTEUR_cmk_input_type_no_rappel').attr('checked', false);
	$('#SCRIPTEUR_cmk_input_type_rappel_plateau').attr('checked', false);
	$('#SCRIPTEUR_cmk_input_type_rappel_perso').attr('checked', false);
	if (dupplicate_contact == 1) {
		$('.valider_duppliquer_continuer').removeClass('hidden');
	} else {
		$('.valider_duppliquer_continuer').addClass('hidden');
	}
	$('.modal-footer[data-qualif="true"]').show();
	var nom_qualif = "";
	var rappel = "";
	var type_rappel = "";
	var msg_qualification_fiche = "";
	var date_rappel = "";
	var is_verrou = "0";
	var is_quick_qualif = "0";
	prise_rdv = 0;
	var my_time1 = new Date(); // date object 
	my_time1 = my_time1.getTime(); // first time variable

	var requestGetPropQualification =
		$.ajax({
			type: 'POST', // Le type de ma requete
			url: base_url_ajax + 'formbuilder/formbuilder/GetPropQualification',
			data: {
				'ref_qualification': ref_qualification,
				'name_fichier': name_fichier,
				'num_contact': num_contact
			},
			beforeSend: function () {
				if (cmk_activate_check_connection) {
					Offline.check();
				}
			},
			async: false,
			dataType: 'json',
			success: function (data) {
				nom_qualif = data.nom;
				rappel = data.rappel;
				type_rappel = data.type_rappel;
				date_rappel = data.date_rappel;
				num_qualification = data.num_qualification;
				$('#num_qualification').val(num_qualification);
				type_qualifcation = data.type_qualifcation;
				$('#type_qualifcation').val(type_qualifcation);
				argumente = data.argumente;
				$('#argumente_form').val(argumente);

				prise_rdv = data.prise_rdv;
				min_date = data.jx_min;
				max_date = data.jx_max;
				is_verrou = data.is_verrou;
				is_quick_qualif = data.is_quick_qualif;

			}
		});

	if (cmk_activate_check_connection) {
		if (requestGetPropQualification.readyState == 0) {
			requestGetPropQualification.abort();
			Offline.check();
			//show_msg_log('Un souci de connexion est dÃ©tectÃ©','warning');
			return false
		}

		var my_time2 = new Date(); // date object 
		show_msg_cnx_lente(my_time1, my_time2);


	}


	if (bloquer_qualification == 1) {
		show_msg_log(lbl_msg_warning_seuil_qualification, 'warning');
	}



	if (is_verrou == 1) {
		show_msg_log(lbl_fiche_verrou, 'error');
		//alert('Cette fiche est verrouillÃ©!')
		return false;
	}






	$('.get_rappel_prevus').attr('data-date-rappel', moment().format('YYYY-MM-DD'));
	//console.log( moment().subtract(min_date, 'days').format('DD/MM/YYYY HH:mm') )
	min_date = (min_date != "") ? moment().add(min_date, 'days').format('DD/MM/YYYY HH:mm') : moment().format('DD/MM/YYYY HH:mm');
	max_date = (max_date != "") ? moment().add(max_date, 'days').format('DD/MM/YYYY HH:mm') : moment().add(10, 'years').format('DD/MM/YYYY HH:mm');
	$('.datetimepicker-rappel #date_rappel').daterangepicker({
		timePicker: true,
		startDate: min_date,
		singleDatePicker: true,
		timePickerIncrement: 1,
		showDropdowns: true,
		timePicker24Hour: true,
		timePickerSeconds: false,
		"buttonClasses": "btn btn-xs ",
		"minDate": min_date,
		"maxDate": max_date,
		"applyClass": "btn-success pull-right",
		"cancelClass": "btn-default pull-left",
		locale: {
			cancelLabel: label_daterange_cancel,
			applyLabel: label_daterange_apply,
			format: 'DD/MM/YYYY HH:mm',


		}
	}).on(
		'apply.daterangepicker',
		function (ev, picker) {

			$('.get_rappel_prevus').attr('data-date-rappel',
				picker.startDate.format('YYYY-MM-DD'));
			$.ajax({
				type: "POST",
				url: base_url_ajax + "agent/agent/CheckIfExistRappel",
				data: "date_rappel="
					+ picker.startDate.format('YYYY-MM-DD HH:mm')
					+ ':00',
				async: false,
				dataType: 'json',
				success: function (data_resume) {
					if (data_resume.tot_rappel > 0) {
						var critere_rappel = data_resume.critere_rappel;
						$("#critere_rappel").html(critere_rappel);
						$('.modal-title-rappel').html(
							lbl_you_have
							+ data_resume.tot_rappel
							+ lbl_rappel_prevus_pour + ' '
							+ picker.startDate.format('DD-MM-YYYY')
							+ " (+/-) 1 " + lbl_rappel_heure);
						$('#RappelPrevusDialog').modal('show');
					}

				}
			});

		});


	nom_qualif = ($('[data-class="traduction-qualif-' + ref_qualification + '"]').html() != undefined) ? $('[data-class="traduction-qualif-' + ref_qualification + '"]').html() : nom_qualif;

	$('#date_rappel').val(min_date);
	msg_qualification_fiche = '<p class="text-blue">' + lbl_vous_venez_de_qualifier + ' <span class="label label-warning" style="font-size:16px;font-weight:900">'
		+ nom_qualif + '</span></p>';


	if (rappel > 0) {
		$('.prog_rappel').show();
		$('.show_if_not_rappel').addClass('hidden')

		if (rappel == 1) {

			$('#SCRIPTEUR_cmk_div_pas_de_rappel').show();
			$('#SCRIPTEUR_cmk_input_type_no_rappel').attr('checked', true);
			// $('#SCRIPTEUR_cmk_input_type_no_rappel').click();
		} else {

			$('#SCRIPTEUR_cmk_div_pas_de_rappel').hide();
			$('#SCRIPTEUR_cmk_input_type_rappel_personnel').click();
			$('#SCRIPTEUR_cmk_input_type_rappel_perso').attr('checked', true);

		}

		if (type_rappel == 0) {
			$('#SCRIPTEUR_cmk_div_rappel_personnel').show();
			$('#SCRIPTEUR_cmk_div_rappel_plateau').show();
			$('#SCRIPTEUR_cmk_input_type_rappel_perso').attr('checked', true);
		} else if (type_rappel == 1) {
			$('#SCRIPTEUR_cmk_div_rappel_personnel').show();
			$('#SCRIPTEUR_cmk_div_rappel_plateau').hide();
			$('#SCRIPTEUR_cmk_input_type_rappel_personnel').click();

			$('#SCRIPTEUR_cmk_input_type_rappel_perso').attr('checked', true);
		} else if (type_rappel == 2) {
			$('#SCRIPTEUR_cmk_div_rappel_personnel').hide();
			$('#SCRIPTEUR_cmk_div_rappel_plateau').show();
			$('#SCRIPTEUR_cmk_input_type_rappel_plateau').click();
			$('#SCRIPTEUR_cmk_input_type_rappel_plateau').attr('checked', true);

		}
	} else {

		if (quick_qualif && quick_qualif == 1) {
			// $("#cmk_commentaires_dupli").val('');
			$('[data-action="valider_continuer"]').attr('disabled', false).click();
			return false;
		} else {
			$('.show_if_not_rappel').removeClass('hidden')

			$('.prog_rappel').hide();
			$('#SCRIPTEUR_cmk_input_type_no_rappel').click();
		}
	}
	$('#set_qualification').html(msg_qualification_fiche);

	var data_form = $('#target').serialize();
	jQuery('.QualiteSon').pulsate({
		color: "#bf1c56"
	});
	jQuery.uniform.update();
	$('#DialogQualificationSubmit').modal('show');
	// location.reload();
	return false;

}

// verfier si Ecran contient une condition de passage

function VerifEcran(ref_ecran) {

	var sContent = $('#target').serialize();
	var ref_ecran_default_math = "";
	var ref_ecran_true_cnd_math = "";
	$.ajax({
		type: "POST",
		url: base_url_ajax
			+ "formbuilder/formbuilder/Evaluer_Chaine_Math_Ecran/",
		data: "form_id=" + ref_ecran + "&" + sContent + '&ref_campagne='
			+ ref_campagne + '&ref_fichier=' + ref_fichier
			+ '&name_fichier=' + name_fichier + "&num_contact="
			+ num_contact + "&num_user=" + user,
		async: false,
		dataType: 'json',
		success: function (data_return) {
			status = data_return.status;
			ref_ecrans = data_return.ref_ecrans;
			ref_ecran_default_math = data_return.ref_ecran_default;
			ref_ecran_true_cnd_math = data_return.ref_ecran_true_cnd;

		}
	});

	switch (status) {
		case "verfier":
			SubmitToEcranSuivant(ref_ecran_true_cnd_math, '', '', '', '', 0);
			break;
		case "notverfier":
			SubmitToEcranSuivant(ref_ecran_default_math, '', '', '', '', 0);
			break;
	}

	return false;

}
var TimeoutSubmitToEcranSuivant;


function SubmitToEcranSuivant(ref_ecran, ref_mail, ref_fax, ref_sms, ref_depot, set_previous_active) {

	$('.set_form_builder').html('');
	$.LoadingOverlay("show");


	var num_ercran = "";
	var bloc_element = "";
	var return_ele = "";
	var i = "";
	var ret_js = "";
	var bg_color = "#ffffff";
	var btn_preced = "";
	var data_form = $('#target').serialize();

	/*setTimeout(function() {

	}
, 600);
*/
	TimeoutSubmitToEcranSuivant = setTimeout(function () {

		var cnd_verif = 0;
		$.ajax({
			type: "POST",
			url: base_url_ajax + "formbuilder/formbuilder/VerfiEcranCnd/",
			data: "form_id=" + ref_ecran,
			async: false,
			success: function (data_return) {

				cnd_verif = data_return;

			}
		});

		var id_ecran = $('#current_ecran').val();
		$('.modal-footer[data-qualif="true"]').hide();
		SendPostTmp(id_ecran);



		if (cnd_verif == 1) {

			VerifEcran(ref_ecran);
			$.LoadingOverlay("hide");

			return false;
		} else {

			$('#current_ecran').val(ref_ecran);
			$('#current_ecran_validation').val(ref_ecran);

			$('.backward').show();

			if (ref_mail != '0' && ref_mail != '') {

				CMK_SEND_MAIL({
					user: user,
					ref_fichier: ref_fichier,
					name_fichier: name_fichier,
					num_contact: num_contact,
					ref_campagne: ref_campagne,
					name_campagne: name_campagne,
					ref_mail: ref_mail,
					num_obs_contact: ''
				});
			}

			if (ref_sms != '0' && ref_sms != '') {
				CMK_SEND_SMS({
					user: user,
					ref_fichier: ref_fichier,
					name_fichier: name_fichier,
					num_contact: num_contact,
					ref_campagne: ref_campagne,
					name_campagne: name_campagne,
					ref_sms: ref_sms
				});
			}

			if (ref_fax != '0' && ref_fax != '') {
				CMK_SEND_FAX({
					user: user,
					ref_fichier: ref_fichier,
					name_fichier: name_fichier,
					num_contact: num_contact,
					ref_campagne: ref_campagne,
					name_campagne: name_campagne,
					ref_fax: ref_fax
				});
			}


			if (ref_depot != '0' && ref_depot != '' && ref_depot != null) {
				CMK_SEND_DEPOT({
					user: user,
					ref_fichier: ref_fichier,
					name_fichier: name_fichier,
					num_contact: num_contact,
					ref_campagne: ref_campagne,
					name_campagne: name_campagne,
					ref_depot: ref_depot
				});
			}


			var last_qualif = 0;
			$
				.ajax({
					type: "POST",
					url: base_url_ajax
						+ "formbuilder/formbuilder/GetElementFormToLoad",
					data: data_form + "&form_id=" + ref_ecran + "&previous="
						+ previous + "&exec=agent&num_contact="
						+ num_contact + "&user=" + user,
					dataType: "json",
					cache: false,
					async: false,
					success: function (data_return) {
                        current_ecran = ref_ecran;
						clearTimeout(TimeoutSubmitToEcranSuivant);
						if (data_return.show_label == 1) {
							$('#label-screen').show()
							$('.label-screen-title').html(data_return.label)

						} else {
							$('#label-screen').hide()
							$('.label-screen-title').html('')
						}
						$('#content_ecran_conf').html('');
						btn_save = 0;

						if (data_return.html != "") {
							$("form#target").removeClass("has-success");
							$
								.each(
									data_return.html,
									function (count_conf, value) {
										var type = data_return.type[count_conf];
										var element_id = data_return.element_id[count_conf];
										var last_count = count_conf + 1;
										bg_color = data_return.bg_color;
										btn_preced = data_return.btn_preced;
										btn_save = data_return.btn_save;
										last_qualif = data_return.last_qualif;
										element_guidelines = data_return.element_guidelines[count_conf];

										bloc_element += '<div dir="' + element_guidelines + '" class="form-group" data-prop="'
											+ type
											+ '" data-numfield="'
											+ element_id + '">';
										bloc_element += value;
										bloc_element += '</div>';

									})
						} else {
							bloc_element = '<div class="col-md-12"><div class="alert alert-warning">'
								+ '<strong>Warning!</strong> Ecran Vide </div></div>';
						}

						$('#cmk_date_begin_ecran').val(data_return.date_begin_ecran);
						$('#cmk_date_begin_ecran_validation').val(data_return.date_begin_ecran);
						$('#current_ecran').val(data_return.form_id);
						$('#current_ecran_validation').val(data_return.form_id);

						if (btn_preced == 0) {
							$('.backward').addClass('hidden');
						} else {
							$('.backward').removeClass('hidden');
						}



						if (btn_save == 0) {
							$('.btn_save').addClass('hidden');
						} else {


							if (last_qualif != 0) {
								$('.btn_save').removeClass('hidden');
								num_qualification = last_qualif;
							} else {
								$('.btn_save').addClass('hidden');

							}

						}

						//alert(data_return.previous)

						if (data_return.previous == "") {
							$('.backward').hide();
						}
						$('#previous').val(data_return.previous);

						$.each(data_return.js, function (i, value) {

							if (value.length > 0) {
								// alert(value)
								ret_js += value;
							}

						})

					}
				});

			/*
			 */
			// jQuery.globalEval(ret_js)

			//console.log("js :: "+ret_js)



			$('#content_ecran_conf').append(bloc_element);
			$('#content_ecran_conf').find('.datepicker-default').datepicker({
				language: 'fr-FR',
				autoclose: true
			});


			var $container = document.querySelector('.set_form_builder');
			$container.innerHTML = '<script>' + ret_js + '</script>';
			runScripts($container);

			setTimeout(function () {

				loadTraduction(ref_ecran);
				loadRobots();
				jQuery(document).trigger("date_picker");
				jQuery(document).trigger("time_picker");
				RandomizeResponse();
				RandomizeResponseCircle();

			}, 50);





			$('#content_ecran_conf').css({
				'background-color': bg_color,
				'padding': '10px',
				// '-webkit-mask-image' :
				// 'url(http://support.nature.org/images/earth/assets/grit.png)',
				// 'mask-image' :
				// 'url(http://support.nature.org/images/earth/assets/grit.png)',

			});



			set_previous_active = 0;
			$('html, body').animate({
				scrollTop: 0
			}, 'fast');



			$.LoadingOverlay('hide');

			return false;

		}



	}, 50);



}

function SubmitMultiChannel(ref_mail, ref_fax, ref_sms, ref_depot) {

	$('.set_form_builder').html('');
	$.LoadingOverlay("show");

	var data_form = $('#target').serialize();

	if (ref_mail != '0' && ref_mail != '') {

		CMK_SEND_MAIL({
			user: user,
			ref_fichier: ref_fichier,
			name_fichier: name_fichier,
			num_contact: num_contact,
			ref_campagne: ref_campagne,
			name_campagne: name_campagne,
			ref_mail: ref_mail,
			num_obs_contact: ''
		});
	}

	if (ref_sms != '0' && ref_sms != '') {
		CMK_SEND_SMS({
			user: user,
			ref_fichier: ref_fichier,
			name_fichier: name_fichier,
			num_contact: num_contact,
			ref_campagne: ref_campagne,
			name_campagne: name_campagne,
			ref_sms: ref_sms
		});
	}

	if (ref_fax != '0' && ref_fax != '') {
		CMK_SEND_FAX({
			user: user,
			ref_fichier: ref_fichier,
			name_fichier: name_fichier,
			num_contact: num_contact,
			ref_campagne: ref_campagne,
			name_campagne: name_campagne,
			ref_fax: ref_fax
		});
	}


	if (ref_depot != '0' && ref_depot != '' && ref_depot != null) {
		CMK_SEND_DEPOT({
			user: user,
			ref_fichier: ref_fichier,
			name_fichier: name_fichier,
			num_contact: num_contact,
			ref_campagne: ref_campagne,
			name_campagne: name_campagne,
			ref_depot: ref_depot
		});
	}

	$.LoadingOverlay("hide");

}

function Load_form_element(form_id, ref_campagne, ref_fichier, name_fichier, num_contact, user) {
	$('#content_ecran_conf').html('');
	$('.user_logout').hide();
	$('.set_form_builder').html('');
	$('#ref_campagne').val(ref_campagne);
	$('#ref_fichier').val(ref_fichier);
	$('#name_fichier').val(name_fichier);
	var num_ercran = "";
	var bloc_element = "";
	var return_ele = "";
	var i = "";
	var ret_js = "";
	transfert = (type_appel == "transfert") ? 1 : 0;
	current_ecran = form_id;

	if (form_id == 0) {
		// alert('>Aucun ecran initial n\est dÃ©finie!')
		$('#content_ecran_conf')
			.html(
				'<div class="col-md-12"><div class="alert alert-danger">'
				+ lbl_aucun_ecran_definie + '! </div></div>');
		$('.backward').hide();

		return false;
	}

	var cnd_verif = 0;

	$.ajax({
		type: "POST",
		url: base_url_ajax + "formbuilder/formbuilder/VerfiEcranCnd/",
		data: "form_id=" + form_id,
		async: false,
		success: function (data_return) {

			cnd_verif = data_return;


		}
	});
	if (cnd_verif == 1) {

		VerifEcran(form_id);
		$.LoadingOverlay("hide");

		return false;
	}

	$('.backward').hide();

	$('#current_ecran').val(current_ecran);
	$('#current_ecran_validation').val(current_ecran);
	var bg_color = "#ffffff";
	var sContent = $('#target').serialize();
	var noSoucyInternet = false;
	var textError = "";
	var btn_save = "";
	var last_qualif = 0;
	var my_time1 = new Date(); // date object 
	my_time1 = my_time1.getTime(); // first time variable
	var xhrGetElementFormToLoad = $.ajax({
		type: "POST",
		url: base_url_ajax + "formbuilder/formbuilder/GetElementFormToLoad",
		data: sContent + "&form_id=" + form_id + "&exec=agent&num_contact="
			+ num_contact + "&user=" + user,
		dataType: "json",
		cache: true,
		async: false,
		beforeSend: function () {
			if (cmk_activate_check_connection) {

				Offline.check();
			}
		},
		success: function (data_return) {
			$("form#target").removeClass("has-success");
			if (data_return.show_label == 1) {
				$('#label-screen').show()
				$('.label-screen-title').html(data_return.label)

			} else {
				$('#label-screen').hide()
				$('.label-screen-title').html('')
			}
			$.each(data_return.html, function (count_conf, value) {
				var type = data_return.type[count_conf];
				var element_id = data_return.element_id[count_conf];
				var last_count = count_conf + 1;
				btn_save = data_return.btn_save;
				last_qualif = data_return.last_qualif;
				element_guidelines = data_return.element_guidelines[count_conf];

				bg_color = data_return.bg_color;
				bloc_element += '<div class="form-group" dir="' + element_guidelines + '" data-prop="' + type
					+ '" data-numfield="' + element_id + '">';
				bloc_element += value;
				bloc_element += '</div>';


			});

			if (btn_save == 0) {
				$('.btn_save').addClass('hidden');
			} else {


				if (last_qualif != 0) {
					$('.btn_save').removeClass('hidden');
					num_qualification = last_qualif;
				} else {
					$('.btn_save').addClass('hidden');

				}

			}
			$('#cmk_date_begin_ecran').val(data_return.date_begin_ecran);
			$('#cmk_date_begin_ecran_validation').val(data_return.date_begin_ecran);
			$('#previous').val(data_return.previous);

			$.each(data_return.js, function (i, value) {

				if (value.length > 0) {
					ret_js += value + "\n\r";
				}

			})

		},

	});
	if (cmk_activate_check_connection) {
		if (xhrGetElementFormToLoad.readyState == 0) {
			xhrGetElementFormToLoad.abort();
			Offline.check();
			//show_msg_log('Un souci de connexion est dÃ©tectÃ©','warning');
			return false
		}

		var my_time2 = new Date(); // date object 
		show_msg_cnx_lente(my_time1, my_time2);


	}


	/*
	 * $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCSgEur26EM4lbeuyJTTDwTBMEVV6RY6e0&signed_in=true&libraries=places&&callback=initMap",function(data,
	 * textStatus, jqxhr) {
	 * 
	 * status_charger_gmaps_api = textStatus; console.log(data); // Data
	 * returned console.log(status_charger_gmaps_api); // Success
	 * console.log(jqxhr.status); // 200 console.log("Load was performed."); });
	 */
	//console.log("js :: "+ret_js)



	// $('#set_form_builder').text(ret_js)
	// jQuery.globalEval(ret_js)

	// console.log("js :: " + ret_js)

	$('#content_ecran_conf').append(bloc_element);
	$('#content_ecran_conf').find('.datepicker-default').datepicker({
		language: 'fr-FR',
		autoclose: true
	});



	setTimeout(function () {

		loadTraduction(form_id);
		loadRobots();
		RandomizeResponse();
		RandomizeResponseCircle();

	}, 50);

	setTimeout(function () {

		var $container = document.querySelector('.set_form_builder');
		$container.innerHTML = '<script>' + ret_js + '</script>';
		runScripts($container);
        jQuery(document).trigger("date_picker");
        jQuery(document).trigger("time_picker");

	}, 150);

	$('#content_ecran_conf').css({
		'background-color': bg_color,
		'padding': '10px',
		// '-webkit-mask-image' :
		// 'url(http://support.nature.org/images/earth/assets/grit.png)',
		// 'mask-image' :
		// 'url(http://support.nature.org/images/earth/assets/grit.png)',

	});



	// return (F());
	return false;
}
// Add validation

function FnErrorForms() {
	$('#ErrorMod').modal('show');
	var i = 0;

	/*
	 * $('div [data-prop="field_matrix"]').removeClass('has-error'); $('div
	 * [data-prop="field_matrix"]').find('tr').removeClass('bg-red');
	 */
	$('div [data-prop="field_choice"]').removeClass('has-error');
	$('div [data-prop="field_choice"]').find('tr').removeClass('bg-red');

	$('div [data-prop="field_selection"]').removeClass('has-error');
	$('div [data-prop="field_selection"]').find('tr').removeClass('bg-red');

	$('div [data-prop="field_matrix"] > table > tbody > tr > td > input').each(
		function () {

			var class_s = $(this).attr('class');
			var curent_parent = $(this).closest('div')
				.attr('data-numfield');
			// console.log(curent_parent + "::" + class_s)
			switch (class_s) {
				case 'fb_cmk action_mtx error':
					$('div [data-numfield="' + curent_parent + '"]').addClass(
						'has-error');
					$('div [data-numfield="' + curent_parent + '"]').find('tr')
						.addClass('font-red-sunglo');
					break;

			}

		});

	$('div [data-prop="field_choice"] > table > tbody > tr > td > input').each(
		function () {

			var class_s = $(this).attr('class');
			var curent_parent = $(this).closest('div')
				.attr('data-numfield');

			switch (class_s) {
				case 'fb_cmk action_choice error':
					$('div [data-numfield="' + curent_parent + '"]').addClass(
						'has-error');
					$('div [data-numfield="' + curent_parent + '"]').find('tr')
						.addClass('font-red-sunglo');
					break;

			}

		});

	$('div [data-prop="field_selection"] > table > tbody > tr > td > input')
		.each(
			function () {

				var class_s = $(this).attr('class');
				var curent_parent = $(this).closest('div').attr(
					'data-numfield');

				switch (class_s) {
					case 'fb_cmk action_choice error':
						$('div [data-numfield="' + curent_parent + '"]')
							.addClass('has-error');
						$('div [data-numfield="' + curent_parent + '"]')
							.find('tr').addClass('font-red-sunglo');
						break;

				}

			});
}

function SendPostTmp(id_ecran) {

	var data_form = $('#target').serialize();
	var noSoucyInternet = false;
	var textError = "";
	var my_time1 = new Date(); // date object 
	my_time1 = my_time1.getTime(); // first time variable
	var xhrsendDataTemp = jQuery.ajax({
		type: 'POST', // Le type de ma requete
		url: base_url_ajax + 'formbuilder/formbuilder/sendDataTemp',
		async: false,
		beforeSend: function () {
			if (cmk_activate_check_connection) {

				Offline.check();
			}
		},
		data: data_form + "&id_ecran=" + id_ecran + "&clicked_preced="
			+ set_previous_active + "&num_contact=" + num_contact
			+ "&user=" + user + "&exec=agent",
		success: function (data, textStatus, jqXHR) {

		},

	});
	if (cmk_activate_check_connection) {

		if (xhrsendDataTemp.readyState == 0) {
			xhrsendDataTemp.abort();
			Offline.check();
			//show_msg_log('Un souci de connexion est dÃ©tectÃ©','warning');
			return false
		}
		var my_time2 = new Date(); // date object 
		show_msg_cnx_lente(my_time1, my_time2);
	}



	set_previous_active = 0;
	return false;
	// $( "#target" ).submit();
}



//ajouter dans preview agent edition scripteur
$(document).on('click', '.act_bis_choice', function () {
	var name_input = $(this).data('bis-id');
	var type_input = $(this).attr('type');
	var elemid = $(this).data('elemid');


	var valeur = $(this).attr('value');
	if ($(this).is(':checked')) {
		$("#" + name_input + "[data-elemid='" + elemid + "']").attr('data-validation', 'required');
		$(".bis_input[id='" + name_input + "']").removeClass('hidden');


		if (type_input == "radio") {
			$(".bis_input[id!='" + name_input + "'][data-elemid='" + elemid + "']").attr('data-validation', '');
			$(".bis_input[id!='" + name_input + "'][data-elemid='" + elemid + "']").addClass('hidden');


		}

	} else {
		$("#" + name_input + "[data-elemid='" + elemid + "']").attr('data-validation', '');
		$(".bis_input[id='" + name_input + "'][data-elemid='" + elemid + "']").addClass('hidden');



	}
})
$(document).on('click', '.act_other_choice', function () {
	var id_input = $(this).attr('id');


	if ($(this).is(':checked')) {

		$("[data-tocheck='" + id_input + "']").attr('data-validation', 'required');
	} else {
		$("[data-tocheck='" + id_input + "']").attr('data-validation', '');

	}
})

function loadTraduction(ref_ecran) {
	var getLangSelected = window.localStorage.getItem('default.lang.script');
	if (getLangSelected == null || getLangSelected == 0) return false;
	var defaultTraduction = JSON.parse(LZString.decompress(window.localStorage.getItem('global.lang.script.traduction')));
	var defaultTraductionToTraduct = [];
	var qualifTraductionToTraduct = [];
	$.each(defaultTraduction, function (i, item) {

		if (item.ref_id_cmk_lang_script == getLangSelected && item.ref_form_id == ref_ecran) {
			defaultTraductionToTraduct.push(item);
			/*if(item.ref_element_option_id==0){
				$('[data-class="traduction-'+item.ref_form_id+'-'+item.ref_element_id+'"]').html(item.label_text)
			}else{
				$('[data-class="traduction-'+item.ref_form_id+'-'+item.ref_element_id+'-'+item.ref_element_option_id+'"]').html(item.label_text)
			}*/
		} else if (item.ref_qualification != 0 && item.ref_id_cmk_lang_script == getLangSelected) {
			qualifTraductionToTraduct.push(item);

		}

	});


	dataTraduction = formatTraduction(defaultTraductionToTraduct, ref_ecran);
	$.each(dataTraduction, function (i, item) {

		if (item.ref_element_option_id == 0) {
			$('[data-class="traduction-' + item.ref_form_id + '-' + item.ref_element_id + '"]').html(item.label_text)
		} else {
			$('[data-class="traduction-' + item.ref_form_id + '-' + item.ref_element_id + '-' + item.ref_element_option_id + '"]').html(item.label_text)
		}


	});
	if (qualifTraductionToTraduct.length > 0) {
		$.each(qualifTraductionToTraduct, function (i, item) {

			$('[data-class="traduction-qualif-' + item.ref_qualification + '"]').html(item.label_text)

		});
	}
}


$(document).on('change', '.selectorLangTraduction', function () {
	val = $(this).val();

	if (val != null) {
		window.localStorage.removeItem('default.lang.script');
		window.localStorage.setItem('default.lang.script', val);
		$('.selectorLangTraduction').val(val);
		var current_ecran_lang = $('#current_ecran').val();
		loadTraduction(current_ecran_lang);
	}

});


function formatTraduction(defaultTraduction, ref_ecran) {
	var returnScript = {};
	jQuery.ajax({
		type: 'POST', // Le type de ma requete
		url: base_url_ajax + 'agent/agent/formatTraduction',
		async: false,
		dataType: 'json',
		data: {
			defaultTraduction: defaultTraduction,
			user: user,
			ref_fichier: ref_fichier,
			name_fichier: name_fichier,
			num_contact: num_contact,
			ref_campagne: ref_campagne,
			ref_ecran: ref_ecran

		},
		success: function (data, textStatus, jqXHR) {
			returnScript = data;
		},

	});

	return returnScript;

}



function loadRobots() {

	var dataScreen = {};
	var labelScenario = "";
	jQuery.ajax({
		type: 'POST', // Le type de ma requete
		url: base_url_ajax + 'formbuilder/formbuilder/getJsonScenarioContentConf',
		async: false,
		dataType: 'json',
		data: {
			ref_campagne: ref_campagne,
			ref_fichier: ref_fichier,


		},
		success: function (data, textStatus, jqXHR) {
			
			
			idScenario = data.idScenario;
			dataScreen = data.data_sequence[data.idScenario];
			if(idScenario!=-1){
				labelScenario = data.data_scenario[0].label_scenario;
			}
			
		},

	});

	if(idScenario!=-1){
		$('#label-screen').show();
		$('.label-screen-title').html($('.label-screen-title').html()+'/ '+labelScenario);
		setTimeout(function () {
			
			$("#target").autofill(dataScreen).click();
			$('#target input:checked').click();
	
		},1000);
	
	
		$('#target input:checked').click();
		$("#target").autofill(dataScreen).click();
		$('#target input:checked').click();
	
		setTimeout(function () {
			$('#target input:checked').click();
			$.each(dataScreen,function(i,item){
				if(i.indexOf('[]')!=-1){
					var valueSelected = item.split(',')
					$('[name="'+i+'"]').val(valueSelected)
				}
			})
			$('#target button.next-screen:visible').click();
		},2000);
	}

	

}