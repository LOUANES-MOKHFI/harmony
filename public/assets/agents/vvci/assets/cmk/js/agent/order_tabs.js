function order_tabs(data_returns){
	var li_content = "";
	li_content = data_returns.li;
	$('#myTabProd').html(li_content);
	$('#Phonning').addClass(data_returns.Phonning);
	$('#objection').addClass(data_returns.objection);
	$('#livechat').addClass(data_returns.livechat);
	$('#agendapartager').addClass(data_returns.agendapartager);
	$('#listweb').addClass(data_returns.listweb);
	$('#sales').addClass(data_returns.listsales);

	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {

		if (e.target.hash == "#agendapartager") {
			$(".fc-today-button").trigger("click");
		}

	});







}