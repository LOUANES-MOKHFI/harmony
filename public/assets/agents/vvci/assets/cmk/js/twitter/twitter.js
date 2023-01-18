
var active_conf = "";

$(document).ready( function() {
    $('#dialog_comment_post').hide();
    $('#dialog_add_post').hide();
    $(".class_datepicker").datepicker();
    //show_posts();
    $('#x_day').live('keyup', function(e) {
      $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });

});



$('#repliesModal').on('hidden.bs.modal', function() {

	$('#historyReplies').html("");
});

$('.nav-pills a').on('shown.bs.tab', function(event){
	active_conf = $(event.target).data('active-conf');         // active tab
	$('.search_hashtag').data('active-conf',active_conf);

});


function search_hashtag_one(active_conf,hashtag_string) {

	hashtag_string = typeof hashtag_string !== 'undefined' ? hashtag_string : $(".hashtag[data-active-conf='"+active_conf+"']").val();


	var sContent = "hashtag="+hashtag_string+'&active_conf='+active_conf;
	//var sContent = "hashtag="+$("#hashtag").val(); // TEMP MODIF BY SCON
	$.ajax({
		url: base_url_ajax + "twitter/twitter/get_hashtag_search",
		dataType:"json",
		type: "post",
		beforeSend: function( xhr ) {
			$('.process_hashtag').html('Process en cours...');
		},
		data : sContent,
		success: function(data_result) {
			$('.process_hashtag').html('');

			//$('#resultstats').html(data_result);
			//if(data_result.htmlLogin=="") {
			drawTableData(data_result.fieldsNameList,data_result.data,"resulttweet");
			// } else {
			// $('#resultstats').html(data_result.htmlLogin);
			// }


		}
	});

}


var SearchTimeout;
$(document).on('click','.search_hashtag',function(){
 	active_conf = $(this).data('active-conf');
	hashtag_string = $(this).data('hashtag');
	search_hashtag(active_conf,hashtag_string)
});
function search_hashtag(active_conf,hashtag_string) {

	if(SearchTimeout) {
		window.clearInterval(SearchTimeout);
	}

	SearchTimeout=window.setInterval(function(){
		search_hashtag_one(active_conf,hashtag_string);
	}, 30*1000); //1s

	search_hashtag_one(active_conf,hashtag_string);

}

function add_post_twitter() {

	var postText = prompt("Please enter tweet", "");
	if (postText != null) {
		var sContentPost = 'postText=' + postText+'&active_conf='+active_conf;;
		$.ajax({
				url: base_url_ajax + "twitter/twitter/addPost",
				type: "post",
				data: sContentPost,
				dataType: "json",
				success: function(data_result) {
					alert( "Tweet processed, id="+data_result.data);
					//show_posts();
				}
		    });
	}

}



function post_image_twitter() {
	$('#addFileModalTwitter').modal('show');
}


$(document).on('click','#addFileConfirmTwitter',function(){
	var type = $('#type').val();

	switch (type){
		case 'img':
			post_photo_twitter();
			break;


		case 'vid':
			post_video_twitter();
			break;
	}


});

function post_photo_twitter() {

	data = new FormData($('#form-upload-attached-twitter')[0]);

	data.append('active_conf',active_conf)
	console.log(data);
	//var attached_files = $('.attached_files').val();
	/*var attached_files = $('#piece_jointe').val();
	var text_post = $('#text_post').val();

	var sContentPost = 'postText=' + text_post;
	sContentPost += '&attached_files=' + attached_files;*/
	$.ajax({
			url: base_url_ajax + "twitter/twitter/postImage",
			type: "post",
			//data: sContentPost,
			data: data,
			processData: false,
			contentType: false,
			dataType: "json",
			success: function(data) {
				//alert( "Tweet processed, id="+data_result.data);
				//show_posts();

				if (data["type"] != "error") {
					$('#addFileModalTwitter').modal('hide');
				}
				show_msg_log(data["msg"], data["type"]);
			}
		});
}


