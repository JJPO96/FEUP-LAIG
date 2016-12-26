:- dynamic player/5.

%%%%%%%%%% Game boards %%%%%%%%%%
startingBoard([[2, -1, -1, -1, -1, -1, -1, 3],
       [-1, -1, -1, -1, -1, -1, -1, -1],
       [-1, -1, -1, -1, -1, -1, -1, -1],
       [-1, -1, -1, -1, -1, -1, -1, -1],
       [-1, -1, -1, -1, -1, -1, -1, -1],
       [-1, -1, -1, -1, -1, -1, -1, -1],
       [-1, -1, -1, -1, -1, -1, -1, -1],
       [4, -1, -1, -1, -1, -1, -1, 1]]).

tiedBoard([[2, 31, 6, 7, 8, 9, 10, 3],
       [13, 0, 11, 14, 15, 16, 17, 18],
       [19, 20, 21, 22, 23, 24, 25, 26],
       [27, 28, 29, 12, 30, 44, 5, 32],
       [33, 34, 35, 0, 0, 36, 37, 38],
       [56, 55, 41, 39, 43, 0, 45, 46],
       [47, 48, 49, 50, 51, 52, 53, 54],
       [4, 40, 0, 57, 58, 59, 60, 1]]).

board([[2, 5, 6, 7, 8, 9, 10, 3],
       [11, 12, 13, 14, 15, 16, 17, 18],
       [19, 20, 21, 22, 23, 24, 25, 26],
       [27, 28, 29, 0, 30, 44, 31, 32],
       [33, 34, 35, 0, 0, 36, 37, 38],
       [39, 40, 41, 42, 43, 0, 45, 46],
       [47, 48, 49, 50, 51, 52, 53, 54],
       [4, 55, 56, 57, 58, 59, 60, 1]]).

%%%%%%%%%% Predicates with the starting position of each player %%%%%%%%%%
% Player, Initial line, Initial column, Final line, Final column
player(1, 1, 1, 8, 8).
player(2, 8, 1, 1, 8).

%%%%%%%%%% Starts a new game %%%%%%%%%%
% There are 4 different modes of game:
% - Mode 1: Human vs Human
% - Mode 2: Human vs Computer lvl Begginer
% - Mode 3: Human vs Computer lvl Advanced
% - Mode 4: Computer vs Computer
% In mode Human vs Computer, Human will be player 1 and Computer player 2

% Creates a game with a new board
createGame(Mode):-
	startingBoard(Board),
	generateRandomBoard(Mode, Board, 5, _).
	%startGameTieBoard(Mode). 				% Used for tie simulation purposes

% Starts a new game with the board created
startGame(Mode, Board):-
	updateBoard(Board),
	playFirstMove(Mode, Board),
	updateBoard(Board), 
	updateGame(Board, 2, 1, Mode).

startGameTieBoard(Mode):-
	tiedBoard(Board),
	updateBoard(Board),
	playFirstMove(Mode, Board),
	updateBoard(Board), 
	updateGame(Board, 2, 1, Mode).

% Generates a random board to play
generateRandomBoard(Mode, T, Tile, Board):-
	Tile < 61,
	random(1, 9, Line),	
	random(1, 9, Col),
	getCell(T, Line, Col, Element), 
	NewLine is Line-1,
	NewCol is Col-1, !,	
	setNewBoardCell(Mode, T, NewLine, NewCol, Tile, Element, Board).

generateRandomBoard(Mode, _, _, Board):-
	setBlankCells(-1, Board, NewBoard),
	startGame(Mode, NewBoard).	

% Predicate to place a new tile in the board
setNewBoardCell(Mode, NewT, Line, Col, Tile, Element, _):-
	Element =:= -1,
	setCell(Line, Col, NewT, Tile, Board),
	NewTile is Tile+1,
	NewTile =:= 61,
	generateRandomBoard(Mode, _, NewTile, Board), !.

setNewBoardCell(Mode, NewT, Line, Col, Tile, Element, Board):-
	Element =:= -1,
	setCell(Line, Col, NewT, Tile, Board),
	NewTile is Tile+1,
	generateRandomBoard(Mode, Board, NewTile, _), !.

setNewBoardCell(Mode, NewT, _, _, Tile, Element, Board):-
	Element =\= -1,
	generateRandomBoard(Mode, NewT, Tile, Board).

