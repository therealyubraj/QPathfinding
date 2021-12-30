let scale = 50;

let grid;

let agent = [0, 0];
let paths = [];

function setup() {
    createCanvas(600, 600);
    grid = new Grid(10, 10, [0, 0], [9, 9]);
    grid.makeObstacles([
        [2, 0],
        [2, 1],
        [2, 2],
        [2, 3],
        [2, 4],
        [4, 5],
        [4, 6],
        [4, 7],
        [4, 8],
        [4, 9],
        [6, 0],
        [6, 1],
        [6, 2],
        [6, 3],
        [6, 4],
        [8, 5],
        [8, 6],
        [8, 7],
        [8, 8],
        [8, 9],
    ]);

    background(0);
    grid.drawMap();
    train();
}

function draw() {
    noLoop();
}

function train() {
    let iterations = 10000;

    for (let i = 0; i < iterations; i++) {
        console.log(i);
        let pathLength = 0;
        while (!grid.isEnd(agent[0], agent[1])) {
            let actionPerformed = grid.performNextAction(agent[0], agent[1]);
            agent[0] += actionPerformed[0], agent[1] += actionPerformed[1];
            pathLength++;
        }
        agent = [0, 0];
    }

    let bestPath = [];
    while (!grid.isEnd(agent[0], agent[1])) {
        let actionPerformed = grid.performNextAction(agent[0], agent[1], 0);
        agent[0] += actionPerformed[0], agent[1] += actionPerformed[1];

        bestPath.push([agent[0], agent[1]]);
    }
    agent = [0, 0];

    bestPath.forEach(p => {
        fill(0, 255, 0);
        rect(p[0] * scale, p[1] * scale, scale, scale);
    });
    console.log(bestPath);
}