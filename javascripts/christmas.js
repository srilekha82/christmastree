var canvas, context, lights = [], starCentre;
var src = 'images/notlit.png';
var twinkle, audio, litLights = 0, decorations = 0, done = false, load = false;;
var oldradius, oldtheta;

function initialize () {
  canvas = document.getElementById('christmas');
  context = canvas.getContext('2d');

  starCentre = drawStar(220, 100, 15, 5);

  drawSector(starCentre.x, starCentre.y+10);
  drawLights(starCentre.x, starCentre.y);

  drawTrunk(starCentre.x-20, starCentre.y+360);
    drawGifts();
    document.getElementById('startDonate').onclick = function(){
    twinkle = setInterval(animate, 500);
    audio =  new Audio('assets/christmasjingle.mp3');
      audio.play();
  };

  document.getElementById('endDonate').onclick = function(){
      audio.pause();
    clearInterval(twinkle);
    //litLights - value from server
    if (typeof(Storage) !== "undefined") {
         litLights = parseInt(localStorage.getItem("numberOfLitLights"));
     decorations = parseInt(localStorage.getItem("numberOfGifts"));
    }
    if(isNaN(litLights))
      litLights = 0;
    if(isNaN(decorations))
      decorations = 0;
    var img = new Image();
    img.onload = function(){
       for (var i=0; i< litLights; i++){
         context.drawImage(img, lights[i].x, lights[i].y);
       }
       if(litLights < 37)
         context.drawImage(img, lights[i].x, lights[i].y);
       if(litLights > 5){
      generateRandomGifts();   
      decorations++;
      localStorage.setItem("numberOfGifts", decorations);
       }
    }
    img.src = "images/lit.png";
    var img1 = new Image();
    img1.onload = function(){
       for (var i=litLights; i< lights.length; i++){
         context.drawImage(img1, lights[i].x, lights[i].y);
       }
     
    }
    img1.src = "images/notlit.png";
    if(litLights < 37)
    litLights++;
      localStorage.setItem("numberOfLitLights", litLights);
    
  };
}

function drawStar(cx, cy, outerRadius, innerRadius) {
  var rot = Math.PI / 2 * 3;
  var x = cx;
  var y = cy;
  var step = Math.PI / 5;
  context.beginPath();
  var stx, sty; 
  context.moveTo(cx, cy - outerRadius)
  for (i = 0; i < 5; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    context.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    context.lineTo(x, y);
    if(i == 2){
      stx=x;sty=y;
    }
          rot += step;
  }
  context.lineTo(cx, cy - outerRadius);
  context.closePath();
  context.lineWidth=5;
  context.strokeStyle='black';
  context.stroke();
  context.fillStyle='yellow';
  context.fill();
  return {x:stx,y:sty};
}

function drawSector(cx,cy){
  var radius = 250, startAngle = 0.3, endAngle = 0.7;

  for (i=0; i<3; i++){
    
    context.beginPath();
    context.moveTo(cx,cy);
    context.arc(cx,cy,radius,startAngle*Math.PI,endAngle*Math.PI);
    context.lineTo(cx,cy);
    context.closePath();
    context.strokeStyle='green';
    context.stroke();
    context.fillStyle='green';

    context.shadowColor = '#999';
    
      context.shadowOffsetX = 0;
    context.shadowOffsetY = 15  ; 
 //context.shadowBlur = 20;
    context.fill();
    radius = radius + 50;
    startAngle = startAngle +  0.05;
    endAngle = endAngle - 0.05;
  }


}
 
function drawLights(cx,cy){
  var totalLights = 37;
  litLights = parseInt(localStorage.getItem("numberOfLitLights"));
  var lightsRenderArray = [
  {length : 3, radius : 50, theta : 0.28, increase : 0.15},
  {length : 6, radius : 100, theta : 0.3, increase : 0.07},
  {length : 8, radius : 150, theta : 0.3, increase : 0.05},
  {length : 8, radius : 200, theta : 0.3, increase : 0.05},
  {length : 7, radius : 250, theta : 0.3, increase : 0.05},
  {length : 5, radius : 300, theta : 0.35, increase : 0.055}];
  var litLightRender = [];
  
  if(!isNaN(litLights)){
     for(i = 0; i < 6; i++){
       if (litLights >= lightsRenderArray[i].length)
       {
        litLightRender[i] = {length : lightsRenderArray[i].length, 
          radius : lightsRenderArray[i].radius,
          theta : lightsRenderArray[i].theta, increase : lightsRenderArray[i].increase};
        litLights = litLights - lightsRenderArray[i].length;
        lightsRenderArray[i].length = 0;
      } else
      {
        litLightRender[i] = {length : litLights, 
          radius : lightsRenderArray[i].radius, 
          theta : lightsRenderArray[i].theta, increase : lightsRenderArray[i].increase};
        lightsRenderArray[i].length = lightsRenderArray[i].length - litLights;
        lightsRenderArray[i].theta = lightsRenderArray[i].theta + litLights*lightsRenderArray[i].increase;
        break;
       }
      }
  
  }
  var img = new Image();
  img.onload = function(){
     load = true;
     placenonLitLights(lightsRenderArray, img);
  }
  img.src="images/notlit.png";
  
  var img1 = new Image();
  img1.onload = function(){
     for (j=0; j< litLightRender.length; j++){
          placeLightsOnTree(litLightRender[j].length, litLightRender[j].radius, litLightRender[j].theta,
             litLightRender[j].increase, img1);
     }
     done = true;
     placenonLitLights(lightsRenderArray, img);
  }
  img1.src="images/lit.png";
    
}
function placenonLitLights(lightsRenderArray, img){
    if(done && load){
      for (j=0; j< 6; j++){
         if(lightsRenderArray[j].length > 0)
           placeLightsOnTree(lightsRenderArray[j].length, lightsRenderArray[j].radius, lightsRenderArray[j].theta,
             lightsRenderArray[j].increase, img);
      }
  }
}