%%%%%%%%%% Predicates to update the game cycle %%%%%%%%%%
% Player 1 makes the first play in the game
playFirstMove(Mode, T):-
	Mode =\= 4,				% Player 1 is Human
	playerInput(Mode, T, 1).

playFirstMove(Mode, T):-
	Mode =:= 4,				% Player 1 is computer
	write('Computer 1 is preparing a move!\n'),
	pressAnyKeyToContinue,
	computerFirstMove(Mode, T, 1).

computerFirstMove(Mode, T, P):-
	random(1, 3, Line),
	random(1, 3, Col),
	checkFirstMove(Mode, T, P, Line, Col).

% Updates the game
updateGame(_, _, _, _):-
	gameOver(Winner),					% Game is over					
	resetPlayersPosition,
	write('\n\nThe game is over!\n\n\n'),
	format('The winner of the game is Player ~w! ~n', [Winner]),
	pressAnyKeyToContinue, !, run.

updateGame(T, P1, P2, _):-
	isGameTied(T, P1, P2), !,			% Game ended as a Tie
	write('\n\nThe game is over!\n\n\n'),
	write('\n\nBoth players have not a valid move! The game ended as a Tie!\n\n\n'),
	pressAnyKeyToContinue, run.

updateGame(T, P1, P2, Mode):-
	canMove(T, P1, P2), !,				% Player P1 can make a valid move
	movePlayer(T, P1, P2, Mode),	
	updateBoard(T),
	updateGame(T, P2, P1, Mode).

updateGame(T, P1, P2, Mode):-
	format('Player ~w has no valid move avaiable, missing his turn! ~n', [P1]), % Player P1 can not make a legal move
	pressAnyKeyToContinue,
	updateBoard(T),
	updateGame(T, P2, P1, Mode).

% Predicate to move a player marker
% Human vs Human
movePlayer(T, P1, P2, Mode):-
	Mode =:= 1,
	playerInput(T, P1, P2, Mode), !.

% Human vs Computer level begginer
movePlayer(T, P1, P2, Mode):-
	Mode =:= 2,
	P1 =:= 1,
	playerInput(T, P1, P2, Mode), !.

movePlayer(T, P1, P2, Mode):-
	Mode =:= 2,
	P1 =:= 2,
	generateCompPlay(T, P1, P2, Mode), !.

% Human vs Computer level Advanced
movePlayer(T, P1, P2, Mode):-
	Mode =:= 3,
	P1 =:= 1,
	playerInput(T, P1, P2, Mode), !.

movePlayer(T, P1, P2, Mode):-
	Mode =:= 3,
	P1 =:= 2,
	generateCompPlay(T, P1, P2, Mode), !.

% Computer vs Computer
movePlayer(T, P1, P2, Mode):-
	Mode =:= 4,	
	generateCompPlay(T, P1, P2, Mode), !.

%%%%%%%%%% Generates a play for the computer %%%%%%%%%
generateCompPlay(T, P1, P2, Mode):-
	Mode =\= 3,											% Computer level Begginer
	format('Computer ~w is preparing a move! ~n', [P1]),
	pressAnyKeyToContinue,
	generateCompRandomPlay(T, P1, P2, Mode).

generateCompPlay(T, P1, P2, Mode):-
	Mode =:= 3,											% Computer level Advanced
	format('Computer ~w is preparing a move! ~n', [P1]),
	pressAnyKeyToContinue,
	generateCompAIPlay(T, P1, P2, Mode).

%%%%%%%%%% Generates a random play for the computer %%%%%%%%%
generateCompRandomPlay(T, P1, P2, Mode):-
	player(P1, P1Line, P1Col, _, _),
	LineMin is P1Line-1,
	LineMax is P1Line+2,
	ColMin is P1Col-1,
	ColMax is P1Col+2,
	random(LineMin, LineMax, Line),
	random(ColMin, ColMax, Col),
	checkMove(T, P1, P2, Line, Col, Mode).

%%%%%%%%%% AI play based in an greedy algorithm %%%%%%%%%%
% Player 1
generateCompAIPlay(T, P1, P2, Mode):-
	P1 =:= 1,
	player(P1, Line, Col, _, _),
	Line < 8,
	Col < 8,
	NewLine is Line+1,
	NewCol is Col+1, !,
	checkMove(T, P1, P2, NewLine, NewCol, Mode).

generateCompAIPlay(T, P1, P2, Mode):-
	P1 =:= 1,
	player(P1, Line, Col, _, _),
	Line =:= 8,
	Col < 8,
	NewCol is Col+1, !,
	checkMove(T, P1, P2, Line, NewCol, Mode).

