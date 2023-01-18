function web(data_return){
	$("#cmk_sites_reference").html('');
	if (data_return != "") {
		$('#listweb').removeClass('hidden');
		$('#tablistweb').removeClass('hidden');
		$("#cmk_sites_reference").append(data_return);
		$("#cmk_sites_reference_frame").attr("src",
			$("#cmk_sites_reference :eq(0)").val())
	} else {
		$('#listweb').addClass('hidden');
		$('#tablistweb').addClass('hidden')
	}

	var x_nbr_web = document.getElementById("cmk_sites_reference").length;
	if(x_nbr_web==1){
		$("#cmk_sites_reference").addClass('hidden')
	}else{
		$("#cmk_sites_reference").removeClass('hidden')

	}
	$(document).on("click, change", "#cmk_sites_reference", function() {
		$("#cmk_sites_reference_frame").attr("src", $(this).val())
	});
}