function placeLightsOnTree(numberOfLights, radius, theta, thetaIncrement, img){
    for(i = 0; i < numberOfLights; i++)
  {
      x = radius*Math.cos(theta*Math.PI)+starCentre.x-20;
    y = radius *Math.sin(theta*Math.PI) + starCentre.y;
    addToLights(x,y);
    //context.shadowColor  = rgba(0,0,0,0); 
   context.shadowOffsetX = 0;
    context.shadowOffsetY = 0   ;
    context.drawImage(img,x, y);  
      theta = theta + thetaIncrement;
  }
}
function addToLights(x,y){
  var lightInfo = {};
  lightInfo.x = x;
  lightInfo.y = y;
  lights.push(lightInfo);
  return lights;

}

function drawTrunk(cx, cy){
  context.fillStyle='brown';
  context.fillRect(cx, cy, 40, 50);
}

  function animate(){
   src = src === 'images/lit.png' ? 'images/notlit.png' : 'images/lit.png';
   var img = new Image();
   img.onload = function(){
      for (var i=0; i< lights.length; i++){
       context.drawImage(img, lights[i].x, lights[i].y);
      }
    
   }
   img.src= src;
}

  function generateRandomGifts(){
  var sectorNumber = getRandomNumber(1,4);
  var giftCoord = getXYCoordinates(sectorNumber);
  if (sectorNumber < 4){
     
    drawGift(getRandomNumber(1,6), giftCoord);
    }
    else {
        drawGift(getRandomNumber(7,9), giftCoord);  
    }
    
}
  function drawGift(x, xyCoord){
  switch(x){
    case 1:
      var img = new Image();
    img.onload = function(){
      context.drawImage(img, xyCoord.x, xyCoord.y);
    }
      img.src = "images/star.png";
    break;
  case 2:
  var img = new Image();
    img.onload = function(){
      console.log(xyCoord.x, xyCoord.y);
      context.drawImage(img, xyCoord.x, xyCoord.y);
    }
      img.src = "images/sock.png";

      break;
  case 3:
  var img = new Image();
    img.onload = function(){
      context.drawImage(img, xyCoord.x, xyCoord.y);
    }
      img.src = "images/candy.png";

     break;
  case 4:
  var img = new Image();
    img.onload = function(){
      context.drawImage(img, xyCoord.x, xyCoord.y);
    }
      img.src = "images/bell.png";

    break;
  case 5:
         var img = new Image();
     img.onload = function(){
      context.drawImage(img, xyCoord.x, xyCoord.y);
     }
     img.src = "images/redball.png";
  
  break;
   case 6:
      var img = new Image();
    img.onload = function(){
      context.drawImage(img, xyCoord.x, xyCoord.y);
    }
      img.src = "images/goldenball.png";

     break;
     case 7:
     var img = new Image();
    img.onload = function(){
      context.drawImage(img, xyCoord.x, xyCoord.y);
    }
      img.src = "images/hamper.png";
      break;
      case 8:
     var img = new Image();
    img.onload = function(){
      context.drawImage(img, xyCoord.x, xyCoord.y);
    }
    img.src = "images/hamper1.png";
    break;
      
   case 9:
     var img = new Image();
    img.onload = function(){
      context.drawImage(img, xyCoord.x, xyCoord.y);
    }
      img.src = "images/hamper2.png";

      break;
  
  
  }
}
  function getRandomNumber(min, max, decimal){
  if (decimal){
    return Math.random() * (max - min) + min;
  } else {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
function getXYCoordinates(x){

    switch (x){
      
      case 1:
    var radius = getRandomNumber(starCentre.y+10, starCentre.y+250) - (starCentre.y+10);

    return getXYLimits(radius,getRandomNumber(0.35,0.65, true));
    case 2:
     var radius = getRandomNumber(starCentre.y+10, starCentre.y+310) - (starCentre.y+10);
     return getXYLimits(radius, getRandomNumber(0.35,0.65, true) );
    break;
    case 3:
    var radius = getRandomNumber(starCentre.y+10, starCentre.y+360) - (starCentre.y+10);
    return getXYLimits(radius, getRandomNumber(0.35, 0.65, true));
    break;
    case 4:
    var xyCoord = {};
    xyCoord.x = getRandomNumber(starCentre.x-60, starCentre.x+60);
    xyCoord.y = getRandomNumber(starCentre.y+360, starCentre.y +410);
    return xyCoord;
    break;
    
  }
  function getXYLimits(r, theta){
      var xyCoord = {};
      if (oldradius == r ){
        if(r < 350)
           r = r+ 10;
         else 
           r = r - 10;
      }
         

       if (oldtheta == theta){
          if (theta < 0.64)
            theta = theta + 0.02;
           else 
             theta = theta - 0.02;
       }
       olradius = r;
       oldtheta = theta;
    xyCoord.x = r*Math.cos(theta*Math.PI)+starCentre.x-20;
    xyCoord.y = r*Math.sin(theta*Math.PI) +starCentre.y+10;
    return xyCoord;
  }
}

function drawGifts(){
  decorations = parseInt(localStorage.getItem("numberOfGifts"));
  if(!isNaN(decorations)){
    for(i=0; i<decorations; i++)
     generateRandomGifts();
  }
  
}

initialize ();
