/** @type{HTMLCanvasElement} */
let tracer = document.getElementById('tracer')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')




let card = document.querySelector('.card')
let cosmosHeight = window.innerHeight
let cosmosWidth = window.innerWidth
const staggerFrames = 5
function determineWorldSize(width, height) {
    if (width > height) {

        return width
    } else {
        return height
    }

}


let timeToNextFrame = 0
let frameInterval = 500
let lastTime = 0
let cardIsDisplayed = false


let worldSize = determineWorldSize(cosmosWidth, cosmosHeight)
canvas.style.width = worldSize
canvas.style.height = worldSize
canvas.width = worldSize
canvas.height = worldSize

let cardWidth = worldSize / 3.5
let cardHeight = worldSize / 6
let jetEngineArray = []
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
        this.y = Math.random() * (canvas.height - this.height)
        this.angle = worldSize / 2
        this.angleSPeed = Math.random() * (0.05 + 0.01) + 0.05
        this.curve = ((canvas.width / 10))
        this.baseCollission = false
        this.rockShowerSpeed = Math.random() * (0.2 + 4) + 0.2
        this.playerSpeedX = worldSize / 900
        this.playerSpeedY = worldSize / 900
        this.exceleration = 0.02
        this.backgroundSpeed = 0.3
        this.praticlesSpeedX = Math.random() * 0.3 - 0.1;
        this.praticlesSpeedY = Math.random() * 0.3 - 0.1;
        this.spriteWidth = 550
        this.spriteHeight = 550
        this.frameX = 0
        this.frameY = 0
        this.bounce = 0
        this.displayHTML = false

    }
    // particles draw and  animation
    animateParticles() {
        this.x += this.praticlesSpeedX
        this.y += this.praticlesSpeedY
    }
    drawParticles() {
        ctx.fillStyle = 'blue'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.width, this.height, Math.PI * 2)
        ctx.fill()
    }
    // Background draw and  animation
    updateCosmosBackground() {
        if (this.x <= -this.width) {
            this.x = 0
        }
        this.x = Math.floor(this.x - this.backgroundSpeed)

    }
    drawBG() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
    }
    updateBackgroundPlanets() {
        this.x -= this.speed
        if (this.x + this.width < 0) {
            this.x = canvas.width
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
    // Main 3 planets animation
    updateBase() {
        // if (!this.baseCollission === true) {
        //     this.y += 1 * Math.sin(this.angle)
        //     if (animationFrame % 14 === 0) this.angle += this.angleSPeed
        // }



    }
    drawBase() {
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
        if (animationFrame % staggerFrames == 0) {
            if (this.frameX < 23) this.frameX++
            else this.frameX = 0
            ctx.strokeStyle = 'white'
            // ctx.strokeRect(this.x, this.y, this.width, this.height)
        }
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)

    }


    // player animation
    playerMovement() {
        ctx.strokeStyle = 'white'
        // ctx.strokeRect(this.x +(this.width*0.3), this.y+(this.height*0.3), this.width-(this.width*0.5), this.height-(this.height*0.5))

        updateTracer(this.x, this.y, this.width)
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





// Setup mainPlanets?
const basesArray = []
let baseGap = basesSize * 0.5
let baseA = (new Planet(`./assets/images/planets/BaseB.png`, basesSize))
baseA.x = baseGap
baseA.y = (worldSize / 2) + (basesSize * -0.5)
baseA.curve = basesSize
basesArray.push(baseA)

let baseB = (new Planet(`./assets/images/planets/BaseA.png`, basesSize))
baseB.x = (worldSize / 2) - baseGap
baseB.y = (worldSize / 2) + (basesSize * -0.5)
basesArray.push(baseB)

let baseC = (new Planet(`./assets/images/planets/BaseC.png`, basesSize))
baseC.x = worldSize - basesSize - baseGap
baseC.y = (worldSize / 2) + (basesSize * -0.5)
basesArray.push(baseC)

let light = (new Planet(`./assets/images/planets/light.png`, basesSize))
let lightSize = basesSize * 3
light.width = lightSize
light.height = lightSize
light.x = (-lightSize / 2)
light.y = (worldSize / 2 - (lightSize / 2))


// setup SpaceShip
let spaceShip = (new Planet("./assets/images/spaceship/spaceship.png", basesSize))
spaceShip.x = 0
spaceShip.y = worldSize - (basesSize * 1.1)


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
let rocks = Math.ceil(worldSize / 200)
let rockSizeMin = worldSize / 100
let rockSizeMax = worldSize / 500
for (let i = 0; i < rocks; i++) {
    let randomSize = Math.floor(Math.random() * (rockSizeMin + rockSizeMax) + rockSizeMin)
    let randomNumber = randomNUmberInArray(rocksImages)
    imageSrc = rocksImages[randomNumber]
    rockShower.push(new Planet(imageSrc, randomSize))
}


function randomNUmberInArray(array) {
    return Math.floor(Math.random() * ((array.length) - 0))
}

// create Player
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
            player.playerSpeedX = worldSize / 900
            break;
        case "d":// Right
            keys.d.pressed = false
            keys.d.exelarate = false
            player.playerSpeedX = worldSize / 900
            break;
        case "w":// UP
            keys.w.pressed = false
            keys.w.exelarate = false
            player.playerSpeedY = worldSize / 900
            break;
        case "s": // Down
            keys.s.pressed = false
            keys.s.exelarate = false
            player.playerSpeedY = worldSize / 900
            break;
    }

})



