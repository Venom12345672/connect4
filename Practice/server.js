const http = require('http')
const fetch = require('node-fetch')
const webSocket = require('ws')

playerCount = 0
turn = 0
offset = 1
filledRow = [5,5,5,5,5,5,5]
state = [[-1,-1,-1,-1,-1,-1,-1,-1,-1],
		 [-1, 0, 0, 0, 0, 0, 0, 0,-1],
		 [-1, 0, 0, 0, 0, 0, 0, 0,-1],
		 [-1, 0, 0, 0, 0, 0, 0, 0,-1],
		 [-1, 0, 0, 0, 0, 0, 0, 0,-1],
	 	 [-1, 0, 0, 0, 0, 0, 0, 0,-1],
	     [-1, 0, 0, 0, 0, 0, 0, 0,-1],
	     [-1,-1,-1,-1,-1,-1,-1,-1,-1]]

playerColor = ['orange','blue','red']

const returnJSON = (a,b) => {
	return JSON.stringify({type: a, data: b})
}

const adjustRowCol = (msg,ws) => {
	const col = msg.data[1]
	msg.data.splice(0,1,filledRow[col])
	msg.data.splice(2,1,playerColor[ws.PlayerNumber])
	--filledRow[col]
	return msg.data
}

const changeTurn = (ws) => {
	if(ws.PlayerNumber == 1) {
		turn = 2
	} else {
		turn = 1
	}
}

const changeState = (msg,PlayerNumber) => {
	const row = msg.data[0]+offset
	const col = msg.data[1]+offset

	state[row][col] = PlayerNumber
}

const checkWin = (row,col,winCond) => {
	let count = 0
	row = row +offset
	col = col + offset
	console.log(winCond)


	
	
}



const wss = new webSocket.Server({port:8080})
console.log("Server Started...")
wss.on('connection', ws => {
	console.log("Client is connected")

	ws.on('message', async msg => {

		msg = JSON.parse(msg)

		if (msg.type == "name") {
			ws.PersonName = msg.data
			ws.PlayerNumber = (++playerCount)
			ws.send(returnJSON('playerNumber',playerCount.toString()))
			console.log(`Name: ${msg.data} Player Number: ${playerCount}`)

			if (playerCount == 2) {
				turn = 1
			}
		}

		if (msg.type == "move") {
			if(ws.PlayerNumber == turn) {
			
				msg.data = adjustRowCol(msg,ws)

				ws.send(returnJSON('validMove',msg.data))
				wss.clients.forEach(client => {
					if(client.PlayerNumber != ws.PlayerNumber) {
						client.send(returnJSON('change',msg.data))
					}
				})

				changeState(msg,ws.PlayerNumber)
				checkWin(msg.data[0],msg.data[1],ws.PlayerNumber)
				changeTurn(ws)
				console.log(state)

				
			} else {
				ws.send(returnJSON('inValidMove',msg.data))
			}
		}

	})

})


// // --> 4 steps
// 	for(let i=0; i<4;i++) {
// 		if(state[row][col+i] == winCond) {
// 			++count
// 		} else {
// 			break
// 		}
// 	}

// 	if(count == 4) {
// 		console.log(`Player ${winCond} won`)
// 	}
	
// 	// <-- 4 steps
// 	count = 0
// 	for(let i=0; i<4;i++) {
// 		if(state[row][col-i] == winCond) {
// 			++count
// 		} else {
// 			break
// 		}
// 	}

// 	if(count == 4) {
// 		console.log(`Player ${winCond} won`)
// 	}

// 	// |
// 	// V 4 steps
// 	count = 0
// 	for(let i=0; i<4;i++) {
// 		if(state[row+i][col] == winCond) {
// 			++count
// 		} else {
// 			break
// 		}
// 	}

// 	if(count == 4) {
// 		console.log(`Player ${winCond} won`)
// 	}

// 	// ^
// 	// | 4 steps
// 	count = 0
// 	for(let i=0; i<4;i++) {
// 		if(state[row-i][col] == winCond) {
// 			++count
// 		} else {
// 			break
// 		}
// 	}

// 	if(count == 4) {
// 		console.log(`Player ${winCond} won`)
// 	}

// 	// diagonally
// 	// N-E
// 	count = 0
// 	for(let i=0; i<4;i++) {
// 		if(state[row-i][col+1] == winCond) {
// 			++count
// 		} else {
// 			break
// 		}
// 	}

// 	if(count == 4) {
// 		console.log(`Player ${winCond} won`)
// 	}

// 	// N-W
// 	count = 0
// 	for(let i=0; i<4;i++) {
// 		if(state[row-i][col-1] == winCond) {
// 			++count
// 		} else {
// 			break
// 		}
// 	}

// 	if(count == 4) {
// 		console.log(`Player ${winCond} won`)
// 	}

// 	// S-E
// 	count = 0
// 	for(let i=0; i<4;i++) {
// 		if(state[row+i][col+1] == winCond) {
// 			++count
// 		} else {
// 			break
// 		}
// 	}

// 	if(count == 4) {
// 		console.log(`Player ${winCond} won`)
// 	}

// 	// S-W
// 	count = 0
// 	for(let i=0; i<4;i++) {
// 		if(state[row+i][col-1] == winCond) {
// 			++count
// 		} else {
// 			break
// 		}
// 	}

// 	if(count == 4) {
// 		console.log(`Player ${winCond} won`)
// 	}

	