/** @type{HTMLCanvasElement} */
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let cosmosHeight = window.innerHeight
let cosmosWidth = window.innerWidth
function determineWorldSize(width, height) {
    if (width > height) {
        console.log(width);
        return width
    } else {
        console.log(height);
        return height
    }

}


let worldSize = determineWorldSize(cosmosWidth, cosmosHeight)

canvas.style.width = worldSize
canvas.style.height = worldSize
canvas.width = worldSize
canvas.height = worldSize


let basesSize = worldSize / 5
let numberOfPlanets = Math.ceil(worldSize / 40)
let planetSizeMax = 0.1
let planetSizeMin = numberOfPlanets / 1 // Lower number = bigger plannets
if (numberOfPlanets > 42) {
    numberOfPlanets = 42
}


let startPlanetRotation = false
let animationFrame = 0

class Planet {
    constructor(source, planetSize) {
        this.image = new Image()
        this.image.src = source
        this.speed = Math.random() * (0.1 + 1) + 0.1
        this.width = planetSize;
        this.height = planetSize;
        this.x = Math.random() * (canvas.width - this.width)
        // this.x2=this.width
        this.y = Math.random() * (canvas.height - this.height)
        this.angle = worldSize / 2
        this.angleSPeed = Math.random() * (0.05 + 0.01) + 0.05
        this.curve = ((canvas.width / 10))
        this.baseCollission = false
        this.rockShowerSpeed = Math.random() * (0.2 + 4) + 0.2
        this.playerSpeedX = 3
        this.playerSpeedY = 3
        this.exceleration = 0.05
        this.backgroundSpeed=0.3

    }
    updateCosmosBackground(){
        if(this.x<=-this.width){
            this.x=0
        }
        // if(this.x2<=-this.width){
        //     this.x2=this.width + this.x -this.backgroundSpeed
        // }
        this.x= Math.floor(this.x-this.backgroundSpeed)
        // this.x2= Math.floor(this.x2-this.backgroundSpeed)

    }
    drawBG(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x+ this.width,this.y, this.width, this.height)
    }
    updateBackgroundPlanets() {
        this.x -= this.speed
        if (this.x + this.width < 0) {
            this.x = canvas.width
        }

    }
    updateBase() {
        if (!this.baseCollission) {
            this.y += 3 * Math.sin(this.angle)
            if (animationFrame % 2 === 0) this.angle += this.angleSPeed
        }

    }
    spaceDebris() {
        this.x += this.rockShowerSpeed
        this.y += this.rockShowerSpeed
        if (this.x > worldSize) {
            this.x = -this.width
        } else if (this.y > worldSize) {
            this.y = -this.width
        }
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
   


    playerMovement() {
        if (this.playerSpeedX >= 10) this.playerSpeedX = 10
        if (this.playerSpeedY >= 10) this.playerSpeedY = 10

        if (keys.d.pressed) {
            movementAnimation(moveRightArray, this.playerSpeedX)
            if (keys.d.exelarate) this.playerSpeedX += this.exceleration
            this.x += this.playerSpeedX
            if (this.x > canvas.width) {
                this.x = 0 - this.width
            }
        }



        if (keys.a.pressed) {
            movementAnimation(moveLeftArray, this.playerSpeedX)
            if (keys.a.exelarate) this.playerSpeedX += this.exceleration
            this.x -= this.playerSpeedX
            if (this.x + this.width < 0) {
                this.x = (canvas.width)
            }
        }
        if (keys.w.pressed) {
            movementAnimation(moveUpArray, this.playerSpeedY)
            if (keys.w.exelarate) this.playerSpeedY += this.exceleration
            this.y -= this.playerSpeedY
            if (this.y < 0) {
                this.y = canvas.height
            }
        }
        if (keys.s.pressed) {
            movementAnimation(moveDownArray, this.playerSpeedY)
            if (keys.s.exelarate) this.playerSpeedY += this.exceleration
            this.y += this.playerSpeedY
            if (this.y > canvas.height) {
                this.y = 0 + (this.height * 2)
            }
        }

    }

}

let moveRightArray = [
    "./assets/images/robotSprites/RobotMovement/Right1.png",
    "./assets/images/robotSprites/RobotMovement/Right2.png",
    "./assets/images/robotSprites/RobotMovement/Right3.png",
    "./assets/images/robotSprites/RobotMovement/Right4.png"]
let moveLeftArray = [
    "./assets/images/robotSprites/RobotMovement/Left1.png",
    "./assets/images/robotSprites/RobotMovement/Left2.png",
    "./assets/images/robotSprites/RobotMovement/Left3.png",
    "./assets/images/robotSprites/RobotMovement/Left4.png"]
let moveUpArray = [
    "./assets/images/robotSprites/RobotMovement/Up1.png",
    "./assets/images/robotSprites/RobotMovement/Up2.png",
    "./assets/images/robotSprites/RobotMovement/Up3.png",
    "./assets/images/robotSprites/RobotMovement/Up4.png"
]
let moveDownArray = [
    "./assets/images/robotSprites/RobotMovement/Down-1.png",
    "./assets/images/robotSprites/RobotMovement/Down-2.png",
    "./assets/images/robotSprites/RobotMovement/Down-3.png",
    "./assets/images/robotSprites/RobotMovement/Down-4.png"
]
function movementAnimation(array, speed) {
    if (speed <= 3) {
        player.image.src = array[0]
    } else if (speed <= 5) {
        player.image.src = array[1]
    } else if (speed <= 7) {
        player.image.src = array[2]
    } else if (speed <= 9) {
        player.image.src = array[3]
    }
}
// create cosmos background

