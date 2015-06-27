var loader  =  { count: 0, loaded: 0 }

function  buildImages (a,b,c) {
	//weapon speed: world units per second
	;var imgList  =  {
			'fighter2': {'s':'fighter2', w:10, h:10, wep:[
				{ t:'laser2', x:-5.3, y:0.7 }
			]},
			'fighter1': {'s':'fighter1', w:10, h:10, wep:[
				{ s:1, t:'laser1', x:-1.167, y:4 },
				{ t:'laser1', x:-1.167, y:-4 },
				{ t:'laser1', x:-2.5, y:2.217 },
				{ t:'laser1', x:-2.5, y:-2.217 }
			]},
			'cruiser1': {'s':'cruiser1',w:12, h:15, wep:[
				{ t:'laser1', x:-4.3, y:2.75 },
				{ t:'laser1', x:-4.3, y:-2.75 },
			]},
			'laser1': {'s':'laser1',w:1, h:5},
			'laser2': {'s':'laser2',w:1, h:5},
			'bg': {}
		}
	imgList.bg.s = 'bg/10.jpg'
	//'bg/' + ⬠ (⚂ * 15) + '.jpg'
	
	
	for (var  i in imgList) {
		;var img  =  new  Image()
		;var O  =  imgList[i]
		O.img = img
		O.skew = undefined
		img.onload = imgLoad .bind (O)
		if (imgList[i].s.indexOf('.' )< 0) img.src = imgList[i].s + '.png'
		else  img.src = imgList[i].s
		loader.count++
	}
	return  imgList
}

function  imgLoad (a,b,c) {
	loader.loaded++
	this.skew = this.img.width / this.img.height
	if (loader.loaded == loader.count) {
		ctx.canvas.width  = window.innerWidth
		ctx.canvas.height = window.innerHeight
		setInterval (gameStep, 100)
		setInterval (drawSystem, 10)
	}
}

;var imgs  =  buildImages()

;var RAD  =  Math.PI/180

function  tick (a,b,c) { return  (new  Date).getTime() }

var  last = 0, FPS = Math.round(1000/60), skip = 0, frames = 0

function  drawSystem (a,b,c) {
	;var t  =  tick()
	if (last == 0) last = t
	if (t < (last + FPS)) { skip++ ; return  }
	last += FPS
	if (last < t - (FPS*3)) {
		last = t
		// ロ'override', t-last, FPS
	}
	frames++
		ctx.canvas.width  = window.innerWidth
		ctx.canvas.height = window.innerHeight
	ctx.clearRect(0, 0, can.width, can.height)
	screenW = ctx.canvas.width
	screenH = ctx.canvas.height
	draw()
}

window.onresize = function (e) {
//	ロ window.innerHeight, window.innerWidth
}


// ============================================================

;var zoom  =  1  ;var screenW  =  undefined  ;var screenH  =  undefined

var  x = 0, y = 0, deg = 3, laser_x = 0, laser_y = 0, laser_i = 0

;var ships  =  {}  ;var shipCount  =  0
;var bullets  =  []

function  addBullet      (sx,sy,dx,dy,speed) {
	bullets .push ({ sx:sx, sy:sy, dx:dx, dy:dy, speed:speed, life:0, born:(new Date().getTime()) })
}

function  findCloseEnemy (a,b,c) {
	;var min  =  9999999999
	;var target  =  undefined
	for (var  i in ships) {
		;var o  =  ships[i]
		if ((a.x > 0 && o.x < 0) || (a.x < 0 && o.x > 0)) {
			;var x  =  a.x - o.x
			;var y  =  a.y - o.y
			d = Math.sqrt(x*x + y*y)
			if (d < min) {
				min = d
				target = o
			}
		}
	}
	return  target
}

function  fireWeapon    (ship,wep,wepimg) {
	function  func (a,b,c) {
		return  a
		a = 1-a
		return  1-Math.sqrt(a)
	}
	;var x  =  ship.x + wepimg.x
	if (ship.x < 0) x = ship.x - wepimg.x
	;var T  =  1000
	;var e  =  findCloseEnemy(ship)
	;var O  =  { born:(new Date().getTime()), end: (new Date().getTime()) + T,
		img: wepimg,
		x: x,
		y: ship.y + wepimg.y,
		ex: e.x,
		ey: e.y,
		getN: function  (a,b,c) {
			return  func(((new Date().getTime()) - this.born) / T)
		} }
	bullets .push (O)
}

;var gameLastTime  =  0

