
/**
 * --------------------
 * SETTINGS
 * --------------------
 */

var CONFIG  = {};
var PRESETS = {};

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

PRESETS['Roots'] = {BRANCH_PROBABILITY:0.05,MAX_CONCURRENT:800,NUM_BRANCHES:3,MIN_RADIUS:0.1,MAX_RADIUS:50,MIN_WANDER_STEP:0.28,MAX_WANDER_STEP:0.7000000000000001,MIN_GROWTH_RATE:5,MAX_GROWTH_RATE:9,MIN_SHRINK_RATE:0.98,MAX_SHRINK_RATE:0.99,MIN_DIVERGENCE:0.01,MAX_DIVERGENCE:0.05};
PRESETS['Long'] = {BRANCH_PROBABILITY:1,MAX_CONCURRENT:350,NUM_BRANCHES:3,MIN_RADIUS:0.1,MAX_RADIUS:50,MIN_WANDER_STEP:0.1,MAX_WANDER_STEP:0.72,MIN_GROWTH_RATE:0.9,MAX_GROWTH_RATE:6.15,MIN_SHRINK_RATE:0.935,MAX_SHRINK_RATE:0.999,MIN_DIVERGENCE:0.01,MAX_DIVERGENCE:0.05};

function configure(settings) {
	for(var prop in settings) {
		CONFIG[prop] = settings[prop];
	}
}

configure(PRESETS['Default']);

/**
 * --------------------
 * UTILS
 * --------------------
 */

var PI           = Math.PI;
var TWO_PI       = Math.PI * 2;
var BRANCHES     = [];

function random(min, max) {
	return min + Math.random() * (max - min);
}

/**
 * --------------------
 * BRANCH
 * --------------------
 */

var Branch = function(x, y, theta, radius, scale) {

	this.x       = x;
	this.y       = y;
	this.ox      = x;
	this.oy      = y;
	this.scale   = scale || 1.0;
	this.theta   = theta;
	this.radius  = radius;
	this.growing = true;

	this.wanderStep  = random(CONFIG.MIN_WANDER_STEP, CONFIG.MAX_WANDER_STEP);
	this.growthRate  = random(CONFIG.MIN_GROWTH_RATE, CONFIG.MAX_GROWTH_RATE);
	this.shrinkRate  = random(CONFIG.MIN_SHRINK_RATE, CONFIG.MAX_SHRINK_RATE);

	this.children = [];
}

Branch.prototype = {

	update: function() {

		if(this.growing) {
			
			this.ox = this.x;
			this.oy = this.y;

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

				BRANCHES.push(branch);
			}

			// Limit
			if(this.radius * this.scale <= CONFIG.MIN_RADIUS) {
				this.growing = false;
			}
		}
	},

	render: function(context) {

		if(this.growing) {

			var radius = this.radius * this.scale;

			context.save();
			
			// Draw outline
			context.beginPath();
			context.moveTo(this.ox, this.oy);
			context.lineTo(this.x, this.y);
			
			if(radius > 5.0) {
				context.shadowOffsetX = 2;
				context.shadowOffsetY = 2;
				context.shadowBlur    = 2 * this.scale;
				context.shadowColor   = 'rgba(0,0,0,0.05)';	
			}
			
			context.lineWidth = radius + this.scale;
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

	var started  = false;
	var $canvas  = $('#canvas');
	var canvas   = $canvas[0];
	var context  = canvas.getContext('2d');

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
	console.log('{' + config.join(',') + '}');
}

// Build preset map for GUI
var preset = {key:''}, keys = {};
for(var i in PRESETS) { keys[i] = i; }

var GUI = new DAT.GUI({
	width: 320
});

GUI.name('Settings');

// Config
GUI.add(CONFIG, 'NUM_BRANCHES').name('Branch Count').min(1).max(20).step(1);
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

// Extra
GUI.add(preset, 'key').name('Configuration').options(keys).onChange(function(){
	configure(PRESETS[preset.key]);
	Recursion.init();
	GUI.listenAll();
});
GUI.add(Recursion, 'init').name('Restart Simulation');
GUI.add(this, 'saveConfig').name('Save Settings');

console.log(GUI.constrain);

/**
 * --------------------
 * INIT
 * --------------------
 */

Recursion.init();
