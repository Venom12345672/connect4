
const returnJSON = (a,b) => {
	return JSON.stringify({type: a, data: b})
}

new Vue({
	template:
	`
	<div>
		<div class="grid">

			<div @click="change(0,0)" class="dot" v-bind:style="{'background-color': active[0][0]}"></div>
			<div @click="change(0,1)" class="dot" v-bind:style="{'background-color': active[0][1]}"></div>
			<div @click="change(0,2)" class="dot" v-bind:style="{'background-color': active[0][2]}"></div>
			<div @click="change(0,3)" class="dot" v-bind:style="{'background-color': active[0][3]}"></div>
			<div @click="change(0,4)" class="dot" v-bind:style="{'background-color': active[0][4]}"></div>
			<div @click="change(0,5)" class="dot" v-bind:style="{'background-color': active[0][5]}"></div>
			<div @click="change(0,6)" class="dot" v-bind:style="{'background-color': active[0][6]}"></div>
		 	
		 	<div @click="change(1,0)" class="dot" v-bind:style="{'background-color': active[1][0]}"></div>
			<div @click="change(1,1)" class="dot" v-bind:style="{'background-color': active[1][1]}"></div>
			<div @click="change(1,2)" class="dot" v-bind:style="{'background-color': active[1][2]}"></div>
			<div @click="change(1,3)" class="dot" v-bind:style="{'background-color': active[1][3]}"></div>
			<div @click="change(1,4)" class="dot" v-bind:style="{'background-color': active[1][4]}"></div>
			<div @click="change(1,5)" class="dot" v-bind:style="{'background-color': active[1][5]}"></div>
			<div @click="change(1,6)" class="dot" v-bind:style="{'background-color': active[1][6]}"></div>	

			<div @click="change(2,0)" class="dot" v-bind:style="{'background-color': active[2][0]}"></div>
			<div @click="change(2,1)" class="dot" v-bind:style="{'background-color': active[2][1]}"></div>
			<div @click="change(2,2)" class="dot" v-bind:style="{'background-color': active[2][2]}"></div>
			<div @click="change(2,3)" class="dot" v-bind:style="{'background-color': active[2][3]}"></div>
			<div @click="change(2,4)" class="dot" v-bind:style="{'background-color': active[2][4]}"></div>
			<div @click="change(2,5)" class="dot" v-bind:style="{'background-color': active[2][5]}"></div>
			<div @click="change(2,6)" class="dot" v-bind:style="{'background-color': active[2][6]}"></div>

			<div @click="change(3,0)" class="dot" v-bind:style="{'background-color': active[3][0]}"></div>
			<div @click="change(3,1)" class="dot" v-bind:style="{'background-color': active[3][1]}"></div>
			<div @click="change(3,2)" class="dot" v-bind:style="{'background-color': active[3][2]}"></div>
			<div @click="change(3,3)" class="dot" v-bind:style="{'background-color': active[3][3]}"></div>
			<div @click="change(3,4)" class="dot" v-bind:style="{'background-color': active[3][4]}"></div>
			<div @click="change(3,5)" class="dot" v-bind:style="{'background-color': active[3][5]}"></div>
			<div @click="change(3,6)" class="dot" v-bind:style="{'background-color': active[3][6]}"></div>

			<div @click="change(4,0)" class="dot" v-bind:style="{'background-color': active[4][0]}"></div>
			<div @click="change(4,1)" class="dot" v-bind:style="{'background-color': active[4][1]}"></div>
			<div @click="change(4,2)" class="dot" v-bind:style="{'background-color': active[4][2]}"></div>
			<div @click="change(4,3)" class="dot" v-bind:style="{'background-color': active[4][3]}"></div>
			<div @click="change(4,4)" class="dot" v-bind:style="{'background-color': active[4][4]}"></div>
			<div @click="change(4,5)" class="dot" v-bind:style="{'background-color': active[4][5]}"></div>
			<div @click="change(4,6)" class="dot" v-bind:style="{'background-color': active[4][6]}"></div>

			<div @click="change(5,0)" class="dot" v-bind:style="{'background-color': active[5][0]}"></div>
			<div @click="change(5,1)" class="dot" v-bind:style="{'background-color': active[5][1]}"></div>
			<div @click="change(5,2)" class="dot" v-bind:style="{'background-color': active[5][2]}"></div>
			<div @click="change(5,3)" class="dot" v-bind:style="{'background-color': active[5][3]}"></div>
			<div @click="change(5,4)" class="dot" v-bind:style="{'background-color': active[5][4]}"></div>
			<div @click="change(5,5)" class="dot" v-bind:style="{'background-color': active[5][5]}"></div>
			<div @click="change(5,6)" class="dot" v-bind:style="{'background-color': active[5][6]}"></div>
			
		</div>
	</div>
		
	`,
	data: {
		playerNo: "",
		ws: new WebSocket('ws://localhost:8080'),
		active: [ ['orange','orange','orange','orange','orange','orange','orange'],
				  ['orange','orange','orange','orange','orange','orange','orange'],
				  ['orange','orange','orange','orange','orange','orange','orange'],
				  ['orange','orange','orange','orange','orange','orange','orange'],
				  ['orange','orange','orange','orange','orange','orange','orange'],
				  ['orange','orange','orange','orange','orange','orange','orange']],
		name: ""
		
	},
	methods: {
		change(row,col) {
			if(this.active[row][col] == "orange") {
				if(this.playerNo == "1") {
					this.ws.send(returnJSON("move",[row,col,'']))
				} else {
					this.ws.send(returnJSON("move",[row,col,'']))
				}
			}
		},
		changeColor(recvMsg) {
			const row = recvMsg.data[0]
			const col = recvMsg.data[1]
			const color = recvMsg.data[2]
			this.active[row].splice(col,1,color)
		}
	},
	mounted() {
		this.ws.onopen = () => {
			this.name = prompt("Enter your Name: ")
			this.ws.send(returnJSON("name",this.name))
		}

		this.ws.onmessage = recvMsg => {

			recvMsg = JSON.parse(recvMsg.data)

			if(recvMsg.type == 'playerNumber') {
				this.playerNo = recvMsg.data
				alert(`You are Player Number ${this.playerNo}`)
			}
			 
			if(recvMsg.type == "validMove") {
				console.log(recvMsg.data)
				if(this.playerNo == "1") {
					this.changeColor(recvMsg)
				} else {
					this.changeColor(recvMsg)
				}
			}

			if(recvMsg.type == "inValidMove") {
				alert("WAIT FOR YOUR TURN")
			}

			if(recvMsg.type == "change") {
				this.changeColor(recvMsg)
			}
			
		}
	}
}).$mount(`#root`)

