var gameOptions = {
	height: 600,
	width: 800
};

var game = new Kiwi.Game(null, "Random", null, gameOptions);

var choiceState = new Kiwi.State("choiceState");
var N = 20;

choiceState.preload = function(){
	Kiwi.State.prototype.preload.call( this );
	
	this.addImage("cell", "cell.png");
	this.addImage('background', 'background.png');
	this.addImage('graphBack', 'graphBack.png');
	this.addImage('greenButton', 'greenButton.png');
	this.addImage('redButton', 'redButton.png');
};

choiceState.create = function(){
	Kiwi.State.prototype.create.call( this );
	
	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['background'], 0, 0);
	
	this.greenButton = new Kiwi.GameObjects.StaticImage(this, this.textures['greenButton'], 625, 300);
	this.redButton = new Kiwi.GameObjects.StaticImage(this, this.textures['redButton'], 625, 400);
	this.redButton2 = new Kiwi.GameObjects.StaticImage(this, this.textures['redButton'], 625, 500);
	
	this.greenText = new Kiwi.GameObjects.TextField(this, "Set of 20", 640, 320, "#FFFFFF", 30);
	this.redText = new Kiwi.GameObjects.TextField(this, "Set of X", 645, 420, "#FFFFFF", 30);
	this.redText2 = new Kiwi.GameObjects.TextField(this, "Plot random points", 627, 530, "#FFFFFF", 18);
	
	this.mouse = this.game.input;	
	this.cells = new Kiwi.Group(this);
	this.graphGroup = new Kiwi.Group(this);
	
	this.clicks = 0;
	this.L2 = 0;
	this.status = 0;
	this.sent = false;
	
	this.clickBox = new Kiwi.GameObjects.TextField(this, this.clicks + "/" + N, 665, 20, "#000000", 30);
	this.discrepBox = new Kiwi.GameObjects.TextField(this, "Discrepancy", 635, 100, "#000000", 25);
	this.scoreBox = new Kiwi.GameObjects.TextField(this, "", 660, 130, "#000000", 25);
	
	this.addChild(this.background);
	
	this.addChild(this.greenButton);
	this.addChild(this.redButton);
	this.addChild(this.redButton2);
	this.addChild(this.greenText);
	this.addChild(this.redText);
	this.addChild(this.redText2);
	
	this.addChild(this.cells);
	this.addChild(this.graphGroup);
	
	this.addChild(this.scoreBox);
	this.addChild(this.discrepBox);
	this.addChild(this.clickBox);
};

choiceState.drawCell = function(x,y){
	var cellSize = 5;
	var xCell = Math.floor(x/cellSize);
	var yCell = Math.floor(y/cellSize);
	
	var cell = new Cell(this,xCell*cellSize,yCell*cellSize);
	
	this.cells.addChild(cell);
};

choiceState.calcL2 = function(clicks){
	var points = [];
	
	for (var i=0; i<clicks; i++){
		points.push([this.cells.members[i].x/gameOptions.height, this.cells.members[i].y/gameOptions.height]);
	};
	
	/* //Random points
	for (var i=0; i<N; i++){
		points.push([Math.random(), Math.random()]);
	}; */
	
	
	var part1 = 0;
	for (var i=0; i<clicks; i++){
		for (var j=0; j<clicks; j++){
			part1 += (1 - Math.max(points[i][0], points[j][0])) * (1 - Math.max(points[i][1], points[j][1]));
		};
	};
	part1 = part1/Math.pow(clicks,2);
	
	var part2 = 0;
	for (var i=0; i<clicks; i++){
		part2 += (1 - Math.pow(points[i][0],2)) * (1 - Math.pow(points[i][1],2));
	};
	part2 = part2*2/(4*clicks);
	
	this.L2 = part1 - part2 + Math.pow((1/3),2);
	console.log("L2*: " + this.L2);
};

