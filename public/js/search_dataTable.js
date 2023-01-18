/** Seconds **/
/* Custom filtering function which will search data in column four between two values */
$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    /** Seconds **/
    var min = parseInt($('#min').val(), 10);
    var max = parseInt($('#max').val(), 10);
    var sec = parseFloat(data[4]) || 0; // use data for the age column


    if (

        (isNaN(min) && isNaN(max)) ||
        (isNaN(min) && sec <= max) ||
        (min <= sec && isNaN(max)) ||
        (min <= sec && sec <= max)

    ) {
        return true;
    }
    return false;
});



/** Minutes **/
/* Custom filtering function which will search data in column four between two values */
$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {

    /** Minutes **/
    var min_minute = parseFloat($('#min_minute').val());
    var max_minute = parseFloat($('#max_minute').val());
    var minute = parseFloat(data[5]) || 0; // use data for the age column


    if (

        (isNaN(min_minute) && isNaN(max_minute)) ||
        (isNaN(min_minute) && minute <= max_minute) ||
        (min_minute <= minute && isNaN(max_minute)) ||
        (min_minute <= minute && minute <= max_minute)

    ) {
        return true;
    }
    return false;
});


/** Time **/
/* Custom filtering function which will search data in column four between two values */
$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {

    /** Minutes **/
    var min_time = parseFloat($('#min_time').val());
    var max_time = parseFloat($('#max_time').val());
    var m_time = parseFloat(data[6]) || 0; // use data for the age column


    if (

        (isNaN(min_time) && isNaN(max_time)) ||
        (isNaN(min_time) && m_time <= max_time) ||
        (min_time <= m_time && isNaN(max_time)) ||
        (min_time <= m_time && m_time <= max_time)

    ) {
        return true;
    }
    return false;
});



$(document).ready(function () {
    //var table = $('#example').DataTable();

    $('#search_rr thead tr')
        .clone(true)
        .addClass('filters')
        .appendTo('#search_rr thead');

    var table = $('#search_rr').DataTable({
        orderCellsTop: true,
        fixedHeader: true,
        scrollX: '300px',
        scrollY: '300px',
        scrollCollapse: true,

        initComplete: function () {
            var api = this.api();

            // For each column
            api
                .columns()
                .eq(0)
                .each(function (colIdx) {
                    // Set the header cell to contain the input element
                    var cell = $('.filters th').eq(
                        $(api.column(colIdx).header()).index()
                    );
                    var title = $(cell).text();
                    $(cell).html('<input type="text" placeholder="' + title + '" />');

                    // On every keypress in this input
                    $(
                        'input',
                        $('.filters th').eq($(api.column(colIdx).header()).index())
                    )
                        .off('keyup change')
                        .on('change', function (e) {
                            // Get the search value
                            $(this).attr('title', $(this).val());
                            var regexr = '({search})'; //$(this).parents('th').find('select').val();

                            var cursorPosition = this.selectionStart;
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

    /** Minutes **/
    // Event listener to the two range filtering inputs to redraw on input
    $('#min_minute, #max_minute').keyup(function () {
        table.draw();
    });

    /** Seconds **/
    // Event listener to the two range filtering inputs to redraw on input
    $('#min, #max').keyup(function () {
        table.draw();
    });

    /** Time **/
    // Event listener to the two range filtering inputs to redraw on input
    $('#min_time, #max_time').keyup(function () {
        table.draw();
    });


});
