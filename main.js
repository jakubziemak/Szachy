import Ai from './modules/ai.js'
import {Piece, Pawn, Figures, Queen, King} from './modules/pieces.js'

const whiteSquare = '#f0d9b5'
const blackSquare = '#b58863'
const whiteSquareGrey = '#a9a9a9'
const blackSquareGrey = '#696969'

let ai = new Ai()

let game = {
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
  if (piece !== false && piece[0] == game.turn) changeColor(square, piece, whiteSquareGrey, blackSquareGrey)
}

function onMouseoutSquare(square, piece){
  if (piece !== false && piece[0] == game.turn) changeColor(square, piece, whiteSquare, blackSquare)
}

function onDragStart(source, piece){
  if (piece[0] !== game.player) return false
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
    game.changeTurn()
    game.newPosition = newPos
    game.next = ai.move(game.newPosition)
  }
  else return 'snapback'
}

function onSnapEnd(source, target, piece){
  /* DO POPRAWY */
  if (game.turn == 'b'){
    board.move(game.next[0])
    piece = game.next[1]
    target = game.next[0].slice(3)
  }
  if (piece[1] == 'P' &&
    (target[1] == 8 || target[1] == 1)) {
      
      let updatedBoard = JSON.parse(JSON.stringify(board.position()))
      
      createPiece(target, piece[0] + 'Q')
      updatedBoard[target] = piece[0] + 'Q'
      board.position(updatedBoard)
      delete window[target + piece[0] + 'P']
    }
  game.changeTurn()
}

function createPiece(position, pieceName){
  let color = pieceName[0]
  let type = pieceName[1]
  if (type == 'P') window[position + pieceName] = new Pawn(position, color)
  if (type == 'Q') window[position + pieceName] = new Queen(position, color)
  if (type == 'K') window[position + pieceName] = new King(position, color)
};

(function(){
  let pos = board.position()
  let places = Object.keys(pos)
  let pieces = Object.values(pos)
  let len = Object.keys(pos).length

    for(let i = 0; i < len; i++){
      createPiece(places[i], pieces[i])
    }
  })();  