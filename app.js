const gridWidth = 10;
const gridHeight = 10;
const pixelWidth = 75;
const pixelHeight = 75;
const pixelRadius = 35;
const fillColour = d => 'pink';
const strokeColour =  d => 'lightgrey';
const arrowUpPath = 'M-15,-5 L0,-25 L15,-5 M0,-25 L0,30';

const lookup = {};
const current = '4,1';

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
        hasPlayer : (index===current)
      });
      lookup[index] = count;
      count++;
  }}
  return startArr;
}

const random = index => {
  return 90 * Math.floor (Math.random()*4);
}

const contents = populateSquares([],gridWidth,gridHeight,random);

const doRotate = square => {
  contents[lookup[square.id]].direction = (contents[lookup[square.id]].direction+90)%360;
}

const follow = index => {
  doRotate ({ id : index });
  let [x,y] = index.split(',');
  [x,y] = [x*1,y*1];
  switch (contents[lookup[index]].direction) {
    case 0 : {y--; break;}
    case 90 : {x++; break;}
    case 180 : {y++; break;}
    case 270 : {x--; break;}
    default: break;
  };
  let newIndex = x +','+ y;
  if (lookup[newIndex]>=0) {
    contents[lookup[index]].hasPlayer = false;
    contents[lookup[newIndex]].hasPlayer = true;
  }
  return newIndex;
}


const canBeReached = d => {
  if (d.hasPlayer)
    return ('magenta');
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
  ? ('green')
    : ('lightgreen');
};


const doClick = d => {
  console.log ('HI');
}


const maze = d3.select ('#maze');
const squares = maze.selectAll ('.square');

maze
    .attr ('width',(gridWidth+1)*pixelWidth)
    .attr ('height',(gridHeight+1)*pixelHeight)

let signs= squares.
  data (contents)
      .enter ()
      .append ('svg:g')

signs
  .classed ('square',true)
  .attr ('id', d=> d.id)
  .attr ('fill', canBeReached)
  .attr ('stroke', strokeColour)
  .attr ('stroke-width', 1)
  .on ('click', doRotate)

signs
    .append ('circle')
      .attr ('cx', d => d.xPos)
      .attr ('cy',d => d. yPos)
      .attr ('r', pixelRadius)
      .attr ('stroke-width', 1)
signs
    .append ('path')
      .attr ('stroke', 'white')
      .attr ('stroke-width', pixelWidth/10)
      .attr ('stroke-linejoin', 'miter')
      .attr ('d', arrowUpPath)
      .attr ('transform', d=>
        'translate ('+d.xPos+','+d.yPos+')' +
        `scale( ${pixelWidth/100}, ${pixelHeight/100}) ` +
        `rotate(${d.direction})`)
