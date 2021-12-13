import Ai from './modules/ai.js'
import {Piece, Pawn, Figures, Queen, King} from './modules/pieces.js'

const whiteSquare = '#f0d9b5'
const blackSquare = '#b58863'
const whiteSquareGrey = '#a9a9a9'
const blackSquareGrey = '#696969'

let ai = new Ai()

let Game = {
  turn: 'w',
  newPosition: {},
  player:'w' ,
  changeTurn(){
    this.turn == 'w'? this.turn = 'b' : this.turn = 'w'
  }
}

let config = {
  draggable: true,
  position: '3qk3/8/pppppppp/8/8/PPPPPPPP/8/3QK3',
  onMouseoverSquare: onMouseoverSquare,
  onMouseoutSquare: onMouseoutSquare,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onChange: onChange,
  moveSpeed: 'slow',
  pieceTheme: 'img/{piece}.png'
};

let board = Chessboard('board', config);


function changeColor(square, piece, white, black){
  let squares = window[square + piece].legalMoves(board.position())
  if (squares.length == 0) return
  squares.push(square)

  squares.forEach(move => {
    let color
    let highlight = document.querySelector(`.square-${move}`)
    highlight.classList.contains('black-3c85d') ? color = black : color = white
    highlight.style.background = color
  });
}

function onMouseoverSquare(square, piece){
  if (piece !== false && piece[0] == Game.turn) changeColor(square, piece, whiteSquareGrey, blackSquareGrey)
}

function onMouseoutSquare(square, piece){
  if (piece !== false && piece[0] == Game.turn) changeColor(square, piece, whiteSquare, blackSquare)
}

function onDragStart(source, piece){
  if (piece[0] !== Game.player) return false
}
function onDrop(source, target, piece, newPos){
  let current = window[source + piece]
  let legal = current.legalMoves(board.position())
  changeColor(source, piece, whiteSquare, blackSquare)

  if (legal.includes(target)){
    delete window[source + piece]
    if (board.position()[target] !== undefined){
      delete window[target + board.position()[target]]
    }
    createPiece(target, piece)
    Game.changeTurn()
    Game.newPosition = newPos
    Game.next = ai.move(Game.newPosition)
  }
  else return 'snapback'
}

function onSnapEnd(source, target, piece){
  promotion(target, piece)
  if (Game.turn == 'b'){
    board.move(Game.next[0])
    piece = Game.next[1]
    target = Game.next[0].slice(3)
  }
  Game.changeTurn()
  promotion(target, piece)
}

function onChange(oldPos, newPos){
  const pieces = Object.values(newPos)
  if(!pieces.includes('bK') || !pieces.includes('wK')){
    config = {
      draggable: false,
      position: newPos,
      pieceTheme: 'img/{piece}.png'
    }
    Chessboard('board', config)
    let winner
    if(Game.turn = 'b') winner = 'black'
    else winner = 'white'
    document.querySelector('.status').innerText = `${winner} won`
  } 
}

function promotion(target, piece){
  if (piece[1] == 'P' &&
    (target[1] == 8 || target[1] == 1)) {
      
      let updatedBoard = JSON.parse(JSON.stringify(board.position()))
      
      createPiece(target, piece[0] + 'Q')
      updatedBoard[target] = piece[0] + 'Q'
      board.position(updatedBoard)
      delete window[target + piece[0] + 'P']
    }
}

function createPiece(position, pieceName){
  let color = pieceName[0]
  let type = pieceName[1]
  if (type == 'P') window[position + pieceName] = new Pawn(position, color)
  if (type == 'Q') window[position + pieceName] = new Queen(position, color)
  if (type == 'K') window[position + pieceName] = new King(position, color)
};

function createObjects(){
  let pos = board.position()
  let places = Object.keys(pos)
  let pieces = Object.values(pos)
  let len = Object.keys(pos).length

  for(let i = 0; i < len; i++){
    createPiece(places[i], pieces[i])
  }
};  
createObjects()
const button = document.querySelector('#newGame')
button.addEventListener('click', 
  function(){
    config = {
      draggable: true,
      position: '3qk3/8/pppppppp/8/8/PPPPPPPP/8/3QK3',
      onMouseoverSquare: onMouseoverSquare,
      onMouseoutSquare: onMouseoutSquare,
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd,
      onChange: onChange,
      moveSpeed: 'slow',
      pieceTheme: 'img/{piece}.png'
    };
    board = Chessboard('board', config)
    document.querySelector('.status').innerText = ``
    createObjects()
  }
)