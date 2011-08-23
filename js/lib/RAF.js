// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return	window.requestAnimationFrame       || 
					window.webkitRequestAnimationFrame || 
					window.mozRequestAnimationFrame    || 
					window.oRequestAnimationFrame      || 
					window.msRequestAnimationFrame     || 
					function(/* function */ callback, /* DOMElement */ element){
						window.setTimeout(callback, 1000 / 60);
					};
})();