const planetsArray = []
const background = new Planet('./assets/images/Background/background.png', 3072)
// background.src = './assets/images/Background/background.png'

//  create planets//
for (let i = 0; i < numberOfPlanets; i++) {
    let randomSize = Math.floor(Math.random() * (planetSizeMax + planetSizeMin) + planetSizeMin)
    imageSrc = `./assets/images/planets/${i}.png`;
    planetsArray.push(new Planet(imageSrc, randomSize))
}


// Setup bases?
const basesArray = []
let baseA = (new Planet(`./assets/images/planets/24.png`, basesSize))
baseA.x = (worldSize / 2 - basesSize) - (basesSize / 2)
baseA.y = (worldSize / 2) + (basesSize * -0.5)
baseA.curve = basesSize
basesArray.push(baseA)

let baseB = (new Planet(`./assets/images/planets/6.png`, basesSize * 1.2))
baseB.curve = basesSize * 1.5
baseB.x = (worldSize / 2) - (basesSize / 2)
baseB.y = (worldSize / 2) + (basesSize * -0.5)
basesArray.push(baseB)

let baseC = (new Planet(`./assets/images/planets/16.png`, basesSize * 1.5))
baseC.curve = basesSize * 2
baseC.x = (worldSize / 2 + basesSize) - (basesSize / 2)
baseC.y = (worldSize / 2) + (basesSize * -0.5)
basesArray.push(baseC)

let light = (new Planet(`./assets/images/planets/light.png`, basesSize))
let lightSize = basesSize * 3
light.width = lightSize
light.height = lightSize
light.x = (-lightSize / 2)
light.y = (worldSize / 2 - (lightSize / 2))


//  rocks
const rocksImages = [
    "./assets/images/Rocks/Rock-1.png",
    "./assets/images/Rocks/Rock-2.png",
    "./assets/images/Rocks/Rock-3.png",
    "./assets/images/Rocks/Rock-4.png",
    "./assets/images/Rocks/Rock-5.png",
    "./assets/images/Rocks/Rock-6.png",
    "./assets/images/Rocks/Rock-7.png",
    "./assets/images/Rocks/Rock-8.png",]
const rockShower = []

// create Debris
let numberOfDebris = 1200
let debrisZizeMin = worldSize / 4000
let debrisZizeMax = worldSize / 500
for (let i = 0; i < numberOfDebris; i++) {
    let randomSize = Math.floor(Math.random() * (debrisZizeMin + debrisZizeMax) + debrisZizeMin)
    let randomNumber = randomNUmberInArray(rocksImages)
    imageSrc = rocksImages[randomNumber]
    planetsArray.push(new Planet(imageSrc, randomSize))
}


// create rockShower
let rocks = worldSize / 80
let rockSizeMin = worldSize / 300
let rockSizeMax = worldSize / 150
for (let i = 0; i < rocks; i++) {
    let randomSize = Math.floor(Math.random() * (rockSizeMin + rockSizeMax) + rockSizeMin)
    let randomNumber = randomNUmberInArray(rocksImages)
    imageSrc = rocksImages[randomNumber]
    rockShower.push(new Planet(imageSrc, randomSize))
}



function randomNUmberInArray(array) {
    return Math.floor(Math.random() * ((array.length) - 0))
}


// player moevement
let playerSize = worldSize * 0.08
const player = new Planet("./assets/images/robotSprites/RobotMovement/Down-1.png", playerSize)
player.x = (worldSize / 2 + playerSize) - (playerSize)
player.y = (worldSize * 0.35) + (playerSize * -0.5)


const keys = {
    a: {
        pressed: false,
        exelarate: false
    },
    d: {
        pressed: false,
        exelarate: false
    },
    s: {
        pressed: false,
        exelarate: false
    },
    w: {
        pressed: false,
        exelarate: false

    },
}

window.addEventListener('keydown', (event) => {


    switch (event.key) {
        case "a": // Left
            keys.a.pressed = true
            keys.a.exelarate = true
            break;
        case "d":// Right
            keys.d.pressed = true
            keys.d.exelarate = true
            break;
        case "w":// UP
            keys.w.pressed = true
            keys.w.exelarate = true
            break;
        case "s": // Down
            keys.s.pressed = true
            keys.s.exelarate = true
            break;
    }


})

window.addEventListener('keyup', (event) => {
    player.image.src = "./assets/images/robotSprites/RobotMovement/idle.png"

    switch (event.key) {
        case "a": // Left
            keys.a.pressed = false
            keys.a.exelarate = false
            player.playerSpeedX = 2
            break;
        case "d":// Right
            keys.d.pressed = false
            keys.d.exelarate = false
            player.playerSpeedX = 2
            break;
        case "w":// UP
            keys.w.pressed = false
            keys.w.exelarate = false
            player.playerSpeedY = 2
            break;
        case "s": // Down
            keys.s.pressed = false
            keys.s.exelarate = false
            player.playerSpeedY = 2
            break;
    }

})




let x = 0


function animate() {
    animationFrame++

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    x -= 0.2
    // ctx.drawImage(background, x, 0)
    background.drawBG()
    background.updateCosmosBackground()

    planetsArray.forEach(planet => {
        planet.updateBackgroundPlanets()
        planet.draw()
    })

    basesArray.forEach(basePlanet => {
        basePlanet.updateBase()
        basePlanet.draw()

    })
    player.draw()
    player.playerMovement()

    rockShower.forEach(rock => {
        rock.spaceDebris()
        rock.draw()

    })
    light.draw()
    console.log(player.y);
    console.log(worldSize);
    requestAnimationFrame(animate)
}
animate()

function cameraFollow(y) {
    window.scrollTo({
        top: y,
        // behavior: 'smooth'
    });
}



