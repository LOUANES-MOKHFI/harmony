$(document).ready(function () {
    // Setup - add a text input to each footer cell

    $('#search_r thead tr')
        .clone(true)
        .addClass('filters_t')
        .appendTo('#search_r thead');

    var table = $('#search_r').DataTable({
        responsive: true,
        orderCellsTop: true,
        fixedHeader: true,
        scrollX: '300px',
        scrollY: '300px',
        scrollCollapse: true,
        paging:         true,
        columnDefs: [
            { width: 50, targets: 0 }
        ],
        fixedColumns: true,

        initComplete: function () {
            var api = this.api();

            // For each column
            api
                .columns()
                .eq(0)
                .each(function (colIdx) {
                    // Set the header cell to contain the input element
                    var cell = $('.filters_t th').eq(
                        $(api.column(colIdx).header()).index()
                    );
                    var title = $(cell).text();
                    if(title == "Start Time" || title == "End Time" ){
                        $(cell).html('<input type="datetime-local" value="2022-12-02" />');
                    }else {
                        $(cell).html('<input type="text" placeholder="' + title + '" />');
                        //$(cell).html('<input type="text" placeholder="' + title + '" />');
                    }

                    /*if ($(api.column(colIdx).header()).index() >= 0) {
                        $(cell).html('<input type="text" placeholder="' + title + '"/>');
                    }*/

                    // On every keypress in this input
                    $(
                        'input',
                        $('.filters_t th').eq($(api.column(colIdx).header()).index())
                    )
                        .off('keyup change')
                        .on('change', function (e) {
                            // Get the search value
                            $(this).attr('title', $(this).val());
                            var regexr = '({search})'; //$(this).parents('th').find('select').val();

                            //alert(this.selectionStart);
                            var cursorPosition = this.selectionStart;
                            //console.log(cursorPosition);
                            // Search the column for that value
                            api
                                .column(colIdx)
                                .search(
                                    this.value != ''
                                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                                        : '',
                                    this.value != '',
                                    this.value == ''
                                )
                                .draw();
                        })
                        .on('keyup', function (e) {
                            e.stopPropagation();

                            $(this).trigger('change');
                            $(this)
                                .focus()[0]
                                .setSelectionRange(cursorPosition, cursorPosition);
                        });
                });
        },
    });
});