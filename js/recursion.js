
/**
 * Copyright (C) 2011 by Justin Windle
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * --------------------
 * SETTINGS
 * --------------------
 */

var CONFIG  = {};
var PRESETS = {};
var RENDER_MODES = {
	Darkness:  'darkness',
	Segmented: 'segmented',
	Sketched:  'sketched'
};

PRESETS['Vines']          = {RENDER_MODE:RENDER_MODES.Darkness,BRANCH_PROBABILITY:0.2572,MAX_CONCURRENT:388,NUM_BRANCHES:4,MIN_RADIUS:0.1,MAX_RADIUS:69,MIN_WANDER_STEP:1.0184,MAX_WANDER_STEP:0.1702,MIN_GROWTH_RATE:10.6214,MAX_GROWTH_RATE:11.8251,MIN_SHRINK_RATE:0.99656,MAX_SHRINK_RATE:0.91265,MIN_DIVERGENCE:0.5101,MAX_DIVERGENCE:0.37466};
PRESETS['Fibrous']        = {RENDER_MODE:RENDER_MODES.Segmented,BRANCH_PROBABILITY:0.05,MAX_CONCURRENT:800,NUM_BRANCHES:3,MIN_RADIUS:0.1,MAX_RADIUS:50,MIN_WANDER_STEP:0.28,MAX_WANDER_STEP:0.7,MIN_GROWTH_RATE:5,MAX_GROWTH_RATE:9,MIN_SHRINK_RATE:0.98,MAX_SHRINK_RATE:0.99,MIN_DIVERGENCE:0.01,MAX_DIVERGENCE:0.05};
PRESETS['Graffiti']       = {RENDER_MODE:RENDER_MODES.Sketched,BRANCH_PROBABILITY:0.05,MAX_CONCURRENT:500,NUM_BRANCHES:6,MIN_RADIUS:0.15,MAX_RADIUS:70,MIN_WANDER_STEP:0.1197,MAX_WANDER_STEP:1.8269,MIN_GROWTH_RATE:13.66,MAX_GROWTH_RATE:17.35,MIN_SHRINK_RATE:0.95,MAX_SHRINK_RATE:0.98,MIN_DIVERGENCE:1.3268,MAX_DIVERGENCE:1.3885};
PRESETS['Knarled']        = {RENDER_MODE:RENDER_MODES.Darkness,BRANCH_PROBABILITY:0.09,MAX_CONCURRENT:500,NUM_BRANCHES:5,MIN_RADIUS:0.1,MAX_RADIUS:100,MIN_WANDER_STEP:0.1,MAX_WANDER_STEP:0.2,MIN_GROWTH_RATE:3.7,MAX_GROWTH_RATE:10,MIN_SHRINK_RATE:0.97,MAX_SHRINK_RATE:0.99,MIN_DIVERGENCE:0.01,MAX_DIVERGENCE:0.05};
PRESETS['Beech Tree']     = {RENDER_MODE:RENDER_MODES.Darkness,BRANCH_PROBABILITY:0.085,MAX_CONCURRENT:500,NUM_BRANCHES:1,MIN_RADIUS:0.1,MAX_RADIUS:40,MIN_WANDER_STEP:0.1599,MAX_WANDER_STEP:0.4,MIN_GROWTH_RATE:8,MAX_GROWTH_RATE:15,MIN_SHRINK_RATE:0.98,MAX_SHRINK_RATE:0.982,MIN_DIVERGENCE:0.31,MAX_DIVERGENCE:0.87};
PRESETS['Frost']          = {RENDER_MODE:RENDER_MODES.Sketched,BRANCH_PROBABILITY:0.09,MAX_CONCURRENT:1000,NUM_BRANCHES:6,MIN_RADIUS:0.1,MAX_RADIUS:40,MIN_WANDER_STEP:0,MAX_WANDER_STEP:0,MIN_GROWTH_RATE:9.2,MAX_GROWTH_RATE:9.8,MIN_SHRINK_RATE:0.97,MAX_SHRINK_RATE:0.97,MIN_DIVERGENCE:0.4,MAX_DIVERGENCE:0.8};
PRESETS['Wooly']          = {RENDER_MODE:RENDER_MODES.Segmented,BRANCH_PROBABILITY:0.07,MAX_CONCURRENT:348,NUM_BRANCHES:9,MIN_RADIUS:1.5,MAX_RADIUS:99,MIN_WANDER_STEP:0.5093,MAX_WANDER_STEP:2.654,MIN_GROWTH_RATE:7.8279,MAX_GROWTH_RATE:18.2956,MIN_SHRINK_RATE:0.94489,MAX_SHRINK_RATE:0.98716,MIN_DIVERGENCE:1.4656,MAX_DIVERGENCE:2.6998};
PRESETS['Vegetable Root'] = {RENDER_MODE:RENDER_MODES.Darkness,BRANCH_PROBABILITY:0.06,MAX_CONCURRENT:437,NUM_BRANCHES:1,MIN_RADIUS:0.1,MAX_RADIUS:100,MIN_WANDER_STEP:0.05,MAX_WANDER_STEP:0.25,MIN_GROWTH_RATE:5,MAX_GROWTH_RATE:9,MIN_SHRINK_RATE:0.98,MAX_SHRINK_RATE:0.99,MIN_DIVERGENCE:0,MAX_DIVERGENCE:0.1};
PRESETS['Hairball']       = {RENDER_MODE:RENDER_MODES.Sketched,BRANCH_PROBABILITY:0.6,MAX_CONCURRENT:800,MAX_DIVERGENCE:2.1,MAX_GROWTH_RATE:4.5,MAX_RADIUS:30,MAX_SHRINK_RATE:0.992,MAX_WANDER_STEP:0.2,MIN_DIVERGENCE:2,MIN_GROWTH_RATE:3.5,MIN_RADIUS:0.5,MIN_SHRINK_RATE:0.992,MIN_WANDER_STEP:0.1,NUM_BRANCHES:7};
PRESETS['Intenstines']    = {RENDER_MODE:RENDER_MODES.Darkness,BRANCH_PROBABILITY:1,MAX_CONCURRENT:350,NUM_BRANCHES:3,MIN_RADIUS:0.1,MAX_RADIUS:100,MIN_WANDER_STEP:0.1,MAX_WANDER_STEP:0.72,MIN_GROWTH_RATE:0.9,MAX_GROWTH_RATE:6.15,MIN_SHRINK_RATE:0.935,MAX_SHRINK_RATE:0.999,MIN_DIVERGENCE:0.01,MAX_DIVERGENCE:0.05};