generateCompAIPlay(T, P1, P2, Mode):-
	P1 =:= 1,
	player(P1, Line, Col, _, _),
	Line < 8,
	Col =:= 8,
	NewLine is Line+1, !,
	checkMove(T, P1, P2, NewLine, Col, Mode).

% Player 2
generateCompAIPlay(T, P1, P2, Mode):-
	P1 =:= 2,
	player(P1, Line, Col, _, _),
	Line > 1,
	Col < 8,
	NewLine is Line-1,
	NewCol is Col+1, !,
	checkMove(T, P1, P2, NewLine, NewCol, Mode).

generateCompAIPlay(T, P1, P2, Mode):-
	P1 =:= 2,
	player(P1, Line, Col, _, _),
	Line =:= 1,
	Col < 8,
	NewCol is Col+1, !,
	checkMove(T, P1, P2, Line, NewCol, Mode).

generateCompAIPlay(T, P1, P2, Mode):-
	P1 =:= 2,
	player(P1, Line, Col, _, _),
	Line > 1,
	Col =:= 8,
	NewLine is Line-1, !,
	checkMove(T, P1, P2, NewLine, Col, Mode).

%%%%%%%%%% Checks the validaty of a play %%%%%%%%%% 
% Check validaty of player input
checkFirstMove(_, T, P, Line, Col):-
    integer(Line),
    integer(Col),
    player(P, PLine, PCol, _, _),
    \+((Line =:= PLine, Col =:= PCol)),         % Player can not chose to move to the cell where is placed
    Line > 0, Line < 9, Col > 0, Col < 9,		% Player must move within the limits of the board
    (Line-PLine)=<1, (PLine-Line)=<1, (Col-PCol)=<1, (PCol-Col)=<1,
    getCell(T, Line, Col, Element),
	Element =\= 0, !,                           % Player can not move to a blank cell
    updatePlayer(P, Line, Col).

checkFirstMove(4, T, P, _, _):-
    computerFirstMove(4, T, P), !.

checkFirstMove(Mode, T, P, _, _):-
	Mode =\= 4,
    write('\nWrong play. Please try again!\n'),
    playerInput(Mode, T, P), !.

checkMove(T, P1, P2, Line, Col, Mode):-
    integer(Line),
    integer(Col),
    player(P1, P1Line, P1Col, _, _),
    Line > 0, Line < 9, Col > 0, Col < 9,		% Player must move within the limits of the board
    (Line-P1Line)=<1, (P1Line-Line)=<1, (Col-P1Col)=<1, (P1Col-Col)=<1, 
    getCell(T, Line, Col, Element),
	Element =\= 0, Element =\= 2, Element =\= 4, !,                           % Player can not move to a blank cell or starting cell
    validMove(T, P1, P2, Line, Col, Mode).

checkMove(T, P1, P2, _, _, Mode):-
    (Mode =:= 4; ((Mode =:= 2; Mode =:=3), P1 =:= 2)),
	generateCompRandomPlay(T, P1, P2, Mode), !.

checkMove(T, P1, P2, _, _, Mode):-
	Mode =\= 4,
    write('\nWrong play. Please try again!\n'),
    movePlayer(T, P1, P2, Mode), !.

%%%%%%%%%% Player moves %%%%%%%%%%
validMove(T, P1, P2, Line, Col, Mode):-
	player(P2, P2Line, P2Col, _, _),
	Line =:= P2Line, Col =:= P2Col, 				% Player can not move to an occupied cell
	(Mode =:= 4; ((Mode =:= 2; Mode =:=3), P1 =:= 2)), !,
	generateCompRandomPlay(T, P1, P2, Mode).

validMove(T, P1, P2, Line, Col, Mode):-
	player(P2, P2Line, P2Col, _, _),
	Line =:= P2Line, Col =:= P2Col, 				% Player can not move to an occupied cell
	Mode =\= 4, !,
	write('\nWrong play. Please try again!\n'), !,
	playerInput(T, P1, P2).

% Predicate for top left arrow
validMove(T, P1, P2, Line, Col, _):-
	player(P1, P1Line, P1Col, _, _),
	Line < P1Line, Col < P1Col,
	getPlayerTile(T, P2, Tile),
	tile(Tile, '\\', _, _, _, _, _, _, _, _),	
    updatePlayer(P1, Line, Col), nl, !.