/*
function post_image() {

	var postText = prompt("Please enter tweet", "");

	var sContentPost = 'postText=' + postText;
	$.ajax({
			url: base_url_ajax + "twitter/twitter/postImage",
			type: "post",
			data: sContentPost,
			dataType: "json",
			success: function(data_result) {
				alert( "Tweet processed, id="+data_result.data);
				//show_posts();
			}
		});

}
*/


function directMessage(screen_name) {

	var message = prompt("Message to send", "");

	if (message != null) {
		var sContentPost = 'screen_name=' + screen_name;
	 sContentPost += '&message=' + message+'&active_conf=' + active_conf;
		$.ajax({
			url: base_url_ajax + "twitter/twitter/directMessage",
			type: "post",
			data: sContentPost,
			dataType: "json",
			success: function (data_result) {
				alert("message sent");
				//show_posts();
			}
		});
	}

}


function ReplyTweet(tweet_id,poster_screen_name)  {
	
	var commentText = prompt("Reply to tweet", "");
	if (commentText != null) {
		
		sContentPost = 'tweet_id=' + tweet_id ;
		sContentPost += '&commentText=' + '@'+poster_screen_name+ ' ' + commentText+'&active_conf=' + active_conf;
		//alert(commentText);
		$.ajax({
			url: base_url_ajax + "twitter/twitter/addPostComment",
			type: "post",
			data: sContentPost,

			dataType: "json",
			success: function(data_result) {
				alert( "Tweet processed, id="+data_result.data);
				//show_posts();
			}
		});
	}
	
	
}

function Like(tweet_id)  {

	sContentPost = 'tweet_id=' + tweet_id +'&active_conf=' + active_conf;
	$.ajax({
		url: base_url_ajax + "twitter/twitter/Like",
		type: "post",
		data: sContentPost,
		dataType: "json",
		success: function(data_result) {
			alert( "Tweet processed, id="+data_result.data);
			//show_posts();
		}
	});


}


$(document).on('click','.View_Replies',function(){

	tweet_id = $(this).data('tweet-id');
	poster_screen_name = $(this).data('poster-screen');
	parent_poster_screen_name = $(this).data('parent-poster-screen');
	parentTweetId = $(this).data('parenttweet-id');
	showFildariane = $(this).data('show-fildariane');


	/*sContentPost = 'tweet_id=' + tweet_id ;
	sContentPost += '&poster_screen_name=' + '@'+poster_screen_name;

	$('#repliesModal').modal('show');
	$.ajax({
		url: base_url_ajax + "twitter/twitter/viewReplies",
		type: "post",
		data: sContentPost,
		dataType: "json",
		success: function(data_result) {
			//alert( "ok"+data_result.data);

			console.log(data_result);
			$("historyReplies").html("<a href='#javascript:;' onClick='View_Replies(\""+tweet_id+"\",\""+poster_screen_name+"\")'>Back</a>");
			drawTableData(data_result.fieldsNameList,data_result.data,"resultReplies");



		}
	});*/

	console.log("fff=>"+tweet_id+poster_screen_name+parentTweetId+parent_poster_screen_name)
	View_Replies_twitter(tweet_id,poster_screen_name,parentTweetId,parent_poster_screen_name,showFildariane);
})

function SetRepliesHistory(tweet_id,poster_screen_name)  {

	$("#historyReplies").html("<a href='#javascript:;' onClick='View_Replies_twitter(\""+tweet_id+"\",\""+poster_screen_name+"\")'>Back</a>");

}

