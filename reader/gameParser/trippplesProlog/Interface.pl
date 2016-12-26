%%%%%%%%%% Menus of the game %%%%%%%%%%

% Menu Starting
menuStartingGame:-
    displayLogo,
    write('\n\n\n\n\tWelcome to Trippples!!!\n\n\n\n'),
    pressAnyKeyToContinue, !, menuOptions.

% Menu Starting Options
menuOptions:-
    displayLogo,
    write('\n\n\n\t1-Start Game\n\n'),
    write('\n\t2-Exit Game\n\n\n\n'),
    read(Option),
    cleanBuffer,    
    checkMenuOptions(Option).

checkMenuOptions(Option):-
    integer(Option),
    Option =:= 1,
    clearScreen, !,
    menuGameOptions.

checkMenuOptions(Option):-
    integer(Option),
    Option =:= 2,
    throw('Exiting of Trippples...'), !.

checkMenuOptions(_):-
    displayLogo,
    write('\n\n\n\nError: Wrong option. Please try again.\n\n\n\n'),
    pressAnyKeyToContinue, !,
    menuOptions.

% Menu Game Options
menuGameOptions:-
    displayLogo,
    write('\n\n\n\t1-Human vs Human\n\n'),
    write('\n\t2-Human vs Comp\n\n'),
    write('\n\t3-Comp vs Comp\n\n'),
    write('\n\t4-Back\n\n'),
    write('\n\t5-Exit Game\n\n\n\n'),
    read(Option),
    cleanBuffer, 
    checkMenuGameOptions(Option).

checkMenuGameOptions(Option):-
    integer(Option),
    Option =:= 1,
    clearScreen, !,
    createGame(1).

checkMenuGameOptions(Option):-
    integer(Option),
    Option =:= 2,
    clearScreen, !,
    menuComputerLevel.

checkMenuGameOptions(Option):-
    integer(Option),
    Option =:= 3,
    clearScreen, !,
    createGame(4).

checkMenuGameOptions(Option):-
    integer(Option),
    Option =:= 4,
    clearScreen, !,
    menuOptions.

checkMenuGameOptions(Option):-
    integer(Option),
    Option =:= 5,
    throw('Exiting of Trippples...'), !.

checkMenuGameOptions(_):-
    displayLogo,
    write('\n\n\n\n\tWrong option. Please try again.\n\n\n\n'),
    pressAnyKeyToContinue, !,
    menuGameOptions.

checkGameMenuOptions(_):-
    displayLogo,
    write('\n\n\n\n\tWrong option. Please try again.\n\n\n\n'),
    pressAnyKeyToContinue, !,
    menuGameOptions.

% Menu to chose the Computer level
menuComputerLevel:-
    displayLogo,
    write('\n\n\n\t1-Begginer\n\n'),
    write('\n\t2-Advanced\n\n'),
    write('\n\t3-Back\n\n'),
    write('\n\t4-Exit Game\n\n\n\n'),
    read(Option),
    cleanBuffer, 
    checkMenuComputerLevel(Option).

checkMenuComputerLevel(Option):-
    integer(Option),
    Option =:= 1,
    clearScreen, !,
    createGame(2).

checkMenuComputerLevel(Option):-
    integer(Option),
    Option =:= 2,
    clearScreen, !,
    createGame(3).

checkMenuComputerLevel(Option):-
    integer(Option),
    Option =:= 3,
    clearScreen, !,
    menuGameOptions.

checkMenuComputerLevel(Option):-
    integer(Option),
    Option =:= 4,
    throw('Exiting of Trippples...'), !.

checkMenuComputerLevel(_):-
    displayLogo,
    write('\n\n\n\n\tWrong option. Please try again.\n\n\n\n'),
    pressAnyKeyToContinue, !,
    menuComputerLevel.

%%%%%%%%%% Gets player input %%%%%%%%%%
% Ask the user new marker position
playerInput(Mode, T, P):-
    nl, write('PLAYER '), write(P), nl,
    write('Horizontal coordinate:'), read(Col),
    write('Vertical coordinate'), read(Line),
    cleanBuffer,
    checkFirstMove(Mode, T, P, Line, Col).

playerInput(T, P1, P2, Mode):-
    nl, write('PLAYER '), write(P1), nl,
    write('Horizontal coordinate:'), read(Col),
    write('Vertical coordinate'), read(Line),
    cleanBuffer,
    checkMove(T, P1, P2, Line, Col, Mode).

