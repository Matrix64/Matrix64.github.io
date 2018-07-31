$(function(){
	var panel = $(".popPanel");	
	var w = panel.outerWidth();
	
	$(".qrcode").hover(function(){
		panel.css("width","0px").show();
		panel.animate({"width" : w + "px"},300);
	},function(){
		panel.animate({"width" : "0px"},300);
	});
	
});