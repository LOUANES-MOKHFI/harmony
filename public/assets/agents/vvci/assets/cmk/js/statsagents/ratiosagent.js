var qualifSelectJsTree;

$(function() {
    $("#cmk_agent_stats_qualifInput").click(function(e) {
        e.preventDefault();
        $(this).blur();
    });
});


$('#modal-statsagent').on('shown.bs.modal', function() {
	$('#reportrange_custom_agent').parent().daterangepicker(
		{
			ranges : datarangpicker_ranges,
			// startDate: moment().subtract('days', 29),
			startDate : moment(),
			endDate : moment()
		},
		function(start, end) {
			$('#reportrange_custom_agent').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
			$('#date_begin').val(start.format('YYYY-MM-DD'));
			$('#date_end').val(end.format('YYYY-MM-DD'));
			show_list_camp_fichier_affect();
		});
    $('#reportrange_custom_agent').val(moment().format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

	// $("#grp_competence_user").val("128,145");//145
	//$("#grp_competence_user").val("112");

	var grp_competence_user_filter = user;
	var date_begin = $('#date_begin').val();
	var date_end = $('#date_end').val();

	// $('#qualifSelectDiv').hide();

	$('#ratiosByAgentDiv').hide();
	$('#dataEvolutionForAllAgentsDiv').hide();
	$('#dataEvolutionByDayDiv').hide();
	$('#dataEvolutionByTimeslotDiv').hide();

	$(".qualif_checkbox").change(function() {
		generateQualifTree();
	});

	$("#divers").change(function() {
		if ($(this).prop('checked')) {
			$("#positif").attr('checked',false);
			$("#arg").attr('checked',false);
		}
	});

	$("#positif").change(function() {
		if ($(this).prop('checked')) {
			$("#divers").attr('checked',false);
		}
	});

	$("#arg").change(function() {
		if ($(this).prop('checked')) {
			$("#divers").attr('checked',false);
		}
	});

	$("#rappel").change(function() {
		if ($(this).is(':checked')) {

			$("#positif").attr('checked',false);
			$("#arg").attr('checked',false);
			$("#divers").attr('checked',false);
			$('.qualifs_option_div').hide();
		} else {
			$('.qualifs_option_div').show();
		}
	});

	show_list_camp_fichier_affect();
	show_ratios();
	$.uniform.update()

});




function show_list_camp_fichier_affect() {
	var date_begin = $('#date_begin').val();
	var date_end = $('#date_end').val();
	var ref_user = user;

	var sContent = 'date_begin=' + date_begin + "&date_end=" + date_end
			+ "&ref_user=" + ref_user;
	$.ajax({
		url : "../ratiosagent/ratiosagent/FiltreCampFich",
		type : "post",
		data : sContent,

		success : function(list_grpcomp) {
			var options = '';

			if (list_grpcomp != null) {

				$('#campagne_fichier_agent').html(list_grpcomp);

			} else {
				$('#campagne_fichier_agent').html('');
			}
			$("#campagne_fichier_agent").multipleSelect({
				filter : true,
				placeholder : lbl_placeholder_camp_fichier,
				onClick : function(view) {
				},
				onCheckAll : function() {
				},
				onUncheckAll : function() {
				},
				onClose : function() {
					generateQualifTree();
				},
				multiple : true,
				multipleWidth : 350
			});

			// list_user_act();
		}
	});

}

function generateQualifTree() {

	var positif = document.getElementById('positif').checked;
	var tous = document.getElementById('divers').checked;
	var arg = document.getElementById('arg').checked;

	if (positif == true) {
		positif = 1;
	} else {
		positif = '';
	}

	if (arg == true) {
		arg = 1;
	} else {
		arg = '';
	}

	if (tous == true) {
		tous = 1;
	} else {
		tous = '';
	}
	$('#qualifSelectDiv').show();
	var list_fichiers = $("#campagne_fichier_agent").val();
	var sContent = "&list_fichiers=" + list_fichiers;
	sContent += '&argumente=' + arg + '&positif=' + positif + '&tous=' + tous;
	$.ajax({
		url : "../ratiosagent/ratiosagent/getQualifTreeData",
		type : "post",
		dataType : "json",
		data : sContent,
		success : function(data_result) {
			var dataTree = data_result.dataTree;
			// console.log(dataTree);

			/*
			 * if ($('#qualifSelectTree').jstree(true)!=false) {
			 * alert("destroy");
			 * //$('#qualifSelectTree').jstree(true).destroy(true);
			 * qualifSelectJsTree =
			 * $('#qualifSelectTree').jstree({'plugins':["checkbox"], 'core' : {
			 * 'data' : dataTree, }}); }
			 */

			if ($('#qualifSelectTree').jstree(true) == false) {
				qualifSelectJsTree = $('#qualifSelectTree').jstree({
					'plugins' : [ "checkbox" ],
					'core' : {
						'data' : dataTree,
					}
				});
			}
			console.log("szeze");
			$('#qualifSelectTree').jstree(true).settings.core.data = dataTree;
			$('#qualifSelectTree').jstree('refresh');
			// $('#qualifSelectTree').jstree('check_all');
			$('#qualifSelectTree').jstree('refresh');
			$('#qualifSelectTree').jstree('close_all');

		}
	});

}

function getFieldsToReport() {
	var fieldsToReport = [];
	jQuery('.check_uncheck_fieldsTorReport').each(function() {
		var currentElement = $(this);
		if (currentElement.is(':checked')) {
			var value = currentElement.attr("id");
			fieldsToReport.push(value);
		}
	});

	return fieldsToReport;
}

function get_list_qualifs() {

	if ($('#qualifSelectTree').jstree(true) == false
			|| $('#rappel').is(':checked') == true) {
		return ""
	}
	;
	// alert($('#qualifSelectTree').jstree(true));
	var list_qualifs = $('#qualifSelectTree').jstree(true).get_selected();

	var list_qualifs_array = [];
	/*
	 * $('.jstree-leaf').each(function(){ var id = $(this).attr('id'); var text =
	 * $(this).children('a').text(); alert('eeeegg'+id+"==>"+text);
	 * list_qualifs_array.push(id); });
	 */

	/*
	 * $("#qualifSelectTree").jstree("get_checked",null,true).each(function () {
	 * alert(this.data); alert(this.id); });
	 */

	/*
	 * $('#qualifSelectTree').jstree("get_checked", null, true).each(function
	 * (i, e) { console.log("zzz"); }
	 */

	var list_qualifs_array = [];
	$(list_qualifs).each(function(i, node) {
		// var id = $(node).attr("id");
		// var text = $(node).attr("text");
		if (node == parseInt(node, 10)) // node id is an integer
			list_qualifs_array.push(node);
	});

	// console.log("aaaa=>"+list_qualifs_array);
	// console.log("zzz=>"+list_qualifs);

	return list_qualifs_array;
}

function scrollToStats(elemId) {
	$('html, body').animate({
		scrollTop : $(elemId).offset().top
	}, 1500);
}

function show_ratios() {

	var date_begin = $('#date_begin').val();
	var date_end = $('#date_end').val();
	var ref_user= $('#grp_competence_user').val();
	//scon migvar list_fichiers= $("#campagne_fichier_agent").val();
	var list_fichiers= $("#campagne_fichier_agent").val();

	if (list_fichiers==null)
		list_fichiers="";

	$('#dataEvolutionByDayDiv').hide();
	$('#dataEvolutionByTimeslotDiv').hide();

	$("#ratios_agents_div").html("");
	$("#agent_evolution_div").html("");
	$("#agent_day_evolution_timesolt_div").html("");
	$("#agent_evolution_timesolt_div").html("");
	$("#agent_evolution_for_timeslot_div").html("");


	$('#ratiosByAgentDiv').show();
	$('#dataEvolutionForAllAgentsDiv').show();




	var fieldsToReport=getFieldsToReport();
	var list_qualifs_array=get_list_qualifs();
	var rappel= $('#rappel').is(':checked')==true?"1":"0";

	var sContent ='date_begin=' + date_begin + "&date_end=" +date_end+ "&list_fichiers=" +list_fichiers+ "&ref_user=" +user;
	sContent += "&list_qualifs=" +list_qualifs_array;
	sContent += "&rappel=" +rappel;
	sContent += "&fieldsToReport=" +fieldsToReport;

	$.ajax({
		url: "../ratiosagent/ratiosagent/getGraphsData",
		type: "post",
		dataType: "json",
		data: sContent ,
		success: function(data_result) {
			//console.log('data_result==>'+data_result);
			drawAgentRatiosGraph(data_result.ratios_agents,date_begin,date_end);
			drawAllAgentsRatiosByTimeslotGraph(data_result.agentsEvolutionByTimeslotData,date_begin,date_end);
			if(data_result.listRecordingCalls) {
				tableRecordingCalls(data_result.listRecordingCalls,date_begin,date_end);
			}

			tableEvals(data_result.listEvals);
			//scrollTo("#ratiosByAgentDiv");
		}
	});
}


function tableEvals(listEvals) {


	$(".alert_new_evaluation").html("");
	$("#TableEvals").DataTable({
		"buttons": [
			//{ extend: 'csv', className: 'btn purple btn-outline ' },
			{
				extend: 'excel',
				className: 'btn yellow btn-outline ',

				title: 'list_evaluations'
			},
		],


		dom: 'Bfrtip',
		"bDestroy": true,
		"data": listEvals,
		"bProcessing": true,
		"aaSorting": [ [2,'desc'] ],
		dom: 'Bfrtip',
		"bDestroy": true,
		"data": listEvals,
		"bProcessing": true,
		"aaSorting": [ [2,'desc'] ],
		fnRowCallback: function(nRow, aData, iDisplayIndex) {
			console.log(aData);
			if (aData[4] == 'Non') {
				$('td', nRow).each(function(){
					$(this).addClass('bold');
				});
			}
			return nRow;
		}

	});


}

function tableRecordingCalls(listRecordingCallsData) {


	$("#TableRecordsEmis").DataTable({
		"buttons": [
			//{ extend: 'csv', className: 'btn purple btn-outline ' },
			{
				extend: 'excel',
				className: 'btn yellow btn-outline ',

				title: 'list_appels_emis'
			},
		],


		dom: 'Bfrtip',
		"bDestroy": true,
		"data": listRecordingCallsData.emis,
		"bProcessing": true,
		"aaSorting": [ [2,'desc'] ],

	});


	$("#TableRecordsRecus").DataTable({
		"buttons": [
			//{ extend: 'csv', className: 'btn purple btn-outline ' },
			{
				extend: 'excel',
				className: 'btn yellow btn-outline ',
				title: 'list_appels_recus'
			},
		],


		dom: 'Bfrtip',
		"bDestroy": true,
		"data": listRecordingCallsData.recus,
		"bProcessing": true,
		"aaSorting": [ [2,'desc'] ],

	});
}



function secondsToTime(s,fieldToReport) {
	if( fieldToReport=="Total_Fiches" || fieldToReport=="Total Fiches" || fieldToReport=="Contacts Count")
		return s;
	var h = Math.floor(s/3600); //Get whole hours
	s -= h*3600;
	var m = Math.floor(s/60); //Get remaining minutes
	s -= m*60;

	var hours="";
	if(h>0) hours=h+":";
	return hours+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds

}

function drawDataInChart(chartOptions,fieldsToReport,fieldsValuesData,seriesType) {
	//var chartOptions = $.extend( true, {}, chartOptions0 );


	chartOptions.tooltip= {
		formatter: function(){

			return '<span style="color:'+this.series.color+'">' +this.series.name +'<br/>' +
				this.x +
				': <b>' +
				secondsToTime(this.y,this.series.name) +
				'</b> ';
		}
	};


	jQuery.each(fieldsToReport,function(index, value) {

		var series1 = {
			type: seriesType,// area, areaspline, bar, column, line, pie, scatter or spline, arearange, areasplinerange and columnrange
			yAxis: index,
			data: [],


		};

		if (fieldsValuesData!= null) {
			series1.data=fieldsValuesData[value];
		} else {
			series1.data="";
		}
		series1.name=translate_field_agent(value);
		console.log("vvv",value);
		console.log(translate_field_agent(value));
		colorYAxis=Highcharts.getOptions().colors[index];
		oppositeVal=false;
		if (index%2==1) {
			oppositeVal=true;
		}
		var unite=''; var labelsOptions={};

		if (value=='Total_Fiches') {
			unite=	" ("+lbl_fiches+")";//'Fiches'
		} else {
			labelsOptions={
				formatter: function () {

					var s = this.value;
					//now manipulate the timestamp as you wan using data functions
					/*var hours1=parseInt(time/3600);
					 var mins1=parseInt((parseInt(time%3600))/60);
					 var sec1=parseInt(time%60);

					 if(hours1==0) hours1="";
					 else hours1= hours1 >= 10 ? hours1 : "0"+hours1.toString()+":";

					 if(mins1==0) mins1="";
					 else mins1=mins1 >= 10 ? mins1 : "0"+mins1.toString()+":";

					 if(sec1==0) sec1="";
					 else sec1=sec1 >= 10 ? sec1 : "0"+sec1.toString()+":";

					 //sec1 >= 10 ? sec1 : "0"+sec1.toString();
					 return hours1 +  mins1 +sec1;*/

					return secondsToTime(s);

				}
			};

			labels ="labels:"+labelsOptions;
		}




		chartOptions.yAxis.push({
			title: {
				text: translate_field_agent(value)+unite,
				style: {
					color: colorYAxis
				}
			},
			labels: labelsOptions,
			/*type: 'datetime', //y-axis will be in milliseconds
			 dateTimeLabelFormats: { //force all formats to be hour:minute:second
			 second: '%H:%M:%S',
			 minute: '%H:%M:%S',
			 hour: '%H:%M:%S',
			 day: '%H:%M:%S',
			 week: '%H:%M:%S',
			 month: '%H:%M:%S',
			 year: '%H:%M:%S'
			 },*/
			opposite: oppositeVal,
		});

		chartOptions.series.push(series1);

	});
	return chartOptions;

}



function drawAgentRatiosGraph(data,date_begin,date_end) {
	//alert("eee==>"+date_begin);
	var fieldsToReport=data.fieldsToReport;
	if (fieldsToReport=="") {return;};
	//alert("eee==>"+fieldsToReport);

	var categories_agent = data.categories_agent;
	var fieldsValuesData = data.field_values;


	var chartOptions=getDefalutChartOptions();
	chartOptions.title.text = lbl_ratios_agent;
	chartOptions.chart.renderTo="ratios_agents_div";
	chartOptions.xAxis.categories=categories_agent;
	chartOptions.plotOptions.series.cursor="pointer";
	chartOptions.plotOptions.series.point.events.click=function (e) {
		agent=this.category;
		//alert(date);
		sContentPost = 'agent=' + agent ;
		sContentPost += '&fieldsToReport=' + fieldsToReport ;
		sContentPost += '&date_begin=' + date_begin ;
		sContentPost += '&date_end=' + date_end ;
		sContentPost += "&list_qualifs=" +get_list_qualifs();
		//sContentPost += "&fieldsToReport=" +getFieldsToReport();
		var rappel= $('#rappel').is(':checked')==true?"1":"0";
		sContentPost += "&rappel=" +rappel;

		//alert("eeee "+ this.series.name+" rrr "+this.series.options.id);
		$.ajax({
			url: "../ratiosagent/ratiosagent/getAgentEvolutionGraphsData",
			type: "post",
			data: sContentPost,
			dataType: "json",
			success: function(data_result) {
				//console.log( data_result );
				$('#dataEvolutionByDayDiv').show();
				$('#dataEvolutionByTimeslotDiv').show();
				$('#agent_day_evolution_timesolt_div').html("");
				$('#agent_evolution_for_timeslot_div').html("");
				drawAgentEvolutionGraphByDay(data_result.agentEvolutionData,date_begin,date_end,agent);
				drawAgentEvolutionGraphByTimeslot(data_result.agentEvolutionByTimeslotData,date_begin,date_end,agent);
				scrollTo("#dataEvolutionByDayDiv");
			}
		});
	};


	//alert("rrr"+fieldsToReport);

	chartOptions=drawDataInChart(chartOptions,fieldsToReport,fieldsValuesData,"column");
	chart = new Highcharts.Chart(chartOptions);
}


function drawAllAgentsRatiosByTimeslotGraph(data,date_begin,date_end) {
	//alert("eee==>"+date_begin);
	var fieldsToReport=data.fieldsToReport;
	if (fieldsToReport=="") {return;};

	var timeslotsList = data.timeslotsList;
	var agentValuesData = data.agentValues;


	var chartOptions=getDefalutChartOptions();
	//chartOptions.title.text='Data Evolution for All Agents'+ ' between: ' +date_begin+ ' and '+date_end;
	chartOptions.title.text=lbl_evolution_for_all_agent+ lbl_between +date_begin+ lbl_between_and +date_end;
	chartOptions.chart.renderTo="ratios_allAgents_timesolt_div";
	chartOptions.xAxis.categories=timeslotsList;
	chartOptions.plotOptions.series.cursor="";
	chartOptions.plotOptions.series.point.events.click=function (e) {
		/*timeslotInterval=this.category;
		 //alert(agentName);
		 sContentPost = 'agent=' + agentName ;
		 sContentPost += '&timeslotInterval=' + timeslotInterval ;
		 sContentPost += '&date_begin=' + date_begin ;
		 sContentPost += '&date_end=' + date_end ;
		 sContentPost += '&fieldsToReport=' + fieldsToReport ;

		 //alert("eeee "+ this.series.name+" rrr "+this.series.options.id);
		 $.ajax({
		 url: "../ratiosagent/ratiosagent/getAgentEvolutionForTimeslotData",
		 type: "post",
		 data: sContentPost,
		 dataType: "json",
		 success: function(data_result) {
		 drawAgentEvolutionForTimeslotGraph(data_result.agentDayEvolutionByTimeslotData,timeslotInterval,date_begin,date_end,agent);
		 }
		 });*/
	};


	//alert("rrr"+fieldsToReport);

	chartOptions=drawDataInChart(chartOptions,fieldsToReport,agentValuesData,"spline");
	chart = new Highcharts.Chart(chartOptions);
}


function getDefalutChartOptions() {
	return defaultchartOptions = {
		chart: {
			renderTo: "",
			defaultSeriesType: 'column',
			zoomType: 'x'
		},
		title: {
			text: "",
			style: {
				font: 'normal 16px Verdana, sans-serif',
				color : "blue"
			}
		},
		credits: {
			enabled: false
		},
		exporting: {
			enabled: true,

		},

		xAxis: {
			categories: [],

			labels: {
				rotation: -45,
				align: 'right',
				style: {
					font: 'normal 9px Verdana, sans-serif'
				}
			}
		},
		yAxis: [],
		/*tooltip: {
		 formatter: function(){
		 return '<b>' + this.series.name + '</b><br/>' +
		 this.x +
		 ': ' +
		 this.y +
		 ' ';
		 }
		 },*/
		plotOptions: {
			series: {
				cursor: '',
				point: {
					events: {
						click: function (e) {

						}
					}
				},
				marker: {
					lineWidth: 1
				}
			}
		},
		series: []
	};

}




function drawAgentEvolutionGraphByDay(data,date_begin,date_end,agentName) {

	var fieldsToReport=data.fieldsToReport;
	if (fieldsToReport=="") {return;};

	var daysList = data.daysList;
	var agentValuesData = data.agentValues;

	//console.log(data);

	var chartOptions=getDefalutChartOptions();
	//chartOptions.title.text='Data Evolution by Day for ' + agentName + ' between: ' +date_begin+ ' and '+date_end;

	var agentHtml ='<a  data-id="'+55+'" class="crmComponent crmAgent" >'+agentName+'</a>';
	chartOptions.title.text=lbl_evolution_by_day_for_agent  +'"'+agentName +'"'+  lbl_between +date_begin+ lbl_between_and +date_end;
	chartOptions.chart.renderTo="agent_evolution_div";
	chartOptions.xAxis.categories=daysList;
	chartOptions.plotOptions.series.cursor="pointer";
	chartOptions.plotOptions.series.point.events.click=function (e) {
		date=this.category;
		//alert(agentName);
		sContentPost = 'agent=' + agentName ;
		sContentPost += '&date=' + date ;
		sContentPost += '&fieldsToReport=' + fieldsToReport ;
		sContentPost += '&date=' + date ;
		sContentPost += "&list_qualifs=" +get_list_qualifs();
		var rappel= $('#rappel').is(':checked')==true?"1":"0";
		sContentPost += "&rappel=" +rappel;

		//alert("eeee "+ this.series.name+" rrr "+this.series.options.id);
		$.ajax({
			url: "../ratiosagent/ratiosagent/getAgentDayEvolutionByTimeslotData",
			type: "post",
			data: sContentPost,
			dataType: "json",
			success: function(data_result) {
				//console.log( data_result );
				drawAgentDayEvolutionByTimeslotGraph(data_result.agentDayEvolutionByTimeslotData,date,agentName);
				scrollTo("#agent_evolution_div");
				makeCrmTooltip();
			}
		});
	};

	//alert("rrr"+fieldsToReport);
	//chartOptions.xAxis.categories=categories_agent;

	chartOptions=drawDataInChart(chartOptions,fieldsToReport,agentValuesData,"spline");
	chart = new Highcharts.Chart(chartOptions);
}


function drawAgentEvolutionGraphByTimeslot(data,date_begin,date_end,agentName) {

	var fieldsToReport=data.fieldsToReport;
	if (fieldsToReport=="") {return;};

	var timeslotsList = data.timeslotsList;
	var agentValuesData = data.agentValues;

	//console.log(data);

	var chartOptions=getDefalutChartOptions();
	//chartOptions.title.text='Data Evolution by timeslot for ' + agentName + ' between: ' +date_begin+ ' and '+date_end;
	chartOptions.title.text= lbl_evolution_by_timeslot_for_agent + '"' + agentName + '"' + lbl_between +date_begin+ lbl_between_and +date_end;
	chartOptions.chart.renderTo="agent_evolution_timesolt_div";
	chartOptions.xAxis.categories=timeslotsList;
	chartOptions.plotOptions.series.cursor="pointer";
	chartOptions.plotOptions.series.point.events.click=function (e) {
		timeslotInterval=this.category;
		//alert(agentName);
		sContentPost = 'agent=' + agentName ;
		sContentPost += '&timeslotInterval=' + timeslotInterval ;
		sContentPost += '&date_begin=' + date_begin ;
		sContentPost += '&date_end=' + date_end ;
		sContentPost += '&fieldsToReport=' + fieldsToReport ;
		sContentPost += "&list_qualifs=" +get_list_qualifs();
		var rappel= $('#rappel').is(':checked')==true?"1":"0";
		sContentPost += "&rappel=" +rappel;

		//alert("eeee "+ this.series.name+" rrr "+this.series.options.id);
		$.ajax({
			url: "../ratiosagent/ratiosagent/getAgentEvolutionForTimeslotData",
			type: "post",
			data: sContentPost,
			dataType: "json",
			success: function(data_result) {
				drawAgentEvolutionForTimeslotGraph(data_result.agentDayEvolutionByTimeslotData,timeslotInterval,date_begin,date_end,agent);
				scrollTo("#agent_evolution_timesolt_div");
			}
		});
	};

	//alert("rrr"+fieldsToReport);

	chartOptions=drawDataInChart(chartOptions,fieldsToReport,agentValuesData,"spline");
	chart = new Highcharts.Chart(chartOptions);
}




function drawAgentDayEvolutionByTimeslotGraph(data,date,agentName) {

	var fieldsToReport=data.fieldsToReport;
	if (fieldsToReport=="") {return;};

	var timeslotsList = data.timeslotsList;
	var agentValuesData = data.agentValues;

	//console.log(data);

	var chartOptions=getDefalutChartOptions();
	//chartOptions.title.text='Data Evolution by timeslot for ' + agentName + ' for Date : ' + date;
	chartOptions.title.text=lbl_evolution_by_timeslot_for_agent + '"' + agentName + '"' + lbl_for_date + date;
	chartOptions.chart.renderTo="agent_day_evolution_timesolt_div";
	chartOptions.xAxis.categories=timeslotsList;

	//alert("rrr"+fieldsToReport);

	chartOptions=drawDataInChart(chartOptions,fieldsToReport,agentValuesData,"spline");
	chart = new Highcharts.Chart(chartOptions);
}

function drawAgentEvolutionForTimeslotGraph(data,timeslotInterval,date_begin,date_end,agentName) {

	var fieldsToReport=data.fieldsToReport;
	if (fieldsToReport=="") {return;};

	var daysList = data.daysList;
	var agentValuesData = data.agentValues;

	//console.log(data);

	var chartOptions=getDefalutChartOptions();
	chartOptions.title.text=lbl_evolution_by_day_for_timeslot + timeslotInterval + lbl_by_day_for +  '"' +agentName +  '"' + lbl_between +date_begin+ lbl_between_and +date_end;
	chartOptions.chart.renderTo="agent_evolution_for_timeslot_div";
	chartOptions.xAxis.categories=daysList;


	//alert("rrr"+fieldsToReport);
	//chartOptions.xAxis.categories=categories_agent;
	chartOptions=drawDataInChart(chartOptions,fieldsToReport,agentValuesData,"spline");
	chart = new Highcharts.Chart(chartOptions);
}




function translate_field_agent(value) {
	if (TranslationRatios[value]!=null) {
		return TranslationRatios[value];
	} else{
		return value;
	};

}