% Predicate for top center arrow
validMove(T, P1, P2, Line, Col, _):-
	player(P1, P1Line, P1Col, _, _),
	Line < P1Line, Col =:= P1Col,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, '|', _, _, _, _, _, _, _),
    updatePlayer(P1, Line, Col), nl, !.

% Predicate for top right arrow
validMove(T, P1, P2, Line, Col, _):-
	player(P1, P1Line, P1Col, _, _),
	Line < P1Line, Col > P1Col,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, '/', _, _, _, _, _, _),
    updatePlayer(P1, Line, Col), nl, !.

% Predicate for mid left arrow
validMove(T, P1, P2, Line, Col, _):-
	player(P1, P1Line, P1Col, _, _),
	Line =:= P1Line, Col < P1Col,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, _, '-', _, _, _, _, _),
    updatePlayer(P1, Line, Col), nl, !.

% Predicate for mid right arrow
validMove(T, P1, P2, Line, Col, _):-
	player(P1, P1Line, P1Col, _, _),
	Line =:= P1Line, Col > P1Col,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, _, _, _, '-', _, _, _),
    updatePlayer(P1, Line, Col), nl, !.

% Predicate for bottom left arrow
validMove(T, P1, P2, Line, Col, _):-
	player(P1, P1Line, P1Col, _, _),
	Line > P1Line, Col < P1Col,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, _, _, _, _, '/', _, _),
    updatePlayer(P1, Line, Col), nl, !.

% Predicate for bottom center arrow
validMove(T, P1, P2, Line, Col, _):-
	player(P1, P1Line, P1Col, _, _),
	Line > P1Line, Col =:= P1Col,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, _, _, _, _, _, '|', _),
    updatePlayer(P1, Line, Col), nl, !.

% Predicate for bottom right arrow
validMove(T, P1, P2, Line, Col, _):-
	player(P1, P1Line, P1Col, _, _),
	Line > P1Line, Col > P1Col,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, _, _, _, _, _, _, '\\'),
    updatePlayer(P1, Line, Col), nl, !.

validMove(T, P1, P2, _, _, Mode):-
	(Mode =:= 4; ((Mode =:= 2; Mode =:=3), P1 =:= 2)), !,
	generateCompRandomPlay(T, P1, P2, Mode).

validMove(T, P1, P2, _, _, Mode):-
	Mode =\= 4, 
	write('\nWrong play. Please try again!\n'), !,
	movePlayer(T, P1, P2, Mode).

%%%%%%%%%% Predicate to check if the game is over %%%%%%%%%%
gameOver(Winner):-
	player(1, Line, Col, _, _),
	Line =:= 8, Col =:= 8,
	Winner = 1, !.

gameOver(Winner):-
	player(2, Line, Col, _, _),
	Line =:= 1, Col =:= 8,
	Winner = 2, !.

%%%%%%%%%% Predicate to check if the game in in a tie %%%%%%%%%%
isGameTied(T, P1, P2):-
	\+canMove(T, P1, P2),
	\+canMove(T, P2, P1).

%%%%%%%%%% Predicate to check if the player P1 has any valid move %%%%%%%%%%
canMove(T, P1, P2):-
	player(P1, Line, Col, _, _),
	NewLine is Line-1, NewCol is Col-1,
	NewLine > 0, NewLine < 9, NewCol > 0, NewCol < 9,
	getCell(T, NewLine, NewCol, Element),
	Element =\= 0, Element =\= 2, Element =\= 4,
	getPlayerTile(T, P2, Tile),
	tile(Tile, '\\', _, _, _, _, _, _, _, _), !.	

canMove(T, P1, P2):-
	player(P1, Line, Col, _, _),
	NewLine is Line-1, NewCol is Col,
	NewLine > 0, NewLine < 9, NewCol > 0, NewCol < 9,
	getCell(T, NewLine, NewCol, Element),
	Element =\= 0, Element =\= 2, Element =\= 4,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, '|', _, _, _, _, _, _, _), !.

canMove(T, P1, P2):-
	player(P1, Line, Col, _, _),
	NewLine is Line-1, NewCol is Col+1,
	NewLine > 0, NewLine < 9, NewCol > 0, NewCol < 9,
	getCell(T, NewLine, NewCol, Element),
	Element =\= 0, Element =\= 2, Element =\= 4,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, '/', _, _, _, _, _, _), !.

