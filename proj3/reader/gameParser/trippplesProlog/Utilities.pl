readLine(Buffer):-
    get_code(Ch),
    readAll(Ch, Chars),
    name(Buffer, Chars).

readAll(13, []).
readAll(10, []).
readAll(Ch, [Ch|Chars]):-
    get_code(NewCh),
    readAll(NewCh, Chars).

clearScreen:-
    write('\33\[2J').

cleanBuffer:-
    get_char(_).

pressAnyKeyToContinue:-
    write('\n\nPress any key to continue...\n\n'),
    get_code(_).