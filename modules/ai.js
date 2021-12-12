import {Piece, Pawn, Figures, Queen, King} from './pieces.js'

export default class Ai{
  colNames = ['a','b','c','d','e','f','g','h']
  piecesWeights = {wP:100 , wQ:500 , wK:1000 , bP:-100 ,bQ:-500 ,bK:-1000}
  white = {
    wP : [
          [ 100, 100, 100, 100, 105, 100, 100,  100],
          [  78,  83,  86,  73, 102,  82,  85,  90],
          [   7,  29,  21,  44,  40,  31,  44,   7],
          [ -17,  16,  -2,  15,  14,   0,  15, -13],
          [ -26,   3,  10,   9,   6,   1,   0, -23],
          [ -22,   9,   5, -11, -10,  -2,   3, -19],
          [   0,   0,   0,   0,   0,   0,   0,   0],
          [   0,   0,   0,   0,   0,   0,   0,   0]
        ],
    wQ : [
          [  6,   1,  -8,-104,  69,  24,  88,  26],
          [ 14,  32,  60, -10,  20,  76,  57,  24],
          [ -2,  43,  32,  60,  72,  63,  43,   2],
          [  1, -16,  22,  17,  25,  20, -13,  -6],
          [-14, -15,  -2,  -5,  -1, -10, -20, -22],
          [-30,  -6, -13, -11, -16, -11, -16, -27],
          [-36, -18,   0, -19, -15, -15, -21, -38],
          [-39, -30, -31, -13, -31, -36, -34, -42]
        ],
    wK : [
          [  4,  54,  47, -99, -99,  60,  83, -62],
          [-32,  10,  55,  56,  56,  55,  10,   3],
          [-62,  12, -57,  44, -67,  28,  37, -31],
          [-55,  50,  11,  -4, -19,  13,   0, -49],
          [-55, -43, -52, -28, -51, -47,  -8, -50],
          [-47, -42, -43, -79, -64, -32, -29, -32],
          [ -4,   3, -14, -50, -57, -18,  13,   4],
          [ 17,  30,  -3, -14,   6,  -1,  40,  18]
        ]
  }
  black = {
    bP : this.white['wP'].slice().reverse(),
    bQ : this.white['wQ'].slice().reverse(),
    bK : this.white['wK'].slice().reverse()
  }
  nextMove = ''
  evaluate(board){
    let whites = this.filter(board, 'w')
    let blacks = this.filter(board, 'b')
    return this.points('w', whites) + this.points('b', blacks)
  }
  points(color, posObject){
    let sum = 0
    for (const [key, value] of Object.entries(posObject)){
      color == 'w'? sum += this.piecesWeights[value] : sum += this.piecesWeights[value]

      const row = Math.abs(Number(key[1]) - 8)
      const column = this.colNames.indexOf(key[0])
      color == 'w'? sum += this.white[value][row][column] : sum -= this.black[value][row][column]
    }
    return sum
  }
  filter(board, color){
    let obj = {}
    for (const [key, value] of Object.entries(board)){
      if(value[0] == color) obj[key] = value
    }
    return obj
  }
  legalMoves(currentBoard){
    let places = Object.keys(currentBoard)
    let pieces = Object.values(currentBoard)
    let len = Object.keys(currentBoard).length

    for(let i = 0; i < len; i++){
    }
  }
  createPiece(position, pieceName){
    let color = pieceName[0]
    let type = pieceName[1]
    if (type == 'P') return new Pawn(position, color)
    if (type == 'Q') return new Queen(position, color)
    if (type == 'K') return new King(position, color)
  }
  updateBoard(board, source, target, piece){
    delete board[source]
    board[target] = piece
    return board
  }
  minimax(position, depth, alpha, beta, player){
    if(depth == 0) return this.evaluate(position)

    if(player == 'w'){
      let maxEval = -Infinity
      const pieces = this.filter(position, 'w')
      for (const [key, value] of Object.entries(pieces)){
        let piece = this.createPiece(key, value)
        piece.legalMoves(position).forEach(elem=>{
          let newPosition = JSON.parse(JSON.stringify(position))
          newPosition[elem] = value
          delete newPosition[key]
          let next = this.minimax(newPosition, depth - 1, alpha, beta, 'b')
          if(depth == 4 && maxEval < next) this.nextMove = [key+'-'+elem, value]
          maxEval = Math.max(maxEval, next)
          alpha = Math.max(maxEval, alpha)
          if (beta <= alpha) return
        })
      }
      return maxEval
    }

    if(player == 'b'){
      let minEval = Infinity
      const pieces = this.filter(position, 'b')
      for (const [key, value] of Object.entries(pieces)){
        let piece = this.createPiece(key, value)
        piece.legalMoves(position).forEach(elem=>{
          let newPosition = JSON.parse(JSON.stringify(position))
          newPosition[elem] = value
          delete newPosition[key]
          let next = this.minimax(newPosition, depth - 1, alpha, beta, 'w')
          if(depth == 4 && minEval > next) this.nextMove = [key+'-'+elem, value]
          minEval = Math.min(minEval, next)
          beta = Math.min(minEval, beta)
          if (beta <= alpha) return
        })
      }
      return minEval
    }
  }
  move(currentBoard){
    this.minimax(currentBoard, 4, -Infinity, Infinity, 'b')
    return this.nextMove
    // this.makeaMove(whitePieces, blackPieces)
  }
}