choiceState.calcRandom = function(sets,n){
	var points = [];
	
	//Random points
	for (var j=0; j<sets; j++){
		points.push([]);
		
		for (var i=0; i<n; i++){
			points[j].push([Math.random(), Math.random()]);
		};
	};
	
	var L2 = [];
	for (var k=0; k<sets; k++){
		var part1 = 0;
		for (var i=0; i<n; i++){
			for (var j=0; j<n; j++){
				part1 += (1 - Math.max(points[k][i][0], points[k][j][0])) * (1 - Math.max(points[k][i][1], points[k][j][1]));
			};
		};
		part1 = part1/Math.pow(n,2);
		
		var part2 = 0;
		for (var i=0; i<n; i++){
			part2 += (1 - Math.pow(points[k][i][0],2)) * (1 - Math.pow(points[k][i][1],2));
		};
		part2 = part2*2/(4*n);
		
		
		var result = part1 - part2 + Math.pow((1/3),2);
		L2.push(result);
	};
	
	var bins = 200;
	var binMin = 0.;
	var binMax = 0.1;
	var bin = [];
	for (var i=0; i<bins; i++){
		bin.push(0);
	};
	

	var avgL2 = 0;
	for (var i=0; i<sets; i++){
		avgL2 += L2[i]

		for (var j=bins-1; j>=0; j--){
			if (L2[i] > (j*(binMax-binMin)/bins)){
				bin[j]++ ;
				break;
			};
		};
	};
	
	avgL2 = avgL2/sets;
	
	return {avg:avgL2, bin: bin, sets: sets, n:n, binMin:binMin, binMax: binMax};
};

choiceState.plotData = function(data) {
	L2 = data.replace( /\n/g, " " ).split( " " );
	L2.splice(L2.length - 1, 1);
	
	var bins = 200;
	var binMin = 0.;
	var binMax = 0.1;
	var bin = [];
	for (var i=0; i<bins; i++){
		bin.push(0);
	};
	

	var avgL2 = 0.;
	for (var i=0; i<L2.length; i++){
		avgL2 += Number(L2[i])

		for (var j=bins-1; j>=0; j--){
			if (L2[i] > (j*(binMax-binMin)/bins)){
				bin[j]++ ;
				break;
			};
		};
	};

	avgL2 = avgL2/L2.length;

	this.displayGraph({avg:avgL2, bin: bin, sets: L2.length, n:20, binMin:binMin, binMax: binMax});	
};

choiceState.getDiscr = function(){
	var ajaxRequest;
	
	try{
		// Opera 8.0+, Firefox, Safari
		ajaxRequest = new XMLHttpRequest();
	} catch (e){
		// Internet Explorer Browsers
		try{
			ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try{
				ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e){
				// Something went wrong
				alert("Your browser broke!");
				return false;
			}
		}
	}
	
	ajaxRequest.onreadystatechange = function(){
		if(ajaxRequest.readyState == 4){
			choiceState.plotData(JSON.parse(ajaxRequest.responseText));
		}
	}
	
	ajaxRequest.open("GET", "http://www.carmencas.nl/montecarlo/getDiscr.php", true)
	ajaxRequest.send();
};	


choiceState.reset = function() {
	var graph = this.graphGroup.members;
	for (var i=0; i<graph.length; i++){
		graph[i].destroy();
	};
			
	var cells = this.cells.members;
	for (var i=0; i<cells.length; i++){
		cells[i].destroy();
	};
	
	this.clicks = 0;
	this.sent = false;

	if (this.status == 0) {
		this.greenButton.y = 300;
		this.redButton.y = 400;
		this.redButton2.y = 500;
	}
	else if (this.status == 1) {
		this.greenButton.y = 400;
		this.redButton.y = 300;
		this.redButton2.y = 500;		
	}
	else {
		this.greenButton.y = 500;
		this.redButton.y = 300;
		this.redButton2.y = 400;		
	};
};

choiceState.uploadL2 = function(){
	var params = {data:this.L2};
	
	$.ajax({
		type: 'POST',
		url: "http://www.carmencas.nl/montecarlo/saveL2.php",
		data: {data:params},
		success: function (response)
		{
			regionalLoaded = true;
			console.log("Discrepancy added")
		}
	});
};