function configure(settings) {
	for(var prop in settings) {
		CONFIG[prop] = settings[prop];
	}
}

configure(PRESETS['Vines']);

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
						context.shadowOffsetX = 1;
						context.shadowOffsetY = 1;
						context.shadowBlur    = scale;
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

					radius *= 0.5;
					radius += 0.5;

					x1 = this.x + Math.cos(this.theta - HALF_PI) * radius;
					x2 = this.x + Math.cos(this.theta + HALF_PI) * radius;

					y1 = this.y + Math.sin(this.theta - HALF_PI) * radius;
					y2 = this.y + Math.sin(this.theta + HALF_PI) * radius;

					context.lineWidth = 0.5 + scale;
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

					radius *= 0.5;

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
			theta = (i / CONFIG.NUM_BRANCHES) * TWO_PI;
			radius = CONFIG.MAX_RADIUS;
			BRANCHES.push(new Branch(x, y, theta - HALF_PI, radius));
		}
	}

	function update() {

		//cancelRequestAnimFrame(update);
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

function randomise() {
	CONFIG.BRANCH_PROBABILITY  = random(0.01,1.0);
	CONFIG.MAX_CONCURRENT      = random(10,1000);
	CONFIG.NUM_BRANCHES        = random(1,20);
	CONFIG.MIN_RADIUS          = random(0.1,2.0);
	CONFIG.MAX_RADIUS          = random(CONFIG.MIN_RADIUS,100);
	CONFIG.MIN_WANDER_STEP     = random(0.1,PI);
	CONFIG.MAX_WANDER_STEP     = random(CONFIG.MIN_WANDER_STEP,PI);
	CONFIG.MIN_GROWTH_RATE     = random(0.1,20);
	CONFIG.MAX_GROWTH_RATE     = random(CONFIG.MIN_GROWTH_RATE,20);
	CONFIG.MIN_SHRINK_RATE     = random(0.9,0.999);
	CONFIG.MAX_SHRINK_RATE     = random(CONFIG.MIN_SHRINK_RATE,0.999);
	CONFIG.MIN_DIVERGENCE      = random(0.0,PI);
	CONFIG.MAX_DIVERGENCE      = random(CONFIG.MIN_DIVERGENCE,PI);
	Recursion.init();
	GUI.listenAll();
}

var GUI = new DAT.GUI({width: 340});
GUI.name('Recursion Settings');

// Config
GUI.add(CONFIG, 'NUM_BRANCHES').name('Trunk Count').min(1).max(20).step(1);
GUI.add(CONFIG, 'MAX_CONCURRENT').name('Max Concurrent').min(10).max(1000).step(1);
GUI.add(CONFIG, 'BRANCH_PROBABILITY').name('Branch Probability').min(0.01).max(1.0).step(0.01);
GUI.add(CONFIG, 'MIN_RADIUS').name('Radius (Min)').min(0.1).max(100);
GUI.add(CONFIG, 'MAX_RADIUS').name('Radius (Max)').min(0.1).max(100);
GUI.add(CONFIG, 'MIN_WANDER_STEP').name('Wander (Min)').min(0.0).max(PI).step(0.01);
GUI.add(CONFIG, 'MAX_WANDER_STEP').name('Wander (Max)').min(0.0).max(PI).step(0.01);
GUI.add(CONFIG, 'MIN_GROWTH_RATE').name('Growth (Min)').min(0.1).max(20).step(0.1);
GUI.add(CONFIG, 'MAX_GROWTH_RATE').name('Growth (Max)').min(0.1).max(20).step(0.1);
GUI.add(CONFIG, 'MIN_SHRINK_RATE').name('Shrink (Min)').min(0.9).max(0.999).step(0.005);
GUI.add(CONFIG, 'MAX_SHRINK_RATE').name('Shrink (Max)').min(0.9).max(0.999).step(0.005);
GUI.add(CONFIG, 'MIN_DIVERGENCE').name('Divergeence (Min)').min(0.0).max(PI).step(0.01);
GUI.add(CONFIG, 'MAX_DIVERGENCE').name('Divergeence (Max)').min(0.0).max(PI).step(0.01);

GUI.add(preset, 'key').name('Preset Behaviors').options(keys).onChange(function(){
	configure(PRESETS[preset.key]);
	Recursion.init();
	GUI.listenAll();
});
GUI.add(CONFIG, 'RENDER_MODE').name('Render Style').options(RENDER_MODES).onChange(Recursion.init);
GUI.add(Recursion, 'save').name('Save as PNG');
GUI.add(Recursion, 'clear').name('Clear').onFire(Recursion.reset);
GUI.add(Recursion, 'init').name('Clear & Regenerate');

//GUI.add(this, 'randomise').name('Randomise');
//GUI.add(this, 'saveConfig').name('Save Config');

/**
 * --------------------
 * INIT
 * --------------------
 */

Recursion.init();
