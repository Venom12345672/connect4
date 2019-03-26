const http = require('http')
const fetch = require('node-fetch')
const webSocket = require('ws')

playerCount = 0
turn = 0
filledRow = [5,5,5,5,5,5,5]
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
				if(ws.PlayerNumber == 1)
				{
					turn = 2
				} else {
					turn = 1
				}
			} else {
				ws.send(returnJSON('inValidMove',msg.data))
			}
		}

	})

})