%%%%%%%%%% Displays game title %%%%%%%%%%
% Prints the logo of the game
displayLogo:-   
    clearScreen, nl,
	write('#####################################'), nl, nl,
	write('####          TRIPPLES           ####'), nl, nl,
	write('#####################################'), nl, nl.

% Borders and column separators of the board
printRowSeparator:-
	write('#-----------------------------------#').

printDownBorder:-
	write('#####################################').

printBorder:-
    write('#').

printColSeparator:-
    write('|').

printTopBorder:-
	write('#####################################'), nl,
    write('#   |   |   |   |   |   |   |   |   #'), nl,
    write('#   | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 #'), nl,
    write('#   |   |   |   |   |   |   |   |   #'), nl,
    printRowSeparator, nl.

%%%%%%%%%% Displays game title %%%%%%%%%%
% Displays the game board
printBoard(T, X1, Y1, X2, Y2):-
	printTopBorder,
	displayBoard(T, 1, X1, Y1, X2, Y2).

displayBoard([], _, _, _, _, _).

displayBoard([T], Line, X1, Y1, X2, Y2):-    
    write('#   |'),
    displayTop(T),
    write('# '),
    write(Line),
    write(' |'),
    displayMid(T, Line, 1, X1, Y1, X2, Y2),
    write('#   |'),
    displayBottom(T),
    printDownBorder, nl.

displayBoard([T|Ts], Line, X1, Y1, X2, Y2):-        
    write('#   |'),    
    displayTop(T),
    write('# '),
    write(Line),
    write(' |'),
    displayMid(T, Line, 1, X1, Y1, X2, Y2),
    write('#   |'),
    displayBottom(T),
    printRowSeparator, nl,  
    NextLine is Line+1,      
    displayBoard(Ts, NextLine, X1, Y1, X2, Y2).   

% Displays top line of a tile
displayTop([]).

displayTop([C]):-
    tile(C, TopLeft, TopCenter, TopRight, _, _, _, _, _, _),    
    printCellLine(TopLeft, TopCenter, TopRight),
    printBorder, nl.

displayTop([C|Cs]):-
    tile(C, TopLeft, TopCenter, TopRight, _, _, _, _, _, _),
    printCellLine(TopLeft, TopCenter, TopRight),
    printColSeparator, 
    displayTop(Cs).

% Displays mid line of a tile
displayMid([C], Line, Col, X1, Y1, X2, Y2):-
    tile(C, _, _, _, MidLeft, MidCenter, MidRight, _, _, _),
    write(MidLeft),
    printPlayerCell(Line, Col, X1, Y1, X2, Y2, MidCenter),
    write(MidRight),
    printBorder, nl.

displayMid([C|Cs], Line, Col, X1, Y1, X2, Y2):-
    tile(C, _, _, _, MidLeft, MidCenter, MidRight, _, _, _),
    write(MidLeft),
    printPlayerCell(Line, Col, X1, Y1, X2, Y2, MidCenter),
    write(MidRight),
    printColSeparator,
    NextCol is Col + 1,
    displayMid(Cs, Line, NextCol, X1, Y1, X2, Y2).

% Displays bottom line of a tile
displayBottom([]).

displayBottom([C]):-
    tile(C, _, _, _, _, _, _, BottomLeft, BottomCenter, BottomRight),
    printCellLine(BottomLeft, BottomCenter, BottomRight), 
    printBorder, nl.

displayBottom([C|Cs]):-
    tile(C, _, _, _, _, _, _, BottomLeft, BottomCenter, BottomRight),
    printCellLine(BottomLeft, BottomCenter, BottomRight),
    printColSeparator,
    displayBottom(Cs).

% Display players

% Print player 1 marker
printPlayerCell(Line, Col, X1, Y1, _, _, _):-
    Line == X1,
    Col == Y1,
    write('1').

% Print player 2 marker
printPlayerCell(Line, Col, _, _, X2, Y2, _):-
    Line == X2,
    Col == Y2,    
    write('2').

% Prints the center of the tile, when not occupied by a player
printPlayerCell(_, _, _, _, _, _, MidCenter):-  
    write(MidCenter).

% Prints a tile line (each tile divided in 3 lines)
printCellLine(X, Y, Z):-
    write(X), write(Y), write(Z).