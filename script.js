
        document.addEventListener('DOMContentLoaded', () => {
            const game = {
                state: {},

                init() {
                    this.state = this.getNewGameState();
                    this.createBoard();
                    this.renderPieces();
                    this.setupEventListeners();
                },

                getNewGameState() {
                    return {
                        turn: 'w',
                        selectedPieceId: null,
                        legalMoves: [],
                        kingInCheck: { w: false, b: false },
                        gameover: false,
                        pieces: {
                            w_king: { pos: '5_1', img: '&#9812;', type: 'king', color: 'w', moved: false },
                            w_queen: { pos: '4_1', img: '&#9813;', type: 'queen', color: 'w', moved: false },
                            w_bishop1: { pos: '3_1', img: '&#9815;', type: 'bishop', color: 'w', moved: false },
                            w_bishop2: { pos: '6_1', img: '&#9815;', type: 'bishop', color: 'w', moved: false },
                            w_knight1: { pos: '2_1', img: '&#9816;', type: 'knight', color: 'w', moved: false },
                            w_knight2: { pos: '7_1', img: '&#9816;', type: 'knight', color: 'w', moved: false },
                            w_rook1: { pos: '1_1', img: '&#9814;', type: 'rook', color: 'w', moved: false },
                            w_rook2: { pos: '8_1', img: '&#9814;', type: 'rook', color: 'w', moved: false },
                            w_pawn1: { pos: '1_2', img: '&#9817;', type: 'pawn', color: 'w', moved: false },
                            w_pawn2: { pos: '2_2', img: '&#9817;', type: 'pawn', color: 'w', moved: false },
                            w_pawn3: { pos: '3_2', img: '&#9817;', type: 'pawn', color: 'w', moved: false },
                            w_pawn4: { pos: '4_2', img: '&#9817;', type: 'pawn', color: 'w', moved: false },
                            w_pawn5: { pos: '5_2', img: '&#9817;', type: 'pawn', color: 'w', moved: false },
                            w_pawn6: { pos: '6_2', img: '&#9817;', type: 'pawn', color: 'w', moved: false },
                            w_pawn7: { pos: '7_2', img: '&#9817;', type: 'pawn', color: 'w', moved: false },
                            w_pawn8: { pos: '8_2', img: '&#9817;', type: 'pawn', color: 'w', moved: false },
                            b_king: { pos: '5_8', img: '&#9818;', type: 'king', color: 'b', moved: false },
                            b_queen: { pos: '4_8', img: '&#9819;', type: 'queen', color: 'b', moved: false },
                            b_bishop1: { pos: '3_8', img: '&#9821;', type: 'bishop', color: 'b', moved: false },
                            b_bishop2: { pos: '6_8', img: '&#9821;', type: 'bishop', color: 'b', moved: false },
                            b_knight1: { pos: '2_8', img: '&#9822;', type: 'knight', color: 'b', moved: false },
                            b_knight2: { pos: '7_8', img: '&#9822;', type: 'knight', color: 'b', moved: false },
                            b_rook1: { pos: '1_8', img: '&#9820;', type: 'rook', color: 'b', moved: false },
                            b_rook2: { pos: '8_8', img: '&#9820;', type: 'rook', color: 'b', moved: false },
                            b_pawn1: { pos: '1_7', img: '&#9823;', type: 'pawn', color: 'b', moved: false },
                            b_pawn2: { pos: '2_7', img: '&#9823;', type: 'pawn', color: 'b', moved: false },
                            b_pawn3: { pos: '3_7', img: '&#9823;', type: 'pawn', color: 'b', moved: false },
                            b_pawn4: { pos: '4_7', img: '&#9823;', type: 'pawn', color: 'b', moved: false },
                            b_pawn5: { pos: '5_7', img: '&#9823;', type: 'pawn', color: 'b', moved: false },
                            b_pawn6: { pos: '6_7', img: '&#9823;', type: 'pawn', color: 'b', moved: false },
                            b_pawn7: { pos: '7_7', img: '&#9823;', type: 'pawn', color: 'b', moved: false },
                            b_pawn8: { pos: '8_7', img: '&#9823;', type: 'pawn', color: 'b', moved: false }
                        }
                    };
                },

                createBoard() {
                    const gameBoard = document.getElementById('game');
                    gameBoard.innerHTML = '';
                    for (let y = 8; y >= 1; y--) {
                        for (let x = 1; x <= 8; x++) {
                            const cell = document.createElement('div');
                            cell.classList.add('game-cell');
                            cell.id = `${x}_${y}`;
                            cell.classList.add((x + y) % 2 === 0 ? 'black-cell' : 'white-cell');
                            gameBoard.appendChild(cell);
                        }
                    }
                },

                renderPieces() {
                    document.querySelectorAll('.game-cell').forEach(cell => cell.innerHTML = '');
                    for (const pieceId in this.state.pieces) {
                        const piece = this.state.pieces[pieceId];
                        if (piece.pos) {
                            document.getElementById(piece.pos).innerHTML = piece.img;
                        }
                    }
                },

                setupEventListeners() {
                    document.getElementById('game').addEventListener('click', (e) => this.handleCellClick(e));
                },

                handleCellClick(e) {
                    if (this.state.gameover) return;
                    const cellId = e.target.closest('.game-cell').id;
                    const pieceId = this.findPieceIdByPos(cellId);

                    if (this.state.selectedPieceId) {
                        const move = this.state.legalMoves.find(m => m.to === cellId);
                        if (move) {
                            this.makeMove(move);
                            this.changeTurn();
                        } else {
                            this.clearHighlights();
                            this.state.selectedPieceId = null;
                            if (pieceId && this.state.pieces[pieceId].color === this.state.turn) {
                                this.selectPiece(pieceId);
                            }
                        }
                    } else if (pieceId && this.state.pieces[pieceId].color === this.state.turn) {
                        this.selectPiece(pieceId);
                    }
                },
                
                selectPiece(pieceId) {
                    this.state.selectedPieceId = pieceId;
                    this.state.legalMoves = this.getLegalMovesForPiece(pieceId);
                    this.highlightMoves();
                },
                
                changeTurn() {
                    this.state.turn = this.state.turn === 'w' ? 'b' : 'w';
                    this.updateCheckStatus();
                    this.checkForGameOver();
                    this.updateTurnIndicator();
                },

                updateTurnIndicator() {
                    const turnDiv = document.getElementById('turn');
                    if(this.state.gameover) return;

                    const turnColor = this.state.turn === 'w' ? 'White' : 'Black';
                    turnDiv.classList.remove('check');
                    if (this.state.kingInCheck[this.state.turn]) {
                        turnDiv.textContent = `${turnColor} is in Check!`;
                        turnDiv.classList.add('check');
                    } else {
                        turnDiv.textContent = `${turnColor} to Move`;
                    }
                },
                
                makeMove(move) {
                    const piece = this.state.pieces[move.pieceId];
                    
                    if (move.isCapture) {
                        const capturedPieceId = this.findPieceIdByPos(move.to);
                        if(capturedPieceId) this.state.pieces[capturedPieceId].pos = null;
                    }
                    
                    piece.pos = move.to;
                    piece.moved = true;

                    if (move.isCastle) {
                        const rook = this.state.pieces[move.rookId];
                        rook.pos = move.rookTo;
                        rook.moved = true;
                    }

                    if (piece.type === 'pawn' && (move.to.endsWith('_8') || move.to.endsWith('_1'))) {
                        piece.type = 'queen';
                        piece.img = piece.color === 'w' ? '&#9813;' : '&#9819;';
                    }

                    this.clearHighlights();
                    this.state.selectedPieceId = null;
                    this.state.legalMoves = [];
                    this.renderPieces();
                },
                
                highlightMoves() {
                    this.clearHighlights();
                    document.getElementById(this.state.pieces[this.state.selectedPieceId].pos).classList.add('selected');
                    this.state.legalMoves.forEach(move => {
                        const cell = document.getElementById(move.to);
                        cell.classList.add(move.isCapture ? 'highlight-capture' : 'highlight-move');
                    });
                },

                clearHighlights() {
                    document.querySelectorAll('.game-cell').forEach(cell => {
                        cell.classList.remove('selected', 'highlight-move', 'highlight-capture', 'king-in-check');
                    });
                     // Re-apply check highlight if necessary
                    if (this.state.kingInCheck.w) document.getElementById(this.state.pieces['w_king'].pos)?.classList.add('king-in-check');
                    if (this.state.kingInCheck.b) document.getElementById(this.state.pieces['b_king'].pos)?.classList.add('king-in-check');
                },

                getLegalMovesForPiece(pieceId) {
                    const pseudoLegalMoves = this.generatePseudoLegalMovesForPiece(pieceId);
                    return pseudoLegalMoves.filter(move => {
                        const tempState = JSON.parse(JSON.stringify(this.state));
                        
                        // Simulate the move on the temporary state
                        const pieceToMove = tempState.pieces[move.pieceId];
                        if (move.isCapture) {
                            const capturedId = Object.keys(tempState.pieces).find(id => tempState.pieces[id].pos === move.to);
                            if(capturedId) tempState.pieces[capturedId].pos = null;
                        }
                        pieceToMove.pos = move.to;

                        // Check if the king of the moving player is under attack after the move
                        return !this.isKingInCheck(pieceToMove.color, tempState);
                    });
                },

                generatePseudoLegalMovesForPiece(pieceId) {
                    const piece = this.state.pieces[pieceId];
                    const moves = [];
                    const [x, y] = piece.pos.split('_').map(Number);
                    const color = piece.color;
                    const opponentColor = color === 'w' ? 'b' : 'w';

                    const addMove = (toX, toY, isCastle = false, rookInfo = {}) => {
                        if (toX < 1 || toX > 8 || toY < 1 || toY > 8) return;
                        const targetPos = `${toX}_${toY}`;
                        const targetPieceId = this.findPieceIdByPos(targetPos);
                        const isCapture = targetPieceId && this.state.pieces[targetPieceId].color === opponentColor;
                        
                        if (!targetPieceId || isCapture) {
                             moves.push({ pieceId, from: piece.pos, to: targetPos, isCapture, isCastle, ...rookInfo });
                        }
                    };
                    
                    const addSlidingMoves = (directions) => {
                        for (const [dx, dy] of directions) {
                            for (let i = 1; i < 8; i++) {
                                const newX = x + dx * i;
                                const newY = y + dy * i;
                                if (newX < 1 || newX > 8 || newY < 1 || newY > 8) break;
                                const targetPos = `${newX}_${newY}`;
                                const targetPieceId = this.findPieceIdByPos(targetPos);
                                if (targetPieceId) {
                                    if (this.state.pieces[targetPieceId].color === opponentColor) addMove(newX, newY);
                                    break;
                                }
                                addMove(newX, newY);
                            }
                        }
                    };

                    switch (piece.type) {
                        case 'pawn':
                            const dir = color === 'w' ? 1 : -1;
                            if (!this.findPieceIdByPos(`${x}_${y + dir}`)) {
                                addMove(x, y + dir);
                                if (!piece.moved && !this.findPieceIdByPos(`${x}_${y + 2 * dir}`)) addMove(x, y + 2 * dir);
                            }
                            [-1, 1].forEach(dx => {
                                const targetId = this.findPieceIdByPos(`${x + dx}_${y + dir}`);
                                if (targetId && this.state.pieces[targetId].color === opponentColor) addMove(x + dx, y + dir);
                            });
                            break;
                        case 'knight':
                            [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]].forEach(([dx, dy]) => addMove(x + dx, y + dy));
                            break;
                        case 'bishop': addSlidingMoves([[1, 1], [1, -1], [-1, 1], [-1, -1]]); break;
                        case 'rook': addSlidingMoves([[1, 0], [-1, 0], [0, 1], [0, -1]]); break;
                        case 'queen': addSlidingMoves([[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]); break;
                        case 'king':
                            [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => addMove(x + dx, y + dy));
                            if (!piece.moved && !this.state.kingInCheck[color]) {
                                const rookKingsideId = color === 'w' ? 'w_rook2' : 'b_rook2';
                                if (this.state.pieces[rookKingsideId] && !this.state.pieces[rookKingsideId].moved &&
                                    !this.findPieceIdByPos(`${x+1}_${y}`) && !this.findPieceIdByPos(`${x+2}_${y}`) &&
                                    !this.isSquareAttacked(`${x+1}_${y}`, opponentColor) && !this.isSquareAttacked(`${x+2}_${y}`, opponentColor)) {
                                    addMove(x + 2, y, true, { rookId: rookKingsideId, rookTo: `${x+1}_${y}` });
                                }
                                const rookQueensideId = color === 'w' ? 'w_rook1' : 'b_rook1';
                                if (this.state.pieces[rookQueensideId] && !this.state.pieces[rookQueensideId].moved &&
                                    !this.findPieceIdByPos(`${x-1}_${y}`) && !this.findPieceIdByPos(`${x-2}_${y}`) && !this.findPieceIdByPos(`${x-3}_${y}`) &&
                                    !this.isSquareAttacked(`${x-1}_${y}`, opponentColor) && !this.isSquareAttacked(`${x-2}_${y}`, opponentColor)) {
                                    addMove(x - 2, y, true, { rookId: rookQueensideId, rookTo: `${x-1}_${y}` });
                                }
                            }
                            break;
                    }
                    return moves;
                },
                
                updateCheckStatus() {
                    this.state.kingInCheck.w = this.isKingInCheck('w', this.state);
                    this.state.kingInCheck.b = this.isKingInCheck('b', this.state);
                },

                isKingInCheck(kingColor, state) {
                    const kingId = kingColor === 'w' ? 'w_king' : 'b_king';
                    const kingPos = state.pieces[kingId].pos;
                    const opponentColor = kingColor === 'w' ? 'b' : 'w';
                    return this.isSquareAttacked(kingPos, opponentColor, state);
                },

                isSquareAttacked(squarePos, attackerColor, state) {
                    for (const pieceId in state.pieces) {
                        const piece = state.pieces[pieceId];
                        if (piece.color === attackerColor && piece.pos) {
                            const pseudoMoves = this.generatePseudoLegalMovesForPiece.call({state: state, findPieceIdByPos: this.findPieceIdByPos}, pieceId);
                            if (pseudoMoves.some(move => move.to === squarePos)) {
                                return true;
                            }
                        }
                    }
                    return false;
                },
                
                checkForGameOver() {
                    const turn = this.state.turn;
                    let hasLegalMoves = false;
                    for (const pieceId in this.state.pieces) {
                        const piece = this.state.pieces[pieceId];
                        if (piece.color === turn && piece.pos) {
                            if (this.getLegalMovesForPiece(pieceId).length > 0) {
                                hasLegalMoves = true;
                                break;
                            }
                        }
                    }

                    if (!hasLegalMoves) {
                        this.state.gameover = true;
                        const turnDiv = document.getElementById('turn');
                        turnDiv.classList.add('game-over');
                        if (this.state.kingInCheck[turn]) {
                            const winner = turn === 'w' ? 'Black' : 'White';
                            turnDiv.textContent = `Checkmate! ${winner} wins!`;
                        } else {
                            turnDiv.textContent = 'Stalemate! Game is a draw.';
                        }
                    }
                },

                findPieceIdByPos(pos) {
                    return Object.keys(this.state.pieces).find(id => this.state.pieces[id].pos === pos);
                }
            };

            game.init();
        });
