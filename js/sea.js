var width, height, center;
var points = 12;
var path = new Path();
var pathHeight;
var speeds = [];
var time = 0;
var tide = 'low';
var drag;
var wetSand, worryPath, surprise, text, textContent;
var surprises = ['img/seashell.png',
                 'img/starfish.png',
                 'img/stone.png',
                 'img/bottle.png',
                 'img/alga.png'];
tool.minDistance = 10;
path.fillColor = '#133468';
initializePath();

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function initializePath() {
  width = view.size.width;
	height = view.size.height;
	pathCenter = height * 15/16
  pathHeight = height * 7/8
  textContent = "";
	path.segments = [];
	path.add(view.bounds.bottomLeft);
  speeds.push(0)
	for (var i = 0; i < points-1; i++) {
		var point = new Point(width / (points - 2) * i, pathCenter);
		path.add(point);
    speeds.push(randomInt(0,10) / 2.0)
	}
	path.add(view.bounds.bottomRight);
  speeds.push(0)
}

function ebbSurprise(){
  wetSand = path.clone().insertBelow(path);
  wetSand.fillColor = '#c1b460';
  var randomPosition = new Point(randomInt(50, width - 50),
                                 randomInt(150, height - 150));
  surprise = new Raster({source:surprises[randomInt(0, surprises.length - 1)],
                         position: randomPosition}).insertAbove(wetSand);
  if (typeof worryPath !== 'undefined'){
    console.log("removing worrypath")
    worryPath.strokeColor = "blue";
    worryPath = null;
  }
  if(typeof text !== 'undefined'){
    text.remove()
  }
  textContent = "";
}

function cleanBeach(){
  wetSand.remove();
  surprise.remove();
  initializePath()
}

function onMouseDown(event) {
  drag = false;
  if (tide == 'low'){
    worryPath = new Path().insertBelow(path);
	  worryPath.strokeColor = '#c1b460';
    worryPath.strokeWidth = 10;
    worryPath.strokeCap = 'round';
  }
}

function onMouseDrag(event) {
  if (tide == 'low'){
    drag = true;
    worryPath.add(event.point);
  }
}

function onMouseUp(event){
  if (!drag){
    if(tide == 'low' && event.point.y >= pathHeight){
      hideInstructions();
      tide = 'flood';
    } else if (tide == 'ebb'){
      cleanBeach()
      showInstructions()
      tide = 'low'
    }
  }
}

function onKeyDown(event) {
	// When a key is pressed, set the content of the text item:
  if(event.key == "backspace"){
    textContent = textContent.substring(0, textContent.length - 1);
  } else{
    textContent += event.character;
  }
	text.content = textContent ;
}


function onFrame(event) {
  if (tide == 'flood'){
    pathCenter--;
    pathHeight--;
  }
  if (tide == 'ebb'){
    pathCenter++;
    pathHeight++;
  }
  time++
	for (var i = 1; i < points; i++) {
		var sinHeight = Math.sin(time* speeds[i]/100) * (pathHeight - pathCenter);
		var yPos = sinHeight + pathCenter
		path.segments[i].point.y = yPos;
    if(tide=='flood' && yPos <= 0){
      ebbSurprise()
      tide = 'ebb'
    }
	}
	path.smooth({ type: 'continuous' });
}

this.typeInit = function(){
  if (!textContent){
    text = new PointText({
    	point: view.center,
    	content: '...start typing...',
    	justification: 'center',
    	fontSize: 30,
      strokeColor: '#c1b460',
    }).insertBelow(path);
  }
}

this.typeCleanup = function(){
  if (typeof text !== 'undefined' && text.content == '...start typing...'){
    text.remove();
    textContent = "";
  }
}

paper.install(window.paperscript);
