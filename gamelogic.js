

function getPossibleMoves(squareid) {
                   //|--notpromoted--|---promoted---|
    var moves =[]; // MFR,MFL,JFR,JFL,MBR,MBL,JBR,JBL
    moves[0]  = [0, 5, 0, 10, 0, 0, 0, 0];
    moves[1]  = [5, 6, 0, 0, 0, 0, 0, 0];
    moves[2]  = [6, 7, 10, 12, 0, 0, 0, 0];
    moves[3]  = [7, 8, 11, 0, 0, 0, 0, 0];
    moves[4]  = [9, 10, 0, 14, 1, 2, 0, 0];
    moves[5]  = [10, 11, 13, 15, 2, 3, 0, 0];
    moves[6]  = [11, 12, 14, 16, 3, 4, 0, 0];
    moves[7]  = [12, 0, 15, 0, 4, 0, 0, 0];
    moves[8]  = [0, 13, 0, 18, 0, 5, 0, 2];
    moves[9]  = [13, 14, 17, 19, 5, 6, 1, 3];
    moves[10] = [14, 15, 18, 20, 6, 7, 2, 4];
    moves[11] = [15, 16, 19, 0, 7, 8, 3, 0];
    moves[12] = [17, 18, 0, 22, 9, 10, 0, 6];
    moves[13] = [18, 19, 21, 23, 10, 11, 5, 7];
    moves[14] = [19, 20, 22, 24, 11, 12, 6, 8];
    moves[15] = [20, 0, 23, 0, 12, 0, 7, 0];
    moves[16] = [0, 21, 0, 26, 0, 13, 0, 10];
    moves[17] = [21, 22, 25, 27, 13, 14, 9, 11];
    moves[18] = [22, 23, 26, 28, 14, 15, 10, 12];
    moves[19] = [23, 24, 15, 16, 27, 0, 11, 0];
    moves[20] = [25, 26, 17, 18, 0, 30, 0, 14];
    moves[21] = [26, 27, 18, 19, 29, 31, 13, 15];
    moves[22] = [27, 28, 19, 20, 30, 32, 14, 16];
    moves[23] = [28, 0, 31, 0, 20, 0, 15, 0];
    moves[24] = [0, 29, 0, 0, 0, 21, 0, 18];
    moves[25] = [29, 30, 0, 0, 21, 22, 17, 19];
    moves[26] = [30, 31, 0, 0, 22, 23, 18, 20];
    moves[27] = [31, 32, 0, 0, 23, 24, 19, 0];
    moves[28] = [0, 0, 0, 0, 25, 26, 0, 22];
    moves[29] = [0, 0, 0, 0, 26, 27, 21, 23];
    moves[30] = [0, 0, 0, 0, 27, 28, 22, 24];
    moves[31] = [0, 0, 0, 0, 28, 0, 23, 0];
    if (square.id > 0 && square.id < moves.length) {
      return moves[square.id-1];
    }
    return null;
  };

function validateMove(move, boardstate) {
  var result = { valid: false, boardstate: boardstate };
      movetokens = move.split(.split(/[x\-]+/)),
      movesegment = {},
      everfalse = false;
      squares = boardstate.split(""),
      jump = (move.toLowerCase().indexOf("x") != -1) ? true : false;

  if (squares.length == 32) {
       
    // TODO: Need code to get boardstate from db and
    //       match to the provided boardstate value
       
    var vaild = function(orig, dest, jump) {
      var jumped, opponent, opponentKing,
          answer = {
            moveok: false,
            newBoardstate: ""
          };
      if (squares[dest-1] == "0") {
        if (!jump) {
          squares[dest-1] = squares[orig-1];
          squares[orig-1] = "0";           
          answer.moveok = true;
          answer.newBoardstate = squares.join("");
        } else {
          jumped = getJumped(orig, dest);
          opponent = ((squares[orig-1] == 1 || squares[orig-1] == 3) ? 2 : 1);
          opponentKing = ((squares[orig-1] == 1 || squares[orig-1] == 3) ? 4 : 3);
          if (squares[jumped-1] == opponent || squares[jumped-1] == opponentKing) {
            squares[jumped-1] = "0";
            squares[dest-1] = boardstate[orig-1];
            squares[orig-1] = "0";
            answer.moveok = true;
            answer.newBoardState = squares.join("");
          }
        }   
      }
      return answer;
    }
           
    var i=0;
    while (i<movetokens.length-1 && !everfalse) {
      movesegment = valid(movetokens[i], movetokens[i+1], jump);
      if (movesegment.moveok) {
        squares = movesegment.newBoardstate.split("");
      } else {
        everfalse = true;
      }
      i++;
    }

    if (everfalse) {
      result.valid = false;
      result.boardstate = boardstate;
    } else {
      result.valid = true;
      result.boardstate = squares.join("");
    }
       
   }

   return result;
           
}

function contains(value, array) {
  for (var i=0; i<array.length; i++) {
    if (array[i] == value) { return true; }
  }
  return false;
}

function getJumped(orig, dest) {
  if (orig < dest) { // jump forward
      return orig + (Math.ceil((dest-orig)/2));
  } else {  //jump backward
      return orig - (Math.ceil((orig-dest)/2));
  }
}