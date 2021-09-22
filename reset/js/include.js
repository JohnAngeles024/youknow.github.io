

//ヘッダー・フッター読み込み
var windowWidth = $(window).width();
var windowSm = 640;
if (windowWidth <= windowSm) {
    $(function(){
	  $("#header").load("reset/js/sp/header.html");
	});

	$(function(){
	  $("#footer").load("reset/js/sp/footer.html");
	});
} else {
    $(function(){
	  $("#header").load("reset/js/header.html");
	});

	$(function(){
	  $("#footer").load("reset/js/footer.html");
	});
}

var timer = false;
	$(window).on("resize", function() {
	var w = window.innerWidth;
	if(w > 640) {
	if (timer !== false) {
	clearTimeout(timer);
	}
	timer = setTimeout(function(){
	window.location = window.location;
	}, 800);
	}
});