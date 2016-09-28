var canvas, ctx, audio,
numOfDonationsGiven = parseInt(localStorage.getItem('donationsGiven'), 10) || 0,
giftsGenerated = parseInt(localStorage.getItem('giftsGenerated'), 10) || 0,
coords = [],
numOfStars = 5,
numOfMaxDonations = 50;

function initCanvas() {
  canvas = document.getElementById("christmas");
  ctx = canvas.getContext("2d");
}

function drawChristmasTree() {
  var image = document.getElementById("source");
  ctx.drawImage(image, -10, -60, 470, 702, 0, 0, 401, 602);
}

function generateRandomCoordinateOnTree() {
  var width = 1;
  var height = 1;
  var x = Math.floor(Math.random()*450);
  var y = Math.floor(Math.random() * 600);
  var pixelData = ctx.getImageData(x, y + 20, width, height).data;
  if ((pixelData[3]/255) > 0.7 && pixelData[1] > 60) {
    return [x, y];
  } else {
    return generateRandomCoordinateOnTree();
  }
}

function generateLightCoordinatesAndDrawLights() {
  for (var i = 0; i < numOfMaxDonations; i++) {
    var coordinate = generateRandomCoordinateOnTree();
    coords.push({
      x: coordinate[0],
      y: coordinate[1]
    });
    drawLight(coordinate, coords.length - 1);
  }
}

function drawLight(coord, index) {
  var imageObj = new Image();
  imageObj.onload = function () {
    ctx.drawImage(imageObj, coord[0], coord[1], 20, 28.7);
  };
  var imageSources = ['./images/redbulb-off.png', './images/silverbulb-off.png'];
  imageObj.src = imageSources[Math.floor(Math.random() * imageSources.length)];
  coords[index].imgObj = imageObj;
}

function permanentlyHighlightARandomLight() {
  var coordinate = coords.find(function (coord) {
    return !coord.donated;
  });

  if (coordinate) {
    if (coordinate.interval) {
      clearInterval(coordinate.interval);
    }

    coordinate.donated = true;
    coordinate.imgObj.src = coordinate.imgObj.src.replace('off', 'on');
  }
}

function glowLightsPermanently() {
  for (var i = 0; i < numOfDonationsGiven; i++) {
    permanentlyHighlightARandomLight();
  }
}

function incrementDonations() {
  localStorage.setItem('donationsGiven', ++numOfDonationsGiven);
}

function randomlyHighlightBulbs() {
  coords.forEach(function (coord) {
    if (!coord.donated) {
      (function (coord) {
        coord.interval = setInterval(function () {
          var imageSource;
          if (coord.imgObj.src.indexOf('red') > -1) {
            if (coord.imgObj.src.indexOf('on') > -1) {
              imageSource = './images/redbulb-off.png';
            } else if (coord.imgObj.src.indexOf('off') > -1) {
              imageSource = './images/redbulb-on.png';
            }
          } else if (coord.imgObj.src.indexOf('silver') > -1) {
            if (coord.imgObj.src.indexOf('on') > -1) {
              imageSource = './images/silverbulb-off.png';
            } else if (coord.imgObj.src.indexOf('off') > -1) {
              imageSource = './images/silverbulb-on.png';
            }
          }
          // console.log(coord[0], coord[1], coord[2], imageSource);
          coord.imgObj.src = imageSource;
        }, ((Math.random() * 100) + 500));
      })(coord);
    }
  });
}

function stopRandomlyHighlightingLights() {
  coords.forEach(function (coord) {
    if (!coord.donated && coord.interval) {
      clearInterval(coord.interval);
      coord.imgObj.src = coord.imgObj.src.replace('on', 'off');
    }
  });
}

function initAlreadyGivenGifts() {
  for (var i = 1; i <= numOfDonationsGiven; i++) {
    if (i % 5 === 0) {
      randomlyAddAGift();
    }
  }
}

function incrementGifts() {
  if (numOfDonationsGiven % 5 === 0) {
    randomlyAddAGift();
  }
}

function randomlyAddAGift() {
  var width = 1;
  var height = 1;
  var x = Math.random()* 390 + 10;
  var y = Math.random()*20 + 540;
  var gifts = ['hamper', 'hamper1', 'hamper2'];

  var imageObj = new Image();
  imageObj.onload = function() {
    ctx.drawImage(imageObj, x, y, 50, 38);
  };
  imageObj.src = './images/' + gifts[Math.floor(Math.random() * gifts.length)] + '.png';
}

function drawStars() {
  var imageObj, starCoordinate;
  for (var i = 0; i < numOfStars; i++) {
    imageObj = new Image();
    starCoordinate = generateRandomCoordinateOnTree(true);
    (function (imageObj, coord) {
      imageObj.onload = function() {
        ctx.drawImage(imageObj, coord[0] - 65, coord[1] - 60, 129, 128);
      };
    })(imageObj, starCoordinate);
    imageObj.src = './images/starimage.png';
  }
}

function attachStartDonationHandler() {
  $('#startDonate').click(function () {
    randomlyHighlightBulbs();

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
    $('#donationbody').hide( 'slow', function () {
      $('#donationForm').show();
    });
  });
}

function attachEndDonationHandler() {
  $('#endDonate').click(function () {
    incrementDonations();
    permanentlyHighlightARandomLight();
    stopRandomlyHighlightingLights();
    incrementGifts();

    audio.pause();
    $('#donationForm').hide('slow', function () {
      $('#thankYouForm').show( 400 );
    });
  });
}

function attachStartPageHandler() {
  $('#donateAgain').click(function() {
    $('#thankYouForm').hide('slow', function () {
      $('#donationbody').show( 400 );
    });
  });
}

function initialize() {
  initCanvas();
  drawChristmasTree();
  generateLightCoordinatesAndDrawLights();
  drawStars();
  glowLightsPermanently();
  initAlreadyGivenGifts();
  attachStartDonationHandler();
  attachEndDonationHandler();
  attachStartPageHandler();
}

initialize();

// DEBUG CODE
/*
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
*/