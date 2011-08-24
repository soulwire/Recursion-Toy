
/**
 * --------------------
 * SETTINGS
 * --------------------
 */

var CONFIG  = {};
var PRESETS = {};
var RENDER_MODES = {
	Segmented: 'segmented',
	Sketched:  'sketched',
	Darkness:  'darkness'
};

CONFIG.RENDER_MODE = RENDER_MODES.Darkness;

PRESETS['Default'] = {

	BRANCH_PROBABILITY:  0.15,
	MAX_CONCURRENT:      800,
	NUM_BRANCHES:        2,

	MIN_RADIUS:          0.1,
	MAX_RADIUS:          20.0,

	MIN_WANDER_STEP:     0.1,
	MAX_WANDER_STEP:     0.3,
	
	MIN_GROWTH_RATE:     5.0,
	MAX_GROWTH_RATE:     9.0,

	MIN_SHRINK_RATE:     0.98,
	MAX_SHRINK_RATE:     0.99,

	MIN_DIVERGENCE:      0.01,
	MAX_DIVERGENCE:      0.05
};

PRESETS['Roots']     = {BRANCH_PROBABILITY:0.05,MAX_CONCURRENT:800,NUM_BRANCHES:3,MIN_RADIUS:0.1,MAX_RADIUS:50,MIN_WANDER_STEP:0.28,MAX_WANDER_STEP:0.7000000000000001,MIN_GROWTH_RATE:5,MAX_GROWTH_RATE:9,MIN_SHRINK_RATE:0.98,MAX_SHRINK_RATE:0.99,MIN_DIVERGENCE:0.01,MAX_DIVERGENCE:0.05};
PRESETS['Roots 2']   = {BRANCH_PROBABILITY:0.09,MAX_CONCURRENT:500,NUM_BRANCHES:5,MIN_RADIUS:0.1,MAX_RADIUS:50,MIN_WANDER_STEP:0.1,MAX_WANDER_STEP:0.2,MIN_GROWTH_RATE:3.7,MAX_GROWTH_RATE:8,MIN_SHRINK_RATE:0.97,MAX_SHRINK_RATE:0.99,MIN_DIVERGENCE:0.01,MAX_DIVERGENCE:0.05};
PRESETS['Long']      = {BRANCH_PROBABILITY:1,MAX_CONCURRENT:350,NUM_BRANCHES:3,MIN_RADIUS:0.1,MAX_RADIUS:50,MIN_WANDER_STEP:0.1,MAX_WANDER_STEP:0.72,MIN_GROWTH_RATE:0.9,MAX_GROWTH_RATE:6.15,MIN_SHRINK_RATE:0.935,MAX_SHRINK_RATE:0.999,MIN_DIVERGENCE:0.01,MAX_DIVERGENCE:0.05};
PRESETS['Tree']      = {BRANCH_PROBABILITY:0.06,MAX_CONCURRENT:437,NUM_BRANCHES:1,MIN_RADIUS:0.1,MAX_RADIUS:50,MIN_WANDER_STEP:0.05,MAX_WANDER_STEP:0.25,MIN_GROWTH_RATE:5,MAX_GROWTH_RATE:9,MIN_SHRINK_RATE:0.98,MAX_SHRINK_RATE:0.99,MIN_DIVERGENCE:0,MAX_DIVERGENCE:0.1};

function configure(settings) {
	for(var prop in settings) {
		CONFIG[prop] = settings[prop];
	}
}

configure(PRESETS['Tree']);

/**
 * --------------------
 * UTILS
 * --------------------
 */

var PI           = Math.PI;
var TWO_PI       = Math.PI * 2;
var HALF_PI      = Math.PI / 2;
var BRANCHES     = [];

function random(min, max) {
	return min + Math.random() * (max - min);
}

/**
 * --------------------
 * BRANCH
 * --------------------
 */

var Branch = function(x, y, theta, radius, scale, generation) {

	this.x           = x;
	this.y           = y;
	this.ox          = x;
	this.oy          = y;
	this.x1          = NaN;
	this.x2          = NaN;
	this.y1          = NaN;
	this.y2          = NaN;
	this.scale       = scale || 1.0;
	this.theta       = theta;
	this.oTheta      = theta;
	this.radius      = radius;
	this.generation  = generation || 1;
	this.growing     = true;
	this.age         = 0;

	this.wanderStep  = random(CONFIG.MIN_WANDER_STEP, CONFIG.MAX_WANDER_STEP);
	this.growthRate  = random(CONFIG.MIN_GROWTH_RATE, CONFIG.MAX_GROWTH_RATE);
	this.shrinkRate  = random(CONFIG.MIN_SHRINK_RATE, CONFIG.MAX_SHRINK_RATE);
}

