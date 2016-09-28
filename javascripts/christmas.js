var canvas, context, lights = [], starCentre;
var src = 'images/notlit.png';
var twinkle, audio, litLights = 7, decorations = 0, done = false, load = false;;
var oldregion = 0, oldgift = 0;
var giftCoordArr = [{x: 131, y: 229 },{x: 142, y: 274},{x: 211, y: 268 },{x: 213, y:127 },{x:154, y: 372},{x: 246, y: 432 }
,{x:213, y: 440},{x: 120, y: 435 }];

function initialize () {
  canvas = document.getElementById('christmas');
  context = canvas.getContext('2d');

  starCentre = drawStar(220, 50, 15, 5);

  drawSector(starCentre.x, starCentre.y+10);
  litLights = parseInt(localStorage.getItem("numberOfLitLights"));
  if(isNaN(litLights) || litLights == 0)
      localStorage.setItem("numberOfLitLights",7);
  drawLights(starCentre.x, starCentre.y);

  drawTrunk(starCentre.x-20, starCentre.y+360);

  for (i=0;i<5; i++) {
    drawGift(getRandomNumber(1,6), giftCoordArr[i]);
  }
  for(i=5;i<8; i++) {
    drawGift(getRandomNumber(7,9), giftCoordArr[i]);
  }
  drawGifts();

  document.getElementById('startDonate').onclick = function() {
    twinkle = setInterval(animate, 500);
    audio =  new Audio('assets/christmasjingle.mp3');

    if (typeof audio.loop == 'boolean') {
      audio.loop = true;
    }
    else {
      audio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
      }, false);

      audio.addEventListener('paused', function() {
        this.currentTime = 0;
        this.play();
      }, false);
    }

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
    if(i == 2) {
      stx=x;sty=y;
    }
          rot += step;
  }
  context.lineTo(cx, cy - outerRadius);
  context.closePath();
  context.lineWidth=5;
  context.strokeStyle='#ffc821';
  context.stroke();
  context.fillStyle='yellow';
  context.fill();

  //context.shadowBlur = 10;
  //context.shadowColor = "black";

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
    context.strokeStyle='#396f40';
    context.stroke();

    var grd = context.createRadialGradient(238, 50, 10, 238, 50, 300);

    grd.addColorStop(0, '#069e19');
      // dark blue
    grd.addColorStop(1, '#396f40');

    // context.fillStyle='green';
    context.fillStyle = grd;
    context.fill();

    context.shadowColor = '#999';
    
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 5; 
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
  if(oldregion == sectorNumber){
    if(sectorNumber < 3)
      sectorNumber = sectorNumber + 2;
    else
      sectorNumber = sectorNumber - 2;
  }
  oldregion = sectorNumber;
  var giftCoord = getXYCoordinates(sectorNumber);
  //console.log(giftCoord.x,giftCoord.y);
  if (sectorNumber < 4){
     
    drawGift(getRandomNumber(1,6), giftCoord);
    }
    else {
        drawGift(getRandomNumber(7,9), giftCoord);  
    }
    
}
  function drawGift(x, xyCoord){
    if(oldgift == x){
      if(x == 2 )
        x = x+2;
       if(x == 4)
        x = x+2;
      
    }
    oldgift = x;
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

  switch (x) {
    
    case 1:
      var radius = getRandomNumber(starCentre.y+10, starCentre.y+260) - (starCentre.y+10);

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

// initialize ();

$('#startDonate').click(function () {
  $('#donationbody').hide( 'slow', function () {
    $('#donationForm').show();
  });
});

$('#endDonate').click(function() {
  $('#donationForm').hide('slow', function () {
    $('#thankYouForm').show( 400 );
  });
});
$('#donateAgain').click(function() {
  $('#thankYouForm').hide('slow', function () {
    $('#donationbody').show( 400 );
  });
});


// Draw image

canvas = document.getElementById("christmas");
var ctx = canvas.getContext("2d");
var image = document.getElementById("source");

ctx.drawImage(image, 0, -60, 470, 702, 0, 0, 401, 602);

var color = document.getElementById('color');
function pick(event) {
  var x = event.layerX;
  var y = event.layerY;
  var pixel = ctx.getImageData(x, y, 1, 1);
  var data = pixel.data;
  var rgba = 'rgba(' + data[0] + ',' + data[1] +
  ',' + data[2] + ',' + (data[3] / 255) + ')' + x + y;
  color.style.background =  rgba;
  color.textContent = rgba;
}
canvas.addEventListener('mousemove', pick);

function generateRandomCoordinate() {
  var width = 1;
  var height = 1;
  var x = Math.floor(Math.random()*450);
  var y = Math.floor(Math.random() * 600);
  var pixelData = ctx.getImageData(x, y + 20, width, height).data;
  if ((pixelData[3]/255) > 0.7 && pixelData[1] > 60) {
    return [x, y];
  } else {
    return generateRandomCoordinate();
  }
}

var numOfMaxDonations = 50;
var coords = [];
for (var i = 0; i < numOfMaxDonations; i++) {
  var coordinate = generateRandomCoordinate();
  coords.push(coordinate);
  drawBulb(coordinate, coords.length - 1);
}
console.log(coords);

function drawBulb(coor, index) {
  var imageObj = new Image();
  imageObj.onload = function () {
    ctx.drawImage(imageObj, coor[0], coor[1], 20, 28.7);
  };
  var imageSources = ['./images/redbulb-off.png'];
  var selectedImageSource = imageSources[Math.floor(Math.random() * imageSources.length)];
  imageObj.src = selectedImageSource;

  if (selectedImageSource.indexOf('red') > -1) {
    coords[index].push('redoff', imageObj);
  } else {
    coords[index].push('silveroff', imageObj);
  }
}

function randomlyHighlightBulbs(coords) {
  coords.forEach(function (coord) {
    if (!coord[4]) {
      (function (coord) {
        coord[5] = setInterval(function () {
          var imageSource;
          if (coord[2].indexOf('red') > -1) {
            if (coord[2].indexOf('on') > -1) {
              imageSource = './images/redbulb-off.png';
              coord[2] = 'redoff';
            } else if (coord[2].indexOf('off') > -1) {
              imageSource = './images/redbulb-on.png';
              coord[2] = 'redon';
            }
          } else if (coord[2].indexOf('silver') > -1) {
            if (coord[2].indexOf('on') > -1) {
              imageSource = './images/silverbulb-off.png';
              coord[2] = 'silveroff';
            } else if (coord[2].indexOf('off') > -1) {
              imageSource = './images/silverbulb-on.png';
              coord[2] = 'silveron';
            }
          }
          // console.log(coord[0], coord[1], coord[2], imageSource);
          coord[3].src = imageSource;
        }, ((Math.random() * 100) + 500));
      })(coord);
    }
  });
}

randomlyHighlightBulbs(coords);

function pickTopMostCoordinate() {
  var width = 1;
  var height = 1;
  var x = 450;
  var y = 600;

  for (var i = 0; i < y; i++) {
    for (var j = 0; j < x; j++) {
      var pixelData = ctx.getImageData(j, i, width, height).data;
      if ((pixelData[3]/255) > 0.7 && pixelData[1] > 60) {
        return [j, i];
      }
    }
  }
}

function drawStarAtTop() {
  var imageObj = new Image();
  var topMostCoordinate = pickTopMostCoordinate();
  console.log(topMostCoordinate);
  imageObj.onload = function() {
    ctx.drawImage(imageObj, topMostCoordinate[0] - 65, topMostCoordinate[1] - 64, 129, 128);
  };
  imageObj.src = './images/starimage.png';
}

setTimeout(function () {
  // drawStarAtTop();
}, 0);

function toggleAllBulbs(glow) {
  coords.forEach(function(coord) {
    clearInterval(coord[5]);
    if (glow) {
      coord[3].src = coord[3].src.replace('off', 'on');
    } else {
      coord[3].src = coord[3].src.replace('on', 'off');
    }
  });
}

/*
setTimeout(function () {
  toggleAllBulbs(true);
}, 10000);

setTimeout(function () {
  toggleAllBulbs(false);
}, 30000);
*/

function randomlyAddAGift() {
  var width = 1;
  var height = 1;
  var x = Math.random()* 390 + 10;
  var y = Math.random()*20 + 540;
  var gifts = ['hamper', 'hamper1', 'hamper2'];
  var numOfDonations = parseInt(localStorage.getItem('numDonations'), 10);

  if (numOfDonations % 5 === 0) {
    var imageObj = new Image();
    imageObj.onload = function() {
      ctx.drawImage(imageObj, x, y, 50, 38);
    };
    imageObj.src = './images/' + gifts[Math.floor(Math.random() * gifts.length)] + '.png';
  }
}

function glowABulb() {
  var bulbToGlow = coords[Math.floor(Math.random() * coords.length)];
  clearInterval(bulbToGlow[5]);
  if (bulbToGlow[3].src.indexOf('off') > -1) {
    bulbToGlow[3].src.replace('off', 'on');
    bulbToGlow[4] = true;
    var prevNumDonations = parseInt(localStorage.getItem('numDonations'), 10) || 0;
    localStorage.setItem('numDonations', prevNumDonations++);
    randomlyAddAGift();
  }
}

setInterval( function () {
  glowABulb();
}, 1000);