function  gameStep (a,b,c) {
	if (gameLastTime == 0) gameLastTime = (new Date().getTime())
	;var d  =  (new Date().getTime()) - gameLastTime
	gameLastTime += d
	screenW = ctx.canvas.width
	screenH = ctx.canvas.height
	for (var  i in ships) {
		;var O  =  ships[i]
		 for(var j = 0; j < O.wep.length; j++){
			;var I  =  O.img.wep[j]
			;var W  =  O.wep[j]
			W.reload += d
			if (W.reload >= W.interval) {
				W.reload = 0
				fireWeapon(O, W, I)
			}
		}
	}
	;var R  =  bullets
	bullets = []
	;var A  =  R.length
	 for(var i = 0; i < R.length; i++){
		;var B  =  R[i]
		if ((new Date().getTime()) >= B.end) {
			// deleted
		} else  {
			bullets .push (B)
		}
	}
}

function  addShip    (left,sprite,y) {
	;var x  =  90
	if (left) x = -x
	;var O  =  { type: 'ship', img: imgs[sprite], x:x, y:y, wep: [] }
	;var interval  =  500 + Math.random() * 2500
	;var serial  =  0
	 for(var i = 0; i < O.img.wep.length; i++){
		O.wep .push ({ interval: interval, reload: serial += (interval / O.img.wep.length)/2
	//	, img: imgs[O.img.wepⁱ.t]
	})
	}
	ships[++shipCount] = O
}

function  addShips (a,b,c) {
	;var left  =  'fighter1 fighter1 cruiser1 cruiser1 cruiser1' .split (' ')
	;var right  =  'fighter2 fighter2 fighter2 fighter2' .split (' ')
	;var y  =  0
	 for(var i = 0; i < left.length; i++)addShip(true, left[i], y), y += 15
	;var y  =  0
	 for(var i = 0; i < right.length; i++)addShip(false, right[i], y), y += 15
	;var y  =  0
	 for(var i = 0; i < left.length; i++)addShip(true, left[i], y -= 15)
	;var y  =  0
	 for(var i = 0; i < right.length; i++)addShip(false, right[i], y -= 15)
}

addShips()

function  scaleToScreen  (pos) {
	screenSize = screenW
	worldSize = 100
	;var mul  =  (screenSize/2) / worldSize
	return  (pos * mul)
}

function  worldToScreen  (pos) {
	screenSize = screenW
	worldSize = 100
	;var mul  =  (screenSize/2) / worldSize
	return  (screenSize/2) + (pos * mul)
}

function  screenToWorld  (pos) {
	screenSize = screenW
	worldSize = 100
	;var mul  =  worldToScreen(1)
	return  pos * mul
}

document.body.onkeydown = function  (e) {
	;var k  =  e.keyIdentifier
	if (k == 'Left') zoom -= 0.1
	if (k == 'Right') zoom += 0.1
	if (k == 'Up') zoom *= 1.01
	if (k == 'Down') zoom /= 1.01
	if (k == 'U+0020') zoom = 1
}

function  drawSprite      (x0,y0,a,shipTurn,f) {
	;var x  =  worldToScreen(x0)
	;var y  =  worldToScreen(y0)
	;var z  =  1 / zoom
	ctx.translate(x, y)
	ctx.rotate(a * RAD)
	ctx.scale(z, z)
	if (shipTurn && x0 < 0) ctx.scale(-1, 1)
	f()
	if (shipTurn && x0 < 0) ctx.scale(-1, 1)
	ctx.scale(1/z, 1/z)
	ctx.rotate(-a * RAD)
	ctx.translate(-x, -y)
}

function  laserAB       (laser,x0,y0,x1,y1,step) {
	;var x  =  ((x1 - x0) * step) + x0
	;var y  =  ((y1 - y0) * step) + y0
	a = Math.atan2(y1-y0, x1-x0)
	a /= RAD
	a += 180
	drawSprite(x, y, a, false, function  (a,b,c) {
		;var w  =  30  ;var h  =  30
		ctx.drawImage(laser.img, -w/2, -h/2, w, h)
	})
}

function  draw (a,b,c) {
	ctx.drawImage(imgs.bg.img, 0, 0, screenW, screenH)
	for (var  i in ships) {
		;var o  =  ships[i]
		;var d  =  0
		drawSprite(o.x, o.y, d, true, function  (a,b,c) {
			;var w  =  o.img.w * o.img.skew
			;var h  =  o.img.h
			;var w1  =  scaleToScreen(w)
			;var h1  =  scaleToScreen(h)
			w *= (1/zoom)
			ctx.drawImage(o.img.img, -w1/2, -h1/2, w1, h1)
		})
	}
	 for(var i = 0; i < bullets.length; i++){
		;var o  =  bullets[i]
		;var x  =  worldToScreen(o.x)
		;var y  =  worldToScreen(o.y)
//		ctx.fillStyle = 'yellow'
//		ctx.fillRect(x-3, y-3, 6, 6)
		laserAB(imgs[o.img.t], o.x, o.y, o.ex, o.ey, o.getN())
	}
}
/*
TODO
2) rotating weapons
3) aim, fire
*/