Branch.prototype = {

	update: function() {

		if(this.growing) {
			
			this.ox = this.x;
			this.oy = this.y;
			this.oTheta = this.theta;

			this.theta += random(-this.wanderStep, this.wanderStep);

			this.x += Math.cos(this.theta) * this.growthRate * this.scale;
			this.y += Math.sin(this.theta) * this.growthRate * this.scale;

			this.scale  *= this.shrinkRate;

			// Branch
			if(BRANCHES.length < CONFIG.MAX_CONCURRENT && Math.random() < CONFIG.BRANCH_PROBABILITY) {
				
				var offset = random(CONFIG.MIN_DIVERGENCE, CONFIG.MAX_DIVERGENCE);
				var theta  = this.theta + offset * (Math.random() < 0.5 ? 1 : -1);
				var scale  = this.scale * 0.95;
				var radius = this.radius * scale;
				var branch = new Branch(this.x, this.y, theta, radius, scale);

				branch.generation = this.generation + 1;

				BRANCHES.push(branch);
			}

			// Limit
			if(this.radius * this.scale <= CONFIG.MIN_RADIUS) {
				this.growing = false;
			}

			this.age++;
		}
	},

	render: function(context) {

		if(this.growing) {

			var x1, x2, y1, y2;
			var scale = this.scale;
			var radius = this.radius * scale;

			context.save();

			switch(CONFIG.RENDER_MODE) {

				case RENDER_MODES.Segmented :

					// Draw outline
					context.beginPath();
					context.moveTo(this.ox, this.oy);
					context.lineTo(this.x, this.y);
					
					if(radius > 5.0) {
						context.shadowOffsetX = 2;
						context.shadowOffsetY = 2;
						context.shadowBlur    = 2 * scale;
						context.shadowColor   = 'rgba(0,0,0,0.05)';	
					}
					
					context.lineWidth = radius + scale;
					context.strokeStyle = '#000';
					context.lineCap = 'round';
					context.stroke();
					context.closePath();
					
					// Draw fill
					context.beginPath();
					context.moveTo(this.ox, this.oy);
					context.lineTo(this.x, this.y);

					context.lineWidth = radius;
					context.strokeStyle = '#FFF';
					context.lineCap = 'round';
					context.stroke();

					context.closePath();

					break;
				
				case RENDER_MODES.Sketched :

					x1 = this.x + Math.cos(this.theta - HALF_PI) * radius;
					x2 = this.x + Math.cos(this.theta + HALF_PI) * radius;

					y1 = this.y + Math.sin(this.theta - HALF_PI) * radius;
					y2 = this.y + Math.sin(this.theta + HALF_PI) * radius;

					context.lineWidth = 0.25 + scale;
					context.strokeStyle = '#000';
					context.fillStyle = '#FFF';
					context.lineCap = 'round';
					
					// Starting point
					if(this.generation === 1 && this.age === 1) {
						context.beginPath();
						context.arc(this.x, this.y, radius, 0, TWO_PI);
						context.stroke();
						context.fill();
					}

					// Draw sides
					if(this.age > 1) {
						context.beginPath();
						context.moveTo(this.x1, this.y1);
						context.lineTo(x1, y1);
						context.moveTo(this.x2, this.y2);
						context.lineTo(x2, y2);
						context.stroke();
					}

					// Draw ribbon
					context.beginPath();
					context.moveTo(this.x1, this.y1);
					context.lineTo(x1, y1);
					context.lineTo(x2, y2);
					context.lineTo(this.x2, this.y2);
					context.closePath();
					context.fill();

					this.x1 = x1;
					this.x2 = x2;

					this.y1 = y1;
					this.y2 = y2;

					break;

				case RENDER_MODES.Darkness :

					x1 = this.x + Math.cos(this.theta - HALF_PI) * radius;
					x2 = this.x + Math.cos(this.theta + HALF_PI) * radius;

					y1 = this.y + Math.sin(this.theta - HALF_PI) * radius;
					y2 = this.y + Math.sin(this.theta + HALF_PI) * radius;

					context.lineWidth = scale;
					context.strokeStyle = 'rgba(255,255,255,0.9)';
					context.lineCap = 'round';
					context.fillStyle = '#111';

					// Starting point
					if(this.generation === 1 && this.age === 1) {
						context.beginPath();
						context.arc(this.x, this.y, radius, 0, TWO_PI);
						context.closePath();
						context.fill();
						context.stroke();
					}
					
					// Shadow
					if(scale > 0.05) {
						context.shadowOffsetX = scale;
						context.shadowOffsetY = scale;
						context.shadowBlur    = scale;
						context.shadowColor   = '#111';	
					}	

					// Draw ribbon
					context.beginPath();
					context.moveTo(this.x1, this.y1);
					context.lineTo(x1, y1);
					context.lineTo(x2, y2);
					context.lineTo(this.x2, this.y2);
					context.closePath();
					context.fill();

					// Draw sides
					if(this.age > 1 && scale > 0.1) {
						context.beginPath();
						context.moveTo(this.x1, this.y1);
						context.lineTo(x1, y1);
						context.moveTo(this.x2, this.y2);
						context.lineTo(x2, y2);
						context.stroke();
					}

					this.x1 = x1;
					this.x2 = x2;

					this.y1 = y1;
					this.y2 = y2;

					break;
			}
			
			context.restore();
		}
	},

	destroy: function() {
		
	}
};

/**
 * --------------------
 * SKETCH
 * --------------------
 */