let particles
function jetEngine() {
    for (let i = 0; i < 100; i++) {
        particles = new Planet('./assets/images/Background/background.png', 100)
        particles.x = Math.random() * (0.2 + 4) + 0.2
        particles.y = Math.random() * (0.2 + 4) + 0.2
        jetEngineArray.push(particles)

    }
}
jetEngine()


function checkForCollision(rect1, rect2) {
    // ctx.strokeRect(rect1.x +(rect1.width*0.3), rect1.y+(rect1.height*0.3), rect1.width-(rect1.width*0.5), rect1.height-(rect1.height*0.5))
    if ((rect1.x + (rect1.width * 0.3)) > rect2.x + rect2.width ||
        (rect1.x + (rect1.width * 0.3)) + (rect1.width - (rect1.width * 0.5)) < rect2.x ||
        (rect1.y + (rect1.height * 0.3)) > rect2.y + rect2.height ||
        (rect1.y + (rect1.height * 0.3)) + (rect1.height - (rect1.height * 0.5)) < rect2.y) {
    } else {
        return true
    }
}


function updateHtmlFn() {
    updateHtml = false
    setTimeout(() => {
        updateHtml = true
    }, "1000")
}
let updateHtml = true

let soundsOBJ = {
    hit: [],
}
// soundsOBJ.hit.push(new Audio("./assets/sounds/Clank1.wav"))
// soundsOBJ.hit.push(new Audio("./assets/sounds/Clank2.wav"))
soundsOBJ.hit.push(new Audio("./assets/sounds/Clank3.wav"))
function animate(timestamp) {

    //collission


    let deltaTime = timestamp - lastTime;
    lastTime = timestamp
    timeToNextFrame += deltaTime
    if (timeToNextFrame > frameInterval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        background.drawBG()
        background.updateCosmosBackground()

        planetsArray.forEach(planet => {
            planet.updateBackgroundPlanets()
            planet.draw()
        })

        basesArray.forEach(basePlanet => {
            basePlanet.updateBase()
            basePlanet.drawBase()
        })

        if(!(checkForCollision(player, baseA, 0, 0))&&!(checkForCollision(player, baseB, 0, 0))&&!(checkForCollision(player, baseC, 0, 0))&&!(checkForCollision(player, spaceShip, 0, 0)))card.style.display='none'


        if (checkForCollision(player, baseA, 0, 0)) {
            if (updateHtml) {
                dispalyHTMLCard(card, 40, 10, cardWidth, cardHeight, 'BaseA', contentObj.cardA)
                updateHtmlFn()
            }
        }


        if (checkForCollision(player, baseB, 0, 0)) {
            if (updateHtml) {
                dispalyHTMLCard(card, 40, 40, cardWidth, cardHeight, 'BaseB', contentObj.cardB)
                updateHtmlFn()
            }
        }

        if (checkForCollision(player, baseC, 0, 0)) {
            if (updateHtml) {
                dispalyHTMLCard(card, 40, 70, cardWidth, cardHeight, 'BaseC', contentObj.cardC)
                updateHtmlFn()
            }
        }

        if(checkForCollision(player, spaceShip, 0, 0)) {
            if (updateHtml) {
                dispalyHTMLCard(card, 80, 10, cardWidth, cardHeight, 'BaseC', contentObj.spaceShip)
                updateHtmlFn()
            }
        }



        // jetEngineArray.forEach(particle => {
        //     particles.animateParticles()
        //     particles.drawParticles()
        // })
        spaceShip.draw()
        player.draw()
        player.playerMovement()

        rockShower.forEach(rock => {
            rock.spaceDebris()
            rock.draw()
            if (checkForCollision(player, rock)) {

                // soundsOBJ.hit[randomNUmberInArray(soundsOBJ.hit)].play()
                let randomSize = Math.floor(Math.random() * (rockSizeMin + rockSizeMax) + rockSizeMin)
                rock.x = Math.random() * (0 - worldSize) + 0
                rock.width = randomSize
                rock.height = randomSize
            }

        })

        light.draw()
    }

    animationFrame++
    requestAnimationFrame(animate)
}
animate(0)


// let particles = new Planet('./assets/images/Background/background.png', 10)
// particles.x = player.x + player.width / 2
// particles.y = player.y + player.height

function dispalyHTMLCard(card, offsetTop, OffsetLeft, width, height, className, content) {
    card.innerHTML = content
    card.classList.remove("BaseA", "BaseB", "BaseC")
    cardIsDisplayed = true
    card.style.display = 'flex'
    card.style.top = offsetTop + "%"
    card.style.left = OffsetLeft + "%"
    card.style.width = width
    card.style.height = height
    card.classList.add(className)
}

/**
 * 
 * 
 Offset H= 43
 offset Width=46
 total 250
 */

function resetMovement() {
    keys.a.pressed = false
    keys.d.pressed = false
    keys.s.pressed = false
    keys.w.pressed = false
    keys.a.exelarate = false
    keys.d.exelarate = false
    keys.s.exelarate = false
    keys.w.exelarate = false
    player.playerSpeedX = worldSize / 900
    player.playerSpeedY = worldSize / 900
}


let moveUp = document.querySelector('.up')
let moveDown = document.querySelector('.down')
let moveLeft = document.querySelector('.left')
let moveRight = document.querySelector('.right')
let braek = document.querySelector('.break')
let controls = document.querySelector('.controls')
controls.style.width = worldSize / 10;
controls.style.height = worldSize / 10;
if (worldSize > 1024) {
    controls.style.width = 80
    controls.style.height = 80

}

moveUp.addEventListener('click', function () {
    resetMovement()
    keys.w.pressed = true
    keys.w.exelarate = true
})

moveDown.addEventListener('click', function () {
    resetMovement()
    keys.s.pressed = true
    keys.s.exelarate = true
})

moveLeft.addEventListener('click', function () {
    resetMovement()
    keys.a.pressed = true
    keys.a.exelarate = true
})

moveRight.addEventListener('click', function () {
    resetMovement()
    keys.d.pressed = true
    keys.d.exelarate = true
})

braek.addEventListener('click', function () {
    resetMovement()
    player.image.src = "./assets/images/robotSprites/RobotMovement/idle.png"
})


function updateTracer(x, y, offset) {
    tracer.style.left = x
    tracer.style.top = y - offset * 3
    tracer.scrollIntoView()

}





let contentObj = {
    cardA: `<h5>Fight Club</h5>
    <div class="card-content-wrapp">
        <a target="_blank" href="https://borilvtodorov.github.io/boriltodorov.github.io/15-Fighters/index.html" class="card-img-holder"> <img class="card-img" src="./assets/images/otherProjectsImages/Fighting.png" alt=""> </a>
        <div class="card-text-holder"> 
          2D fighting Game. <br>
          Defeat enemies and upgrade your skills.<br>
          Get the highest score you can<br>
          -----------------------------<br>
          Build with HTML Canvas, JS
            
            
        </div>
    </div>`,
    cardB: `<h5>Color Match</h5>
    <div class="card-content-wrapp">
        <a target="_blank" href="https://borilvtodorov.github.io/boriltodorov.github.io/9-ColorMatch/ColorMatch.html" class="card-img-holder"> <img class="card-img" src="./assets/images/otherProjectsImages/Colors.PNG" alt=""> </a>
        <div class="card-text-holder"> 
          Color Match <br>
          Make the whole board one color<br>
          Solve the puzzle within the allowed moves<br>
          -----------------------------<br>
          Build with HTML, JS
            
            
        </div>
    </div>`,
    cardC: ` <h5>Black Jack</h5>
    <div class="card-content-wrapp">
        <a target="_blank" href="https://borilvtodorov.github.io/boriltodorov.github.io/6-BlackJack/BlackJack.html" class="card-img-holder"> <img class="card-img" src="./assets/images/otherProjectsImages/BlackJack.PNG" alt=""> </a>
        <div class="card-text-holder"> 
        8 deck Black Jack Simulator<br>
          Test your luck <br>
          Place your bet and play the dealer<br>
          <br>
          -----------------------------<br>
          Build with HTML, JS
        </div>
    </div>`,
    spaceShip:
    ` <h5>HTML, CSS, JS Website build</h5>
    <div class="card-content-wrapp">
        <a target="_blank" href="https://borilvtodorov.github.io/boriltodorov.github.io/12-ResponsiveWeb/index.html" class="card-img-holder"> <img class="card-img" src="./assets/images/otherProjectsImages/DesignWork2.PNG" alt=""> </a>
        <a target="_blank" href="https://borilvtodorov.github.io/boriltodorov.github.io/14-DesignWork/index.html" class="card-img-holder"> <img class="card-img" src="./assets/images/otherProjectsImages/DesignWork1.PNG" alt=""> </a>
    </div>`,
}
