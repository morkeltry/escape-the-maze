const gridWidth = 10;
const gridHeight = 10;
const pixelWidth = 80;
const pixelHeight = 80;
const pixelRadius = 35;
const fillColour = d => 'pink';
const strokeColour =  d => 'lightgrey';

const lookup = {};

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
        direction : pattern(index)
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
    console.log(lookup);




const canBeReached = d => {
  let [x,y] = d.id.split(',');
  [x,y] = [x*1,y*1];
  surroundingIndices = [[-1,0,90],[0,-1,180],[1,0,270],[0,1,0]].map (xY =>
    ({
      index : (x+xY[0]) +','+ (y+xY[1]),
      direction : xY[2]
    }));
  return surroundingIndices.some (el =>{
    return lookup[el.index]>=0 && el.direction === contents[lookup[el.index]].direction
  })
  ? ('green')
    : ('lightgreen');
}

const arrowUpPath = 'M-15,-5 L0,-25 L15,-5 M0,-25 L0,30'


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
  .attr ('cx', d => d.xPos)
  .attr ('cy',d => d. yPos)
  .attr ('fill', canBeReached)
  .attr ('stroke', strokeColour)
  .attr ('stroke-width', 1)

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
