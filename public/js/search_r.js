$('#formsubmit').on('submit', function (e){
    e.preventDefault();
    //console.log("hello");
    let d_from = $('#first_date').val();
    let d_to = $('#second_date').val();
    let cpm_s = $('#cpmname').val();
    var table = $('#search_data');

    //console.log(d_from, d_to, cpm_s);

    $.ajax({
        type: 'GET',
        url: 'recording_search',
        data: {
            d_from: d_from,
            d_to: d_to,
            cpm_s: cpm_s
        },
        dataType: 'json',


        beforeSend: function (){
            $('#all_content_s').hide();
            $('#loader').show();
        },

        complete: function (){
            $('#loader').hide();
            $('#all_content_s').show();
        },

        success: function (response){

            table.empty();
            $.each(response, function (a, b){
                table.append(
                    "<tr>" +
                        "<td>"+b.full_name+"</td>" +
                        "<td>"+b.campaign_name+"</td>"+
                        "<td>" + b.filename + "</td>" +
                        "<td>" +
                            "<audio controls> <source src=\"" + b.location + "\" type=\"audio/mpeg\"> </audio>" +
                        "</td>" +
                        "<td>" + b.length_in_sec + "</td>" +
                        "<td>" + b.length_in_min + "</td>" +
                        "<td>" + b.start_time + "</td>" +
                        "<td>" + b.end_time + "</td>" +
                        "<td>" + b.server_ip + "</td>" +
                    "</tr>");
            });


        },

        error: function (error){
            alert('error : '+error);
        }
  })

});