var fildariane = [];
function View_Replies_twitter(tweet_id,poster_screen_name,parentTweetId,parent_poster_screen_name,showFildariane)  {

	sContentPost = 'tweet_id=' + tweet_id ;
	sContentPost += '&poster_screen_name=' + '@'+poster_screen_name+'&active_conf=' + active_conf;

	$('#repliesModal').modal('show');
	$.ajax({
		url: base_url_ajax + "twitter/twitter/viewReplies",
		type: "post",
		data: sContentPost,
		dataType: "json",
		success: function(data_result) {


			console.log(data_result);
			drawTableData(data_result.fieldsNameList,data_result.data,"resultReplies");


			var previousHistoryReplies=$("#historyReplies").html();

			if(showFildariane==1) {
				var sep ="";
				if (previousHistoryReplies!="")
					sep = "/";
				$("#historyReplies").html(previousHistoryReplies + sep + " <a href='#javascript:;' onClick='View_Replies_twitter(\"" + parentTweetId + "\",\"" + parent_poster_screen_name + "\",\"\",\"\",2)'>Back " + poster_screen_name + "</a>");
			}

			if(showFildariane==2) {
				$("#historyReplies").html(fildariane[tweet_id]);
				//console.log(tweet_id+" ==>"+fildariane[tweet_id])
			} else {
				fildariane[parentTweetId]=previousHistoryReplies;
				//console.log(tweet_id+" PPP==>"+fildariane[parentTweetId])
			}

			//alert( "ok"+data_result.data);

		}
	});


}

function Retweet(tweet_id)  {

	sContentPost = 'tweet_id=' + tweet_id+ '&active_conf=' + active_conf;
	$.ajax({
		url: base_url_ajax + "twitter/twitter/Retweet",
		type: "post",
		data: sContentPost,
		dataType: "json",
		success: function(data_result) {
			alert( "Tweet processed, id="+data_result.data);
			//show_posts();
		}
	});


}





function drawTableData(fieldsToReport,dataTableData,renderTo) {
	var aoColumnsValue = new Array();
	jQuery.each(fieldsToReport,function(index, value) {
		var obj = new Object();
		obj['sTitle'] = value;
		obj['mData'] = value;
		if (index=0) {
			obj['sWidth'] = "50%";
		}
		
		aoColumnsValue.push(obj);
	});

	var renderToDiv='#'+renderTo;
	var TableId=renderTo+'Table';
	var aaDataValue=dataTableData;
	$(renderToDiv).html( '<table class="table table-striped  table-hover" id="'+TableId+'"></table>' );
	 
	$('#'+TableId).dataTable( {
		"aaData": aaDataValue,
	 	"aoColumns": aoColumnsValue,
		"columnDefs": [
			{ "visible": false, "targets": 0 }
		],
		"order": [[ 0, 'asc' ]],
	 	"iDisplayLength": 50,
	 	//"sDom": '<"top">rt<"bottom"flp><"clear">',
		buttons: [
			//{ extend: 'csv', className: 'btn purple btn-outline ' },
			{ extend: 'excel', className: 'btn yellow btn-outline ' },
			{ extend: 'colvis', className: 'btn dark btn-outline', text: 'Columns'}
		],
		dom: 'Bfrtip',
		bFilter: false, bInfo: false
    } );
   
   
}




function drawTableDataReplies(fieldsToReport,dataTableData,renderTo) {
	var aoColumnsValue = new Array();
	jQuery.each(fieldsToReport,function(index, value) {
		var obj = new Object();
		obj['sTitle'] = value;
		obj['mData'] = value;
		if (index==0) {
			obj['sWidth'] = "50%";
		}

		aoColumnsValue.push(obj);
	});

	var renderToDiv='#'+renderTo;
	var TableId=renderTo+'Table';
	var aaDataValue=dataTableData;
	$(renderToDiv).html( '<table class="table table-striped  table-hover" id="'+TableId+'"></table>' );

	$('#'+TableId).dataTable( {
		"aaData": aaDataValue,
		"aoColumns": aoColumnsValue,
		"iDisplayLength": 50,
		"sDom": '<"top">rt<"bottom"flp><"clear">',
		bFilter: false, bInfo: false
	} );

}

function drawPostsData(data_result_stat,renderTo) {
	var fieldsToReport = data_result_stat.fieldsNameList;
	dataTableData=data_result_stat.data;
	drawTableData(fieldsToReport,dataTableData,renderTo);
}


$(document).on('keyup','#hashtag',function () {
	clearInterval(SearchTimeout);

})