var Recursion = new function() {

	var started      = false;
	var $canvas      = $('#canvas');
	var $branchCount = $('#output .branchCount');
	var canvas       = $canvas[0];
	var context      = canvas.getContext('2d');

	function spawn(x, y) {

		var theta, radius;

		for(var i = 0; i < CONFIG.NUM_BRANCHES; i++) {
			theta  = Math.random() * TWO_PI;
			radius = CONFIG.MAX_RADIUS;
			BRANCHES.push(new Branch(x, y, theta, radius));
		}
	}

	function update() {

		requestAnimFrame(update);

		var i, n, branch;

		for(i = 0, n = BRANCHES.length; i < n; i++) {
			branch = BRANCHES[i];
			branch.update();
			branch.render(context);
		}

		// Strip dead branches
		for(i = BRANCHES.length - 1; i >= 0; i--) {
			if(!BRANCHES[i].growing) {
				BRANCHES.splice(i,1);
			}
		}

		var count = BRANCHES.length.toString();
		while(count.length < 3) { count = '0' + count; }
		$branchCount.text('Branch count: ' + count);
	}

	function onClick(e) {

		Recursion.reset();
		spawn(e.offsetX, e.offsetY);
	}

	function onResize(e) {

		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;

		Recursion.reset();
		spawn(window.innerWidth / 2, window.innerHeight / 2);
	}

	return {

		init: function() {

			onResize();

			if(!started) {
				started = true;
				$(window).resize(onResize);
				$canvas.click(onClick);
				update();
			}
		},

		reset: function() {

			for(var i = 0, n = BRANCHES.length; i < n; i++) {
				BRANCHES[i].destroy();
			}

			BRANCHES = [];
		},

		save: function() {
			
			var image = canvas.toDataURL('image/png');

			var win = window.open('about:blank', '_blank', 'width=1000,height=700');

			var html = $('<html>');
			var head = $('<head>');
			var body = $('<body>');

			body.css({
				background: '#f2f2f2',
				padding: 0,
				margin: 0
			});

			head.append($('<title>Recursion &raquo Right Click &amp; Save the Image Below</title>'));
			body.append($('<img src="' + image + '"/>'));

			html.append(head);
			html.append(body);

			win.document.write('<!DOCTYPE html>' + html.html());
			win.document.close();
		},

		clear: function() {
			canvas.width = canvas.width;
		}
	};
}

/**
 * --------------------
 * GUI
 * --------------------
 */

function saveConfig() {
	var config = [];
	for(var i in CONFIG) { config.push(i + ':' + CONFIG[i]); }
	console.log("PRESETS['__name__'] = {" + config.join(',') + "};");
}

// Build preset map for GUI
var preset = {key:''}, keys = {};
for(var i in PRESETS) { keys[i] = i; }

var GUI = new DAT.GUI({
	width: 320
});

GUI.name('Recursion Settings');

// Config
GUI.add(CONFIG, 'NUM_BRANCHES').name('Trunk Count').min(1).max(20).step(1);
GUI.add(CONFIG, 'MAX_CONCURRENT').name('Max Concurrent').min(10).max(1000).step(1);
GUI.add(CONFIG, 'BRANCH_PROBABILITY').name('Branch Probability').min(0.01).max(1.0).step(0.01);
GUI.add(CONFIG, 'MIN_RADIUS').name('Radius (Min)').min(0.1).max(50);
GUI.add(CONFIG, 'MAX_RADIUS').name('Radius (Max)').min(0.1).max(50);
GUI.add(CONFIG, 'MIN_WANDER_STEP').name('Wander (Min)').min(0.0).max(PI).step(0.01);
GUI.add(CONFIG, 'MAX_WANDER_STEP').name('Wander (Max)').min(0.0).max(PI).step(0.01);
GUI.add(CONFIG, 'MIN_GROWTH_RATE').name('Growth (Min)').min(0.1).max(20).step(0.1);
GUI.add(CONFIG, 'MAX_GROWTH_RATE').name('Growth (Max)').min(0.1).max(20).step(0.1);
GUI.add(CONFIG, 'MIN_SHRINK_RATE').name('Shrink (Min)').min(0.9).max(0.999).step(0.005);
GUI.add(CONFIG, 'MAX_SHRINK_RATE').name('Shrink (Max)').min(0.9).max(0.999).step(0.005);
GUI.add(CONFIG, 'MIN_DIVERGENCE').name('Divergeence (Min)').min(0.0).max(PI).step(0.01);
GUI.add(CONFIG, 'MAX_DIVERGENCE').name('Divergeence (Max)').min(0.0).max(PI).step(0.01);
GUI.add(CONFIG, 'RENDER_MODE').name('Render Mode').options(RENDER_MODES).onChange(Recursion.init);

// Extra
GUI.add(preset, 'key').name('Configuration').options(keys).onChange(function(){
	configure(PRESETS[preset.key]);
	Recursion.init();
	GUI.listenAll();
});
GUI.add(Recursion, 'init').name('Restart Simulation');
GUI.add(Recursion, 'save').name('Save Image');
GUI.add(this, 'saveConfig').name('Save Settings');

/**
 * --------------------
 * INIT
 * --------------------
 */

Recursion.init();
