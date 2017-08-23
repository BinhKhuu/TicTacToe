$(function() {
  var currTurn = 'X';
  var mode;
  var human;
  var comp;
  var gameOver = false;
  var turn = 0;
  var game = [0,1,2,3,4,5,6,7,8];
  var winMatrix = [
                  [0,1,2],
                  [3,4,5],
                  [6,7,8],
                  [0,3,6],
                  [1,4,7],
                  [2,5,8],
                  [0,4,8],
                  [2,4,6]
                  ];
  function highlight(i,j,k) {
    $("*[data-sq=" +i+']').css('background','#31887F');  
    $("*[data-sq=" +j+']').css('background','#31887F'); 
    $("*[data-sq=" +k+']').css('background','#31887F'); 
    $('#clear').css('display','inline-block');
  }
  /*________________________________________________________________________________ 
  ______________________________ Game logic___________________________________ */ 
  //highlightFlag enable winning squares to get highlighted
  //turn off for simulations with minimax
  function checkWinner(board,player,highlightFlag){
    var win;
    for(var i = 0; i < winMatrix.length; i++){
      win = true;    
      for(var j = 0; j < 3; j++) {
        if(board[winMatrix[i][j]] != player)  {
          win = false;
          break;
        }
      }
      if(win) {
        if(highlightFlag){
          highlight(winMatrix[i][0],winMatrix[i][1],winMatrix[i][2]);
        }
        return true;
      }        
    }
    return win;
  }  
  
  function emptyIndexies(board){
    return  board.filter(s => s != "O" && s != "X");
  }

  function minimax(newBoard, player) {
    var availSpots = emptyIndexies(newBoard);
    if(checkWinner(newBoard,human,false)){
      return {score: -10};   
    }    
    else if(checkWinner(newBoard,comp,false)){
      return {score:10};  
    } 
    else if(availSpots.length == 0){
      return {score:0};   
    }    
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      var move = {};
      move.index = newBoard[availSpots[i]]; 
      newBoard[availSpots[i]] = player;
      if(player == comp) {
        var result = minimax(newBoard.slice(0),human);
        move.score = result.score;
      }
      else {
        var result = minimax(newBoard.slice(0), comp);
        move.score = result.score;
      }
      newBoard[availSpots[i]] = move.index;
      moves.push(move);
    }
    var bestMove;
    if(player == comp) {
      var bestScore = -10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    else {
      var bestScore = 10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }
/*________________________________________________________________________________ 
  ______________________________ event handler functions___________________________________ */ 
  function play(sq,player){
    if(sq.text().length == 0 && !gameOver) {
      game[sq.data('sq')] = player;
      sq.text(player); 
      if(player == 'X'){
        $('#turn-box1').css('background','#C1CFDA');
        $('#turn-box2').css('background','#941C2F');        
      } 
      else {
        $('#turn-box1').css('background','#20A4F3');
        $('#turn-box2').css('background','#C1CFDA');        
      }
      turn += 1;
      if(turn >= 5 && turn <= 9){
        gameOver = checkWinner(game,currTurn,true);
      }
    }
    if(turn == 9) {
      if(!checkWinner(game,currTurn,true)) {
        gameOver = true;
        alert('draw!');
      }
      $('#clear').css('display','inline-block');
    }
  } 
  
  function aiTurn(){
    var num = minimax(game.slice(0),comp);
    play($("*[data-sq=" +num.index+']'),currTurn);    
  }

  function reset() {
    $('#clear').css('display','none');
    $('.square').text('');
    $('.square').css('background', '#03191E');
    gameOver = false;
    game = [0,1,2,3,4,5,6,7,8];
    turn = 0;
    currTurn = 'X';
    if(comp == 'X' && mode == 1) {
      aiTurn();
    }
  }
/*________________________________________________________________________________ 
  ______________________________ event handlers___________________________________ */ 
  $('.square').click(function(){
    if(game[$(this).data('sq')] != 'X' && game[$(this).data('sq')] != 'O'){
      play($(this),currTurn);
      var num;
      currTurn = (currTurn == 'X') ? 'O' : 'X';
      if (mode == 1 && !gameOver) {
        aiTurn();
        currTurn = (currTurn == 'X') ? 'O' : 'X';
      }       
    }   
  }); 
  
  $('#reset').click(function(){
    comp = '';
    human = '';
    reset();
    $('#turn-box1').css('background','#20A4F3');
    $('#turn-box2').css('background','#C1CFDA');
    $('#board').css('display','none'); 
    $('#options-row').css('display','inline-block'); 
    $('#op-x').css('display','none'); 
    $('#op-o').css('display','none');
    $('#mode1').css('display','inline-block'); 
    $('#mode2').css('display','inline-block');    
  });
  
  $('#clear').click(function(){
    $('#turn-box1').css('background','#20A4F3');
    $('#turn-box2').css('background','#C1CFDA');
    reset();  
  });
  
  $('#op-x').click(function(){
    comp = 'O';
    human = 'X';
    $('#board').css('display','inline-block');
    $('#options-row').css('display','none'); 
  });
  
  $('#op-o').click(function(){
    comp = 'X';
    human = 'O';
    if(mode == 1){
      aiTurn();
      currTurn = (currTurn == 'X') ? 'O' : 'X';  
    }
    $('#board').css('display','inline-block'); 
    $('#options-row').css('display','none'); 
  });
  
  $('#mode1').click(function(){
    $('#op-x').css('display','inline-block');
    $('#op-o').css('display','inline-block');
    $('#mode1').css('display','none'); 
    $('#mode2').css('display','none'); 
    mode = 1;  
  });
  
  $('#mode2').click(function(){
    $('#op-x').css('display','inline-block');
    $('#op-o').css('display','inline-block');
    $('#mode1').css('display','none'); 
    $('#mode2').css('display','none'); 
    mode = 2;  
  });
});