canMove(T, P1, P2):-
	player(P1, Line, Col, _, _),	
	NewLine is Line, NewCol is Col-1,
	NewLine > 0, NewLine < 9, NewCol > 0, NewCol < 9,
	getCell(T, NewLine, NewCol, Element),
	Element =\= 0, Element =\= 2, Element =\= 4,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, _, '-', _, _, _, _, _), !.

canMove(T, P1, P2):-
	player(P1, Line, Col, _, _),	
	NewLine is Line, NewCol is Col+1,
	NewLine > 0, NewLine < 9, NewCol > 0, NewCol < 9,
	getCell(T, NewLine, NewCol, Element),
	Element =\= 0, Element =\= 2, Element =\= 4,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, _, _, _, '-', _, _, _), !.

canMove(T, P1, P2):-
	player(P1, Line, Col, _, _),	
	NewLine is Line+1, NewCol is Col-1,
	NewLine > 0, NewLine < 9, NewCol > 0, NewCol < 9,
	getCell(T, NewLine, NewCol, Element),
	Element =\= 0, Element =\= 2, Element =\= 4,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, _, _, _, _, '/', _, _), !.

canMove(T, P1, P2):-
	player(P1, Line, Col, _, _),	
	NewLine is Line+1, NewCol is Col,
	NewLine > 0, NewLine < 9, NewCol > 0, NewCol < 9,
	getCell(T, NewLine, NewCol, Element),
	Element =\= 0, Element =\= 2, Element =\= 4,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, _, _, _, _, _, '|', _), !.

canMove(T, P1, P2):-
	player(P1, Line, Col, _, _),	
	NewLine is Line+1, NewCol is Col+1,
	NewLine > 0, NewLine < 9, NewCol > 0, NewCol < 9,
	getCell(T, NewLine, NewCol, Element),
	Element =\= 0, Element =\= 2, Element =\= 4,
	getPlayerTile(T, P2, Tile),
	tile(Tile, _, _, _, _, _, _, _, _, '\\'), !.


%%%%%%%%%% Updates the board %%%%%%%%%%
% Updates the board
updateBoard(T):-
	clearScreen,
	displayLogo,
	player(1, Line1, Col1, _, _), player(2, Line2, Col2, _, _), printBoard(T, Line1, Col1, Line2, Col2).

%%%%%%%%%% Updates the position of the player P %%%%%%%%%%
% Updates the player position
updatePlayer(P, Line, Col):-
	retract(player(P, _, _, _, _)), assert(player(P, Line, Col, _, _)).

%%%%%%%%%% Resets the positions of the players to the initial ones %%%%%%%%%%
resetPlayersPosition:-
	retract(player(1, _, _, Line1, Col1)), assert(player(1, 1, 1, Line1, Col1)),
	retract(player(2, _, _, Line2, Col2)), assert(player(2, 8, 1, Line2, Col2)).

%%%%%%%%%% Predicates to place the blank cells %%%%%%%%%%
setBlankCells(_, [], []).
setBlankCells(Value, [T|Ts], [NewT|NewTs]):-
	setRow(Value, T, NewT),
	setBlankCells(Value, Ts, NewTs).

setRow(_, [], []).
setRow(Value, [Value|Ts], [0|NewTs]):-
	setRow(Value, Ts, NewTs).

setRow(Value, [T|Ts], [T|NewTs]):-
	T=\= Value, setRow(Value, Ts, NewTs).


%%%%%%%%%% Predicates set e get for board manipulation %%%%%%%%%%
% Sets a new element in the board
setCell(0, Col, [T| Ts], NewElement, [NewT| Ts]):-
  setCell(Col, T, NewElement, NewT).

setCell(Row, Col, [T| Ts], NewElement, [T| NewTs]):-
  Row >  0,
  NewRow is Row - 1,
  setCell(NewRow, Col, Ts, NewElement, NewTs).


setCell(0, [_|Ts], NewElement, [NewElement|Ts]).
setCell(Col, [T|Ts], NewElement, [T|NewTs]):-
  Col > 0,
  NewCol is Col -1,
  setCell(NewCol, Ts, NewElement, NewTs).

% Gets an element of the board
getCell(Board, Row, Col, Element):-
	VarX is Row-1,
	VarY is Col-1,
    nth0(VarX, Board, List),
    nth0(VarY, List, Element).

% Get the tile where the player marker is placed
getPlayerTile(T, P, Tile):-
	player(P, PLine, PCol, _, _),
	getCell(T, PLine, PCol, Tile).