choiceState.displayGraph = function(random){
	var bin = random.bin;
	console.log(bin);
	var n = bin.length;
	
	var highest = 0;
	var displayMax = 0;
	var displayMin = 0;
	for (var i=0; i<bin.length; i++){
		if (bin[i]>highest){
			highest = bin[i];
		};
		if (bin[i]){
			displayMax = i+1;
		};
	};
	
	this.graphBack = new Kiwi.GameObjects.StaticImage(this, this.textures['graphBack'], 30, 25);
	this.graphGroup.addChild(this.graphBack);
	
	var width = 540/(displayMax-displayMin) - 1;
	for (var i=displayMin; i<displayMax; i++){
		var height = bin[i] * 500/highest;
		this.graphGroup.addChild(new Bar(this, 30 + i*(width+1), 525 - height/2, width, height));
	};
	
	this.avgText = new Kiwi.GameObjects.TextField(this,      "Avg discrepancy: " + random.avg.toFixed(5), 330, 50, "#000000", 18);
	this.totalSets = new Kiwi.GameObjects.TextField(this,    "Total sets: " + random.sets, 330, 70, "#000000", 18);
	this.pointsPerSet = new Kiwi.GameObjects.TextField(this, "Points per set: " + random.n, 330, 90, "#000000", 18);
	
	this.minX = new Kiwi.GameObjects.TextField(this, displayMin, 28, 530, "#000000", 12);
	this.maxX = new Kiwi.GameObjects.TextField(this, (random.binMax * displayMax/n).toFixed(4), 552, 530, "#000000", 12);
	this.minY = new Kiwi.GameObjects.TextField(this, 0, 18, 520, "#000000", 12);
	this.maxY = new Kiwi.GameObjects.TextField(this, highest, 7, 20, "#000000", 12);
	this.xLabel = new Kiwi.GameObjects.TextField(this, "Discrepancy", 250, 540, "#000000", 18);
	this.yLabel = new Kiwi.GameObjects.TextField(this, "N", 10, 230, "#000000", 18);
	
	this.graphGroup.addChild(this.avgText);
	this.graphGroup.addChild(this.totalSets);
	this.graphGroup.addChild(this.pointsPerSet);
	this.graphGroup.addChild(this.minX);
	this.graphGroup.addChild(this.maxX);
	this.graphGroup.addChild(this.minY);
	this.graphGroup.addChild(this.maxY);
	this.graphGroup.addChild(this.xLabel);
	this.graphGroup.addChild(this.yLabel);
};
	
choiceState.update = function(){
	Kiwi.State.prototype.update.call( this );
	
	if ((this.mouse.isDown) && (this.mouse.x<600)){
		if (this.status == 1){
			this.drawCell(this.mouse.x, this.mouse.y);
			this.clicks++;
			this.calcL2(this.clicks);
			this.scoreBox.text = this.L2.toFixed(5);
		}
		else if (this.status == 0){
			if(this.clicks < N){
				this.drawCell(this.mouse.x, this.mouse.y);
			
				this.clicks++;
			}
			if(this.clicks === N){
				this.calcL2(N);
				this.scoreBox.text = this.L2.toFixed(5);
				if (!this.sent) {
					this.uploadL2();
				};
				this.sent = true;
			}
		};
		//this.game.input.mouse.reset();
	}
	else if ((this.mouse.isDown) && (this.mouse.x > 600)){
		
		//this.game.input.mouse.reset();
		
		if ((this.mouse.x > 625)&& (this.mouse.x < 775) && (this.mouse.y > 500) && (this.mouse.y < 575)){
			this.status = 2;
			this.reset();
			
			this.getDiscr();
		}
		else if ((this.mouse.x > 625)&& (this.mouse.x < 775) && (this.mouse.y > 400) && (this.mouse.y < 475)){
			this.status = 1;
			this.reset();			
		}		
		else if ((this.mouse.x > 625)&& (this.mouse.x < 775) && (this.mouse.y > 300) && (this.mouse.y < 375)){
			this.status = 0;
			this.reset();			
		};
		
	};
	
	if(this.clicks > 9){
		if (this.status == 1){
			this.clickBox.text = this.clicks + "/" + "inf";			
		}
		else if (this.status == 0){
			this.clickBox.text = this.clicks + "/" + N;
		};
	}
	else {
		if (this.status == 1){
			this.clickBox.text = "0" + this.clicks + "/" + "inf";			
		}
		else if (this.status == 0){
			this.clickBox.text = "0" + this.clicks + "/" + N;
		};
	};
};

var Cell = function(state, x, y){
    Kiwi.GameObjects.StaticImage.call(this, state, state.textures['cell'], x, y, false);
	this.x = x;
	this.y = y;
};
Kiwi.extend(Cell,Kiwi.GameObjects.Sprite);

var Bar = function(state, x, y, width, height){
    Kiwi.GameObjects.StaticImage.call(this, state, state.textures['cell'], x, y, false);
	this.x = x;
	this.y = y;
	this.transform.scaleX = width/5;
	this.transform.scaleY = height/5;
};
Kiwi.extend(Bar,Kiwi.GameObjects.Sprite);

game.states.addState(choiceState);
game.states.switchState("choiceState");