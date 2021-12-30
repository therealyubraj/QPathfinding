class Grid {
    static discountFactor = 0.9;
    static learningRate = 1;
    static allDirs = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]
    ];

    constructor(w, h, start, end) {
        this.width = w;
        this.height = h;
        this.start = start[0] + start[1] * this.width;
        this.end = end[0] + end[1] * this.width;

        this.map = [];
        this.qVals = [];

        for (let i = 0; i < this.width * this.height; i++) {
            this.map[i] = 1;
            this.qVals[i] = {
                '1 0': 0,
                '-1 0': 0,
                '0 -1': 0,
                '0 1': 0
            };
        }

        this.randomizeQ();
    }

    randomizeQ() {
        for (let i = 0; i < this.width * this.height; i++) {
            if (this.map[i] != 0) {
                Object.keys(this.qVals[i]).forEach(d => {
                    this.qVals[i][d] = random() * 10;
                });
            }
        }
    }

    makeObstacles(arrObs) {
        for (let i = 0; i < arrObs.length; i++) {
            let ind = arrObs[i][0] + this.width * arrObs[i][1];
            this.map[ind] = 0;
        }
    }

    drawMap() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let ind = i + j * this.width;

                let gridColor = color(255, 255, 255);
                let textColor = color(0, 0, 0);

                if (this.map[ind] == 0) {
                    gridColor = color(255, 0, 0);
                    textColor = color(255, 255, 255);
                }

                if (this.start == ind) {
                    gridColor = color(0, 0, 255);
                    textColor = color(255, 255, 255);
                } else if (this.end == ind) {
                    gridColor = color(0, 255, 0);
                }

                let x = i * scale;
                let y = j * scale;

                stroke(textColor);
                fill(gridColor);
                rect(x, y, scale, scale);

                stroke(gridColor);
                textSize(scale / 3);
                fill(textColor);
                //text("(" + i + "," + j + ")", x, y + scale / 2);
            }
        }
    }

    isValid(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    isWall(x, y) {
        let ind = x + y * this.width;
        return this.map[ind] == 0;
    }

    performNextAction(agentX, agentY, randomPolicy = 0.1) {
        let availableDirs = [];

        Grid.allDirs.forEach(dir => {
            let newX = agentX + dir[0];
            let newY = agentY + dir[1];

            if (this.isValid(newX, newY) && !this.isWall(newX, newY)) {
                availableDirs.push(dir);
            }
        });

        if (random() < randomPolicy) {
            let randomInd = Math.floor(random() * availableDirs.length);
            let randomDir = availableDirs[randomInd];
            availableDirs = [];
            availableDirs.push(randomDir);
        }

        let bestMove = this.calcBestQ(agentX, agentY, availableDirs);

        let destX = agentX + bestMove.dir[0],
            destY = agentY + bestMove.dir[1];

        let R = 0;
        if (this.isEnd(destX, destY)) {
            R = 1;
        }

        let nextAvailableDirs = [];

        Grid.allDirs.forEach(dir => {
            let newX = destX + dir[0];
            let newY = destY + dir[1];

            if (this.isValid(newX, newY) && !this.isWall(newX, newY)) {
                nextAvailableDirs.push(dir);
            }
        });

        if (random() < randomPolicy) {
            let randomInd = Math.floor(random() * nextAvailableDirs.length);
            let randomDir = nextAvailableDirs[randomInd];
            nextAvailableDirs = [];
            nextAvailableDirs.push(randomDir);
        }

        let nextBestMove = this.calcBestQ(destX, destY, nextAvailableDirs);
        let curQ = this.qVals[agentX + agentY * this.width][bestMove.dir[0] + ' ' + bestMove.dir[1]];
        this.qVals[agentX + agentY * this.width][bestMove.dir[0] + ' ' + bestMove.dir[1]] += Grid.learningRate * (R + Grid.discountFactor * nextBestMove.Q - curQ);

        return bestMove.dir;
    }

    calcBestQ(x, y, dirs) {
        let bestMove = {
            Q: -Infinity,
            dir: [-1, -1]
        };
        let ind = x + y * this.width;
        dirs.forEach(d => {
            if (this.qVals[ind][d[0] + " " + d[1]] > bestMove.Q) {
                bestMove.Q = this.qVals[ind][d[0] + " " + d[1]];
                bestMove.dir = d;
            }
        });
        return bestMove;
    }

    isEnd(x, y) {
        return (x + y * this.width) == this.end;
    }

    getStart() {
        return [0, 0];
    }
}