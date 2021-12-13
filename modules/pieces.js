class Piece {
    colNames = ['a','b','c','d','e','f','g','h']
    constructor(position, color){
      this.position = position
      this.color = color
    }
    legalMoves(context){
      let legal = []
      this.moves.forEach(option=>{
        let changeColumn = this.colNames.indexOf(this.position[0]) + option[0]
        let changeRow = Number(this.position[1] ) + option[1]
        let newPosition = this.colNames[changeColumn] + changeRow
  
        let columnExist = changeColumn >= 0 && changeColumn <= 7
        let rowExist = changeRow > 0 && changeRow <= 8
        if (columnExist && rowExist && this.checkSquare(newPosition, context)){
          legal.push(newPosition)
        }
      })
      return legal
    }
  }
  
class Pawn extends Piece{
    constructor(position, color){
      super(position, color)
      if (color == 'w') this.moves = [[0,1],[-1,1],[1,1]]
      else this.moves = [[0,-1],[-1,-1],[1,-1]]
    }
    checkSquare(square, context){   
      if (context[square] == undefined &&
      square[0] == this.position[0]){
        return true
      }
      if (context[square] !== undefined &&
        context[square][0] !== this.color &&
      square[0]!==this.position[0]){
        return true
      }
    }
    promotion(context){
      if (this.position[1] == 8 || this.position[1] == 1){
        let updatedBoard = context
  
        new Queen(this.position, this.color + 'Q')
        updatedBoard[this.position] = this.color + 'Q'
        console.log(context)
        delete window[this.position + this.color + 'P']
      }
    }
  }
  
class Figures extends Piece {
    checkSquare(square, context){
      if (context[square] == undefined) return true
      const isSameColor = context[square][0] !== this.color
      return isSameColor
    }
  }
  
class Queen extends Figures {
    moves = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]]
  }
  
class King extends Figures {
    moves = [[-1,0],[0,-1],[1,0],[0,1]]
  }

export {Piece, Pawn, Figures, Queen, King}