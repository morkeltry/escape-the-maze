const gridWidth = 10;
const gridHeight = 10;
const pixelWidth = 75;
const pixelHeight = 75;
const pixelRadius = 35;
const fillColour = d => 'pink';
const strokeColour =  d => 'lightgrey';
const arrowUpPath = 'M-15,-5 L0,-25 L15,-5 M0,-25 L0,30';
const walkSpeed = 350;

const lookup = {};
const history = [];
var contents;
var placePlayer = true;
var paused = false;
var hasWon = false;
var current = null;

const populateSquares = (startArr,x,yInit,pattern) => {
  let count=0;
  while (x--) {
    let y=yInit;
    while (y--) {
      const index = x +','+ y;
      startArr.push ({
        id : index,
        xPos : (x+0.5)*pixelWidth,
        yPos : (y+0.5)*pixelHeight,
        direction : pattern(index),
        hasPlayer : (index===current),
        visited : false,
        exited : []
      });
      lookup[index] = count;
      count++;
  }}
  return startArr;
}

const random = index => {
  return 90 * Math.floor (Math.random()*4);
}

const doRotate = index => {
  contents[lookup[index]].direction = (contents[lookup[index]].direction+90)%360;
}

const rotateUpdate = square => {
  doRotate(square.id);
  doUpdate();
};

const follow = index => {
  var exitDirection;
  var newIndex;

  index = index || `${Math.floor(Math.random()*gridWidth)},${Math.floor(Math.random()*gridHeight)}`
  console.log (`follow ${index} ${contents[lookup[index]] && contents[lookup[index]].direction}`);
  exitDirection = contents[lookup[index]].direction;
  let [x,y] = index.split(',');
  [x,y] = [x*1,y*1];
  switch (exitDirection) {
    case 0 : {y--; break;}
    case 90 : {x++; break;}
    case 180 : {y++; break;}
    case 270 : {x--; break;}
    default: break;
  };
  newIndex = x +','+ y;
  if (lookup[newIndex]>=0) {
    doRotate (index);
    contents[lookup[index]].hasPlayer = false;
    contents[lookup[newIndex]].hasPlayer = true;
    contents[lookup[index]].visited = true;
    contents[lookup[index]].exited.push (exitDirection);
  } else {
    youWin();
  }
  doUpdate();
  console.log('follow returning');
  return newIndex;
}

const lighten = rgbStr => {
  console.log(rgbStr);
  const regex = new RegExp ('[0-9]{1,3}','gi');
  const whiteAverage = x =>
    255-(255-x)/2;
  let [r,g,b] = rgbStr.match(regex);
  return `rgb(${whiteAverage(r)},${whiteAverage(g)},${whiteAverage(b)})`
}

const canBeReached = d => {
  if (d.hasPlayer)
    return ('rgb(255,0,255)');
  let [x,y] = d.id.split(',');
  [x,y] = [x*1,y*1];
  surroundingIndices = [[-1,0,90],[0,-1,180],[1,0,270],[0,1,0]].map (xY =>
    ({
      index : (x+xY[0]) +','+ (y+xY[1]),
      direction : xY[2]
    }));
  return surroundingIndices.some (el =>
    lookup[el.index]>=0 && el.direction === contents[lookup[el.index]].direction
  )
  ? ('rgb(0,128,0)')
    : ('rgb(144,238,144)');
};

const favouriteSquares = d => {
  if (!d.visited ||1) {
    return lighten(canBeReached(d));

  }



}

const doUpdate = () => {
  const maze = d3.select ('#maze');
  const squares = maze.selectAll ('.square');
  var signs;
  var fillFunc;

console.log('Running update');
  maze
      .attr ('width',(gridWidth+1)*pixelWidth)
      .attr ('height',(gridHeight+1)*pixelHeight)

  if (!hasWon) {
    fillFunc = canBeReached;
    signs= squares.
      data (contents)
          .enter ()
          .append ('svg:g')
  }

  if (hasWon) {
    fillFunc = favouriteSquares;
    signs= squares.
      data (contents)
          .enter ()
          .append ('svg:g')
  }


  signs
    .classed ('square',true)
    .attr ('id', d=> d.id)
    .attr ('fill', fillFunc)
    .attr ('stroke', strokeColour)
    .attr ('stroke-width', 1)
      .attr ('transform', d=>
        `translate (${d.xPos},${d.yPos}) ` +
        `scale( ${pixelWidth/100}, ${pixelHeight/100}) ` +
        `rotate(${d.direction})` )
    .on ('click', d => placePlayer ? setPlayer(d) : rotateUpdate(d))

  signs
      .append ('circle')
        .attr ('r', 45)             // r=45 => height=90 = 90% of 100px basis
        .attr ('stroke-width', 1)
  signs
      .append ('path')
        .attr ('stroke', 'white')
        .attr ('stroke-width', pixelWidth/10)
        .attr ('stroke-linejoin', 'miter')
        .attr ('d', arrowUpPath)
  signs
      .merge (squares)
      .attr ('fill', fillFunc)
      .attr ('stroke', strokeColour)
      .attr ('transform', d=>
        `translate (${d.xPos},${d.yPos}) ` +
        `scale( ${pixelWidth/100}, ${pixelHeight/100}) ` +
        `rotate(${d.direction})` )
}

const setPlayer = d => {
  console.log(d);
  if (current && lookup[current] != undefined)
    contents[lookup[current]].hasPlayer = false;
  current = d.id;
  if (lookup[current] != undefined) {
    contents[lookup[current]].hasPlayer = true;
    history.push (current);
    placePlayer = false;
    doUpdate();
  }
}

const startWalk = () => {
  setTimeout (()=>{
  if (!paused)
      setPlayer ({id: follow(current)});
  if (!paused) {
      doUpdate();
      startWalk();
  }},
   walkSpeed);
}

const youWin = () => {
  paused = true;
  hasWon= true;
  console.log('WON!!!');
}

d3.select ('#set-player')
  .on ('click', ()=> {
    placePlayer = true;
  });

d3.select ('#reset')
  .on ('click', ()=> {
    contents = populateSquares([],gridWidth,gridHeight,random);
    doUpdate();
  });

d3.select ('#pause')
  .on ('click', ()=> {
    paused = !paused;
    console.log('paused:',paused);
    startWalk();
  });

d3.select ('#go')
  .on ('click', startWalk);

contents = populateSquares([],gridWidth,gridHeight,random);
doUpdate();
