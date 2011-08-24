// Shim courtesy of Paul Irish & Jerome Etienne
window.cancelRequestAnimFrame = ( function() {
		return window.cancelAnimationFrame           ||
				window.webkitCancelRequestAnimationFrame ||
				window.mozCancelRequestAnimationFrame    ||
				window.oCancelRequestAnimationFrame      ||
				window.msCancelRequestAnimationFrame     ||
				clearTimeout
} )();

window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame   || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function(/* function */ callback, /* DOMElement */ element){
						return window.setTimeout(callback, 1000 / 60);
				};
})();