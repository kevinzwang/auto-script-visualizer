class Move {
    constructor(args, bot, two) {
        this.bot = bot
        this.speed = 1.5
        this.error = this.speed
        if (isPoint(args)) {
            var pt = parsePoint(args)
            this.goalX = pt[0] + bot.originX
            this.goalY = bot.originY - pt[1]
        } else {
            this.goalX = Math.sin(bot.rotation) * args + bot.translation.x
            this.goalY = bot.translation.y - Math.cos(bot.rotation) * args
        }

        console.log("goal = (" + this.goalX + ", " + this.goalY + ")")
        this.dx = Math.abs(Math.sin(bot.rotation) * this.speed) * Math.sign(this.goalX - bot.translation.x)
        this.dy = Math.abs(Math.cos(bot.rotation) * this.speed) * Math.sign(this.goalY - bot.translation.y)
    }

    execute() {
        this.bot.translation.x += this.dx
        this.bot.translation.y += this.dy
        console.log("pos = (" + this.bot.translation.x + ", " + this.bot.translation.y + ")")
    }

    isFinished() {
        var xDist = this.bot.translation.x - this.goalX
        var yDist = this.bot.translation.y - this.goalY
        var totalDist = Math.sqrt(xDist * xDist + yDist * yDist)
        return (totalDist < this.error)
    }
}

class Turn {
    constructor(args, bot, two) {
        this.bot = bot
        this.speed = Math.PI / 90
        this.error = this.speed / 2

        if (isPoint(args)) {
            var pt = parsePoint(args)
            this.goal = Math.atan2(pt[0] - (bot.translation.x - bot.originX), pt[1] - (bot.originY - bot.translation.y))
        } else {
            this.goal = bot.rotation + args * Math.PI / 180
        }

        console.log("turn goal = " + this.goal)
        console.log("curr turn = " + bot.rotation)

        this.dt = this.speed * Math.sign(this.goal - bot.rotation)
    }

    execute() {
        this.bot.rotation += this.dt
        console.log("rot = " + this.bot.rotation)
    }

    isFinished() {
        return (this.bot.rotation > this.goal - this.error && this.bot.rotation < this.goal + this.error)
    }
}

class Eject {
    constructor(args, bot, two, cube) {
        this.two = two
        this.cubeX = -Math.sin(bot.rotation) * cube.translation.y + bot.translation.x
        this.cubeY = Math.cos(bot.rotation) * cube.translation.y + bot.translation.y
        bot.remove(cube)
        // console.log("cube pos: (" + cubeX + ", " + cubeY + ")")

    }

    dropCube() {
        return makeCube(this.two, this.cubeX, this.cubeY)
    }

    execute() { }
    isFinished() { return true }
}

class Intake {
    constructor(args, bot, two) {
        this.cube = makeInitCube(two, bot)
        bot.add(this.cube)
    }

    getCube() {
        return this.cube
    }

    execute() { }
    isFinished() { return true }
}

class Wait {
    constructor(args, bot, two) {
        this.waitTime = args * 60
    }

    execute() {
        this.waitTime--
    }

    isFinished() {
        return (this.waitTime <= 0)
    }
}