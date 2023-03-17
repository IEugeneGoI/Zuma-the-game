
/*------------------------------------------------------------------------------Model---------------------------------------------------------------------------------------------------------- */

class CanvasModel {
    constructor() {
        this.settings = new Level();
        this.data = this.settings.getData();
        this.level = this.data.level;
        this.levelBg = this.data.levelBg;
        this.colors = this.data.ballsColor;
        this.totalBalls = this.data.totalBalls;
        this.ratio = 360 / 640;
        this.createFieldSize();
        this.frog = this.createFrog();
        this.shot = this.createShot();
        this.ballRadius = this.createBall();
        this.track = this.createTrack();
    }

    createFieldSize() {
        let windowRatio = (innerWidth > innerHeight) ? innerHeight / innerWidth : innerWidth / innerHeight;

        let width;
        let height;

        if (innerWidth > 1280 && innerHeight > 820) {
            width = 1280;
            height = 820;
        } else if (innerWidth < 640 && innerHeight < 360) {
            width = 640;
            height = 360;
        } else if (windowRatio < this.ratio) {

            if (innerWidth < 589 && innerHeight > 360) {
                width = 589;
                height = width * this.ratio
            } else if (innerHeight < 360 && innerWidth > 640) {
                height = 360;
                width = height / this.ratio
            } else {

                height = innerHeight;
                width = height / this.ratio;
            }
        } else {
            width = innerWidth;
            height = width * this.ratio;
        }

        this.canvasWidth = width;
        this.canvasHeight = height;
    }

    createBall() {
        return this.canvasWidth / 70;
    }

    createShot() {
        return {
            radius: this.canvasWidth / 70,
            left: this.canvasWidth / this.data.offsetFrogLeft + this.canvasWidth / 6.15 / 2,
            top: this.canvasHeight / this.data.offsetFrogTop + this.canvasWidth / 6.15 / 2,
        }
    }

    createFrog() {
        return {
            width: this.canvasWidth / 6.15,
            height: this.canvasWidth / 6.15,
            left: this.canvasWidth / this.data.offsetFrogLeft,
            top: this.canvasHeight / this.data.offsetFrogTop,
        }
    }

    createTrack() {
        let track = this.settings.getTrack();
        let ratioW = this.canvasWidth / 1280;
        let ratioH = this.canvasHeight / 820;
        let newtrack = [];

        for (let i = 0; i < track.length; i++) {
            newtrack.push({x: track[i].x * ratioW, y: track[i].y * ratioH});
        }

        return newtrack;
    }

    updateSize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
    }
}

class BallModel extends CanvasModel {
    constructor() {
        super();
        this.trackSection = 0;
        this.ballsColor = this.colors;
        this.width = this.canvasWidth;
        this.height = this.canvasHeight;
        this.color = 0;
        this.getRandomColor();
    }

    createPosition(index) {
        this.trackSection = index;
        this.x = this.track[this.trackSection].x;
        this.y = this.track[this.trackSection].y;
    }

    getRandomColor() {
        let randomColor = Math.floor(Math.random() * this.colors.length);
        this.color = this.colors[randomColor];
    }

    getTrackSection() {
        return this.trackSection;
    }

    updateSize(width, height) {
        this.ballRadius = width / 63;
        let track = this.track;
        let ratioW = width / this.width;
        let ratioH = height / this.height;

        let newtrack = [];
        for (let i = 0; i < track.length; i++) {
            newtrack.push({x: track[i].x * ratioW, y: track[i].y * ratioH});
        }

        if (newtrack.length === this.track.length) {
            this.track = newtrack;
            this.width = width;
            this.height = height;
        }
    }

    update(speed) {
        let index = this.trackSection + speed;
        this.createPosition(index);
    }
}

class FrogModel extends CanvasModel {
    constructor() {
        super();
        this.frogAngle = 0;
        this.shotSpeed = 0;
        this.shotAngle = 0;
        this.shotState = 0;
        this.down = 0;

        this.shotRadius = this.shot.radius;
        this.shotLeft = this.shot.left;
        this.shotTop = this.shot.top;
        this.color = 0;
        this.canShoot = false;

        this.secondShotLeft = this.shot.left;
        this.secondShotTop = this.shot.top;
        this.secondShotColor = 0;

        this.frogWidth = this.frog.width;
        this.frogHeight = this.frog.height;
        this.frogLeft = this.frog.left;
        this.frogTop = this.frog.top;

        this.getRandomColor();
        this.getRandomSecondShotColor();
    }

    getRandomColor() {
        let randomColor = Math.floor(Math.random() * this.colors.length);
        this.color = this.colors[randomColor];
    }

    getRandomSecondShotColor() {
        let randomColor = Math.floor(Math.random() * this.colors.length);
        this.secondShotColor = this.colors[randomColor];
    }

    updateFrogAngle(x, y) {
        this.frogAngle = Math.atan2(
            -(x - (this.frogLeft + this.frogWidth / 2)),
            (y - (this.frogTop + this.frogHeight / 2))
        );
    }

    updateShotAngle(x, y) {
        this.shotAngle = Math.atan2(
            (x - (this.frogLeft + this.frogWidth / 2)),
            (y - (this.frogTop + this.frogHeight / 2))
        );
    }

    updateShot() {
        this.shotLeft += Math.sin(this.shotAngle) * this.shotSpeed;
        this.shotTop += Math.cos(this.shotAngle) * this.shotSpeed;
    }

    updateSize(width, height) {
        this.frogWidth = width / 6.15;
        this.frogHeight = width / 6.15;
        this.shotRadius = width / 63;
        this.frogLeft = width / this.data.offsetFrogLeft;
        this.frogTop = height / this.data.offsetFrogTop;
        this.shotLeft = this.frogLeft + this.frogWidth / 2;
        this.shotTop = this.frogTop + this.frogHeight / 2;
        this.secondShotLeft =  this.frogLeft + this.frogWidth / 2;
        this.secondShotTop =  this.frogTop + this.frogHeight / 2;
    }

    stopShot() {
        this.shotState = 0;
        this.shotSpeed = 0;
        this.shotAngle = -this.frogAngle;
        this.shotLeft = this.frogLeft + this.frogWidth / 2;
        this.shotTop = this.frogTop + this.frogHeight / 2;
        this.down = 0;
        this.color = this.secondShotColor;

        this.getRandomSecondShotColor();

        if (this.colors.length === 1) {
            this.color = this.secondShotColor;

            this.getRandomSecondShotColor();
        }
    }

    restartShot() {
        this.shotSpeed = 0;
        this.shotState = 0;
        this.shotAngle = -this.frogAngle;
        this.shotLeft = this.frogLeft + this.frogWidth / 2;
        this.shotTop = this.frogTop + this.frogHeight / 2;
        this.color = this.secondShotColor;

        this.getRandomSecondShotColor();
    }
}

class Level {
    constructor() {
        this.level = this.getLevel();
        this.data = data[this.level];
        this.track = new Track(this.level).getTrack();
    }

    getData() {
        return this.data;
    }

    getTrack() {
        return this.track;
    }

    getLevel() {
        let canvas = document.getElementById('canvas');
        return +(canvas.getAttribute('level'));
    }
}

class Bezier {
    step;
    point0;
    point1;
    point2;
    ax;
    ay;
    bx;
    by;
    A;
    B;
    C;
    totalLength;

    init(point0, point1, point2, speed) {
        this.point0 = point0;
        this.point1 = point1;
        this.point2 = point2;

        this.ax = this.point0.x - 2 * this.point1.x + this.point2.x;
        this.ay = this.point0.y - 2 * this.point1.y + this.point2.y;
        this.bx = 2 * this.point1.x - 2 * this.point0.x;
        this.by = 2 * this.point1.y - 2 * this.point0.y;

        this.A = 4 * (Math.pow(this.ax, 2) + Math.pow(this.ay, 2));
        this.B = 4 * (this.ax * this.bx + this.ay * this.by);
        this.C = Math.pow(this.bx, 2) + Math.pow(this.by, 2);

        this.totalLength = this.length(1);
        this.step = Math.floor(this.totalLength / speed);

        if (this.totalLength % speed > speed / 2) {
            this.step++;
        }

        return this.step;
    }

    speed(t) {
        return Math.sqrt(this.A * t * t + this.B * t + this.C);
    }

    length(t) {
        let temp1 = Math.sqrt(this.C + t * (this.B + this.A * t));
        let temp2 = (2 * this.A * t * temp1 + this.B * (temp1 - Math.sqrt(this.C)));
        let temp3 = Math.log(this.B + 2 * Math.sqrt(this.A) * Math.sqrt(this.C));
        let temp4 = Math.log(this.B + 2 * this.A * t + 2 * Math.sqrt(this.A) * temp1);
        let temp5 = 2 * Math.sqrt(this.A) * temp2;
        let temp6 = (this.B * this.B - 4 * this.A * this.C) * (temp3 - temp4);

        return (temp5 + temp6) / (8 * Math.pow(this.A, 1.5));
    }

    invertL(t, l) {
        let t1 = t;
        let t2;

        do {
            t2 = t1 - (this.length(t1) - l) / this.speed(t1);
            if (Math.abs(t1 - t2) < 0.000001) break;
            t1 = t2;
        } while (true);

        return t2;
    }

    getPoint(x, y) {
        return {x: x, y: y};
    }

    getAnchorPoint(index) {
        if (index >= 0 && index <= this.step) {
            let t = index / this.step;
            let l = t * this.totalLength;
            t = this.invertL(t, l);

            let xx = Math.pow(1 - t, 2) * this.point0.x + 2 * (1 - t) * t * this.point1.x + t * t * this.point2.x;
            let yy = Math.pow(1 - t, 2) * this.point0.y + 2 * (1 - t) * t * this.point1.y + t * t * this.point2.y;

            let Q0 = this.getPoint(
                (1 - t) * this.point0.x + t * this.point1.x,
                (1 - t) * this.point0.y + t * this.point1.y);

            let Q1 = this.getPoint(
                (1 - t) * this.point1.x + t * this.point2.x,
                (1 - t) * this.point1.y + t * this.point2.y);

            let dx = Q1.x - Q0.x;
            let dy = Q1.y - Q0.y;
            let radians = Math.atan2(dy, dx);
            let degrees = radians * 180 / Math.PI;

            return {x: xx, y: yy, degrees: degrees};
        } else {
            return {};
        }
    }
}

let data = {
    '1' : {
        level: 1,
        levelBg: './images/level/1.jpg',
        ballsColor: [
            './images/ball/blue.jpg',
            './images/ball/white.jpg',
            './images/ball/purple.jpg',
            './images/ball/yellow.jpg',
            './images/ball/red.jpg',
            './images/ball/green.jpg'
        ],
        offsetFrogLeft : 2.25,
        offsetFrogTop : 2.75,
        totalBalls: 130,
        points: [
            {"x": -50, "y": 247}, {"x": 190, "y": 130}, {"x": 492, "y": 83}, 
            {"x": 510, "y": 77}, {"x": 620, "y": 68}, {"x": 726, "y": 62}, 
            {"x": 820, "y": 74}, {"x": 892, "y": 90}, {"x": 968, "y": 120}, 
            {"x": 1055, "y": 162}, {"x": 1142, "y": 239}, {"x": 1187, "y": 296},
            {"x": 1216, "y": 426}, {"x": 1175, "y": 451}, {"x": 1159, "y": 463},
            {"x": 1100, "y": 467}, {"x": 1083, "y": 461}, {"x": 1036, "y": 412}, 
            {"x": 960, "y": 287}, {"x": 944, "y": 264}, {"x": 885, "y": 210}, 
            {"x": 815, "y": 179}, {"x": 790, "y": 170}, {"x": 766, "y": 163}, 
            {"x": 678, "y": 159}, {"x": 603, "y": 169}, {"x": 406, "y": 205},
            {"x": 422, "y": 201}, {"x": 280, "y": 240}, {"x": 272, "y": 248}, 
            {"x": 153, "y": 303}, {"x": 109, "y": 350}, {"x": 60, "y": 421}, 
            {"x": 57, "y": 460}, {"x": 56, "y": 466}, {"x": 78, "y": 599}, 
            {"x": 97, "y": 633}, {"x": 157, "y": 690}, {"x": 180, "y": 705},
            {"x": 280, "y": 736}, {"x": 366, "y": 748}, {"x": 491, "y": 751}, 
            {"x": 674, "y": 749}, {"x": 797, "y": 736}, {"x": 925, "y": 710}, 
            {"x": 1067, "y": 661}, {"x": 1122, "y": 618}, {"x": 1134, "y": 587}, 
            {"x": 1133, "y": 571}, {"x": 1096, "y": 532}, {"x": 1043, "y": 512},
            {"x": 976, "y": 510}, {"x": 903, "y": 545}, {"x": 796, "y": 612}, 
            {"x": 681, "y": 654}, {"x": 573, "y": 662}, {"x": 463, "y": 649}, 
            {"x": 338, "y": 610}, {"x": 284, "y": 573}, {"x": 263, "y": 544}, {"x": 250, "y": 480}
        ],
    },
    '2' : {
        level: 2,
        levelBg: './images/level/2.jpg',
        ballsColor: [
            './images/ball/blue.jpg',
            './images/ball/white.jpg',
            './images/ball/purple.jpg',
            './images/ball/yellow.jpg',
            './images/ball/red.jpg',
            './images/ball/green.jpg'
        ],
        offsetFrogLeft : 1.63,
        offsetFrogTop : 2.82,
        totalBalls: 130,
        points: [
            {"x": 1400, "y": 82}, {"x": 911, "y": 55},  {"x": 621, "y": 75},
            {"x": 449, "y": 91}, {"x": 291, "y": 141}, {"x": 191, "y": 187},
            {"x": 120, "y": 252}, {"x": 78, "y": 318}, {"x": 55, "y": 449},
            {"x": 92, "y": 530}, {"x": 141, "y": 592}, {"x": 269, "y": 663},
            {"x": 460, "y": 729}, {"x": 644, "y": 762}, {"x": 844, "y": 777},
            {"x": 936, "y": 771}, {"x": 1048, "y": 746}, {"x": 1101, "y": 703},
            {"x": 1104, "y": 678}, {"x": 1085, "y": 665}, {"x": 991, "y": 673},
            {"x": 876, "y": 693}, {"x": 719, "y": 686}, {"x": 497, "y": 651},
            {"x": 333, "y": 589}, {"x": 254, "y": 528}, {"x": 217, "y": 458},
            {"x": 228, "y": 368}, {"x": 275, "y": 290}, {"x": 362, "y": 234},
            {"x": 456, "y": 196}, {"x": 751, "y": 148}, {"x": 1011, "y": 124},
            {"x": 1120, "y": 129}, {"x": 1174, "y": 152}, {"x": 1172, "y": 175},
            {"x": 1087, "y": 202}, {"x": 857, "y": 230}, {"x": 653, "y": 255},
            {"x": 477, "y": 298}, {"x": 391, "y": 341}, {"x": 354, "y": 391},
            {"x": 353, "y": 429}, {"x": 379, "y": 467}, {"x": 473, "y": 515},
            {"x": 598, "y": 542}, {"x": 752, "y": 556}, {"x": 1099, "y": 563}
        ],
    },
    '3' : {
        level: 3,
        levelBg: './images/level/3.jpg',
        ballsColor: [
            './images/ball/blue.jpg',
            './images/ball/white.jpg',
            './images/ball/purple.jpg',
            './images/ball/yellow.jpg',
            './images/ball/red.jpg',
            './images/ball/green.jpg'
        ],
        offsetFrogLeft : 2.9,
        offsetFrogTop : 2.35,
        totalBalls: 130,
        points: [
            {"x": 1179, "y": 1000}, {"x": 1179, "y": 556},  {"x": 1168, "y": 387},
            {"x": 1144, "y": 276}, {"x": 1102, "y": 188}, {"x": 1055, "y": 129},
            {"x": 1020, "y": 103}, {"x": 937, "y": 69}, {"x": 843, "y": 61},
            {"x": 721, "y": 74}, {"x": 562, "y": 117}, {"x": 455, "y": 162},
            {"x": 346, "y": 219}, {"x": 245, "y": 289}, {"x": 148, "y": 384},
            {"x": 86, "y": 475}, {"x": 68, "y": 547}, {"x": 79, "y": 580},
            {"x": 116, "y": 625}, {"x": 177, "y": 671}, {"x": 258, "y": 703},
            {"x": 364, "y": 724}, {"x": 460, "y": 735}, {"x": 574, "y": 735},
            {"x": 686, "y": 737}, {"x": 767, "y": 728}, {"x": 849, "y": 713},
            {"x": 928, "y": 685}, {"x": 994, "y": 641}, {"x": 1046, "y": 575},
            {"x": 1060, "y": 510}, {"x": 1061, "y": 422}, {"x": 1056, "y": 361},
            {"x": 1035, "y": 290}, {"x": 1008, "y": 226}, {"x": 977, "y": 192},
            {"x": 964, "y": 184}, {"x": 950, "y": 200}, {"x": 920, "y": 281},
            {"x": 888, "y": 369}, {"x": 836, "y": 493}, {"x": 797, "y": 562},
            {"x": 748, "y": 604}, {"x": 683, "y": 634}, {"x": 608, "y": 651},
            {"x": 521, "y": 649}, {"x": 429, "y": 636}, {"x": 360, "y": 620},
            {"x": 284, "y": 574}, {"x": 246, "y": 522}, {"x": 241, "y": 489},
            {"x": 267, "y": 432}, {"x": 306, "y": 390}, {"x": 372, "y": 339},
            {"x": 455, "y": 285}, {"x": 544, "y": 230}, {"x": 638, "y": 180},
            {"x": 704, "y": 155}, {"x": 746, "y": 148}, {"x": 768, "y": 160},
            {"x": 772, "y": 172}, {"x": 757, "y": 236}
        ],
    },
    '4' : {
        level: 4,
        levelBg: './images/level/4.jpg',
        ballsColor: [
            './images/ball/blue.jpg',
            './images/ball/white.jpg',
            './images/ball/purple.jpg',
            './images/ball/yellow.jpg',
            './images/ball/red.jpg',
            './images/ball/green.jpg'
        ],
        offsetFrogLeft : 2.32,
        offsetFrogTop : 2.8,
        totalBalls: 140,
        points: [
            {"x": 1046, "y": -50}, {"x": 1046, "y": 122},  {"x": 1048, "y": 280},
            {"x": 1043, "y": 382}, {"x": 1037, "y": 457}, {"x": 1022, "y": 511},
            {"x": 993, "y": 567}, {"x": 939, "y": 633}, {"x": 887, "y": 676},
            {"x": 820, "y": 713}, {"x": 741, "y": 741}, {"x": 656, "y": 757},
            {"x": 576, "y": 758}, {"x": 499, "y": 745}, {"x": 431, "y": 720},
            {"x": 382, "y": 696}, {"x": 316, "y": 645}, {"x": 268, "y": 579},
            {"x": 230, "y": 504}, {"x": 215, "y": 422}, {"x": 226, "y": 353},
            {"x": 239, "y": 301}, {"x": 280, "y": 235}, {"x": 324, "y": 187},
            {"x": 381, "y": 141}, {"x": 446, "y": 110}, {"x": 522, "y": 93},
            {"x": 595, "y": 88}, {"x": 656, "y": 91}, {"x": 726, "y": 110},
            {"x": 794, "y": 140}, {"x": 852, "y": 184}, {"x": 896, "y": 237},
            {"x": 931, "y": 310}, {"x": 943, "y": 375}, {"x": 940, "y": 436},
            {"x": 923, "y": 490}, {"x": 884, "y": 553}, {"x": 838, "y": 605},
            {"x": 781, "y": 645}, {"x": 717, "y": 667}, {"x": 643, "y": 677},
            {"x": 556, "y": 673}, {"x": 476, "y": 648}, {"x": 411, "y": 606},
            {"x": 366, "y": 557}, {"x": 327, "y": 485}, {"x": 316, "y": 415},
            {"x": 327, "y": 351}, {"x": 340, "y": 308}, {"x": 385, "y": 258},
            {"x": 442, "y": 214}, {"x": 509, "y": 185}, {"x": 580, "y": 174},
            {"x": 646, "y": 180}, {"x": 715, "y": 203}, {"x": 769, "y": 237},
            {"x": 809, "y": 282}, {"x": 838, "y": 339}, {"x": 846, "y": 393},
            {"x": 835, "y": 459}, {"x": 808, "y": 502}, {"x": 769, "y": 540},
            {"x": 708, "y": 573}, {"x": 637, "y": 589}, {"x": 578, "y": 588},
            {"x": 512, "y": 562}, {"x": 466, "y": 529}, {"x": 434, "y": 480},
            {"x": 419, "y": 425}
        ],
    },
    '5' : {
        level: 5,
        levelBg: './images/level/5.jpg',
        ballsColor: [
            './images/ball/blue.jpg',
            './images/ball/white.jpg',
            './images/ball/purple.jpg',
            './images/ball/yellow.jpg',
            './images/ball/red.jpg',
            './images/ball/green.jpg'
        ],
        offsetFrogLeft : 2.33,
        offsetFrogTop : 2.1,
        totalBalls: 130,
        points: [
            {"x": 1400, "y": 110},  {"x": 140, "y": 110}, {"x": 110, "y": 111},
            {"x": 100, "y": 200}, {"x": 140, "y": 200}, {"x": 1116, "y": 200},
            {"x": 1145, "y": 201}, {"x": 1145, "y": 225}, {"x": 1145, "y": 720},
            {"x": 1143, "y": 755}, {"x": 1105, "y": 770}, {"x": 137, "y": 770},
            {"x": 120, "y": 768}, {"x": 108, "y": 750}, {"x": 108, "y": 322},
            {"x": 109, "y": 292}, {"x": 140, "y": 285}, {"x": 1000, "y": 285},
            {"x": 1027, "y": 286}, {"x": 1030, "y": 315}, {"x": 1030, "y": 637},
            {"x": 1029, "y": 669}, {"x": 1005, "y": 690}, {"x": 255, "y": 690},
            {"x": 231, "y": 689}, {"x": 231, "y": 458}
        ],
    },
    '6' : {
        level: 6,
        levelBg: './images/level/6.jpg',
        ballsColor: [
            './images/ball/blue.jpg',
            './images/ball/white.jpg',
            './images/ball/purple.jpg',
            './images/ball/yellow.jpg',
            './images/ball/red.jpg',
            './images/ball/green.jpg'
        ],
        offsetFrogLeft : 2.02,
        offsetFrogTop : 2.9,
        totalBalls: 130,
        points: [
            {"x": 1400, "y": 698},  {"x": 1112, "y": 685}, {"x": 1040, "y": 711},
            {"x": 941, "y": 755}, {"x": 824, "y": 782}, {"x": 687, "y": 783},
            {"x": 547, "y": 770}, {"x": 433, "y": 742}, {"x": 308, "y": 693},
            {"x": 207, "y": 629}, {"x": 136, "y": 552}, {"x": 89, "y": 415},
            {"x": 78, "y": 289}, {"x": 87, "y": 185}, {"x": 122, "y": 107},
            {"x": 162, "y": 97}, {"x": 211, "y": 121}, {"x": 237, "y": 164},
            {"x": 211, "y": 265}, {"x": 207, "y": 376}, {"x": 226, "y": 457},
            {"x": 264, "y": 517}, {"x": 339, "y": 594}, {"x": 420, "y": 646},
            {"x": 510, "y": 680}, {"x": 641, "y": 698}, {"x": 750, "y": 700},
            {"x": 831, "y": 694}, {"x": 897, "y": 674}, {"x": 976, "y": 638},
            {"x": 1040, "y": 595}, {"x": 1096, "y": 531}, {"x": 1138, "y": 451},
            {"x": 1159, "y": 363}, {"x": 1154, "y": 287}, {"x": 1127, "y": 223},
            {"x": 1066, "y": 156}, {"x": 989, "y": 106}, {"x": 866, "y": 66},
            {"x": 723, "y": 57}, {"x": 642, "y": 60}, {"x": 541, "y": 86},
            {"x": 457, "y": 117}, {"x": 383, "y": 181}, {"x": 342, "y": 236},
            {"x": 312, "y": 308}, {"x": 313, "y": 391}, {"x": 330, "y": 462},
            {"x": 376, "y": 519}, {"x": 441, "y": 574}, {"x": 527, "y": 612},
            {"x": 619, "y": 629}, {"x": 696, "y": 633}, {"x": 791, "y": 625},
            {"x": 869, "y": 609}, {"x": 940, "y": 561}, {"x": 1012, "y": 496},
            {"x": 1056, "y": 413}, {"x": 1065, "y": 337}, {"x": 1024, "y": 250},
            {"x": 930, "y": 183}, {"x": 846, "y": 153}, {"x": 729, "y": 143},
            {"x": 634, "y": 154}, {"x": 566, "y": 170}, {"x": 516, "y": 202}
        ],
    },
    '7' : {
        level: 7,
        levelBg: './images/level/7.jpg',
        ballsColor: [
            './images/ball/blue.jpg',
            './images/ball/white.jpg',
            './images/ball/purple.jpg',
            './images/ball/yellow.jpg',
            './images/ball/red.jpg',
            './images/ball/green.jpg'
        ],
        offsetFrogLeft : 3.35,
        offsetFrogTop : 2.55,
        totalBalls: 130,
        points: [
            {"x": 524, "y": -53},  {"x": 856, "y": 89}, {"x": 981, "y": 163},
            {"x": 1095, "y": 262}, {"x": 1189, "y": 382}, {"x": 1208, "y": 488},
            {"x": 1168, "y": 596}, {"x": 1066, "y": 692}, {"x": 983, "y": 713},
            {"x": 856, "y": 736}, {"x": 682, "y": 761}, {"x": 530, "y": 742},
            {"x": 421, "y": 720}, {"x": 285, "y": 674}, {"x": 171, "y": 617},
            {"x": 96, "y": 535}, {"x": 73, "y": 416}, {"x": 111, "y": 306},
            {"x": 171, "y": 217}, {"x": 276, "y": 155}, {"x": 373, "y": 126},
            {"x": 488, "y": 127}, {"x": 633, "y": 155}, {"x": 787, "y": 211},
            {"x": 912, "y": 277}, {"x": 1018, "y": 368}, {"x": 1067, "y": 459},
            {"x": 1055, "y": 544}, {"x": 986, "y": 605}, {"x": 878, "y": 650},
            {"x": 716, "y": 668}, {"x": 556, "y": 656}, {"x": 413, "y": 620},
            {"x": 282, "y": 566}, {"x": 190, "y": 495}, {"x": 171, "y": 392},
            {"x": 223, "y": 299}, {"x": 314, "y": 243}, {"x": 417, "y": 223},
            {"x": 543, "y": 225}, {"x": 678, "y": 266}, {"x": 805, "y": 324},
            {"x": 872, "y": 373}, {"x": 900, "y": 431}
        ],
    },
    '8' : {
        level: 8,
        levelBg: './images/level/8.jpg',
        ballsColor: [
            './images/ball/blue.jpg',
            './images/ball/white.jpg',
            './images/ball/purple.jpg',
            './images/ball/yellow.jpg',
            './images/ball/red.jpg',
            './images/ball/green.jpg'
        ],
        offsetFrogLeft : 2,
        offsetFrogTop : 2.2,
        totalBalls: 130,
        points: [
            {"x": 165, "y": -50},  {"x": 138, "y": 211}, {"x": 100, "y": 518},
            {"x": 74, "y": 698}, {"x": 87, "y": 740}, {"x": 108, "y": 760},
            {"x": 145, "y": 769}, {"x": 264, "y": 768}, {"x": 1105, "y": 766},
            {"x": 1169, "y": 741}, {"x": 1208, "y": 724}, {"x": 1220, "y": 687},
            {"x": 1209, "y": 632}, {"x": 877, "y": 114}, {"x": 841, "y": 83},
            {"x": 785, "y": 65}, {"x": 718, "y": 80}, {"x": 662, "y": 106},
            {"x": 617, "y": 132}, {"x": 183, "y": 543}, {"x": 156, "y": 584},
            {"x": 156, "y": 609}, {"x": 180, "y": 647}, {"x": 203, "y": 666},
            {"x": 246, "y": 675}, {"x": 1023, "y": 676}, {"x": 1060, "y": 668},
            {"x": 1082, "y": 642}, {"x": 1078, "y": 592}, {"x": 1040, "y": 523},
            {"x": 826, "y": 209}, {"x": 793, "y": 184}, {"x": 756, "y": 178},
            {"x": 699, "y": 211}, {"x": 408, "y": 501}
        ],
    },
    '9' : {
        level: 9,
        levelBg: './images/level/9.jpg',
        ballsColor: [
            './images/ball/blue.jpg',
            './images/ball/white.jpg',
            './images/ball/purple.jpg',
            './images/ball/yellow.jpg',
            './images/ball/red.jpg',
            './images/ball/green.jpg'
        ],
        offsetFrogLeft : 2.55,
        offsetFrogTop : 2.82,
        totalBalls: 130,
        points: [
            {"x": 146, "y": 868},  {"x": 119, "y": 742}, {"x": 74, "y": 416},
            {"x": 94, "y": 328}, {"x": 133, "y": 236}, {"x": 183, "y": 179},
            {"x": 219, "y": 147}, {"x": 280, "y": 121}, {"x": 352, "y": 94},
            {"x": 424, "y": 80}, {"x": 526, "y": 76}, {"x": 637, "y": 83},
            {"x": 752, "y": 94}, {"x": 877, "y": 109}, {"x": 988, "y": 130},
            {"x": 1088, "y": 164}, {"x": 1139, "y": 200}, {"x": 1147, "y": 235},
            {"x": 1146, "y": 271}, {"x": 1132, "y": 300}, {"x": 1099, "y": 355},
            {"x": 1098, "y": 424}, {"x": 1129, "y": 486}, {"x": 1149, "y": 537},
            {"x": 1146, "y": 573}, {"x": 1129, "y": 619}, {"x": 1092, "y": 657},
            {"x": 1027, "y": 694}, {"x": 938, "y": 722}, {"x": 829, "y": 738},
            {"x": 727, "y": 749}, {"x": 637, "y": 753}, {"x": 421, "y": 749},
            {"x": 337, "y": 741}, {"x": 288, "y": 727}, {"x": 255, "y": 694},
            {"x": 263, "y": 663}, {"x": 284, "y": 649}, {"x": 319, "y": 634},
            {"x": 370, "y": 626}, {"x": 453, "y": 623}, {"x": 573, "y": 630},
            {"x": 659, "y": 634}, {"x": 781, "y": 630}, {"x": 894, "y": 617},
            {"x": 973, "y": 600}, {"x": 999, "y": 572}, {"x": 1010, "y": 543},
            {"x": 999, "y": 514}, {"x": 943, "y": 417}, {"x": 942, "y": 375},
            {"x": 989, "y": 290}, {"x": 994, "y": 259}, {"x": 964, "y": 226},
            {"x": 842, "y": 185}, {"x": 709, "y": 164}, {"x": 611, "y": 157},
            {"x": 484, "y": 169}, {"x": 371, "y": 189}, {"x": 295, "y": 214},
            {"x": 231, "y": 255}, {"x": 200, "y": 298}, {"x": 186, "y": 336},
            {"x": 196, "y": 388}
        ],
    }
}

class Track {
    constructor(level) {
        this.track = [];
        this.level = level;
    }

    getPoint(x, y) {
        return {x, y};
    }

    getPoints() {
        let mapCurve = data[this.level].points;

        let bezier = new Bezier();

        for (let i = 0; i < mapCurve.length - 2; ++i) {
            let point0 = (i === 0) ? this.getPoint(mapCurve[0].x, mapCurve[0].y) :
                this.getPoint((mapCurve[i].x + mapCurve[i + 1].x) / 2,
                    (mapCurve[i].y + mapCurve[i + 1].y) / 2);

            let point1 = this.getPoint(mapCurve[i + 1].x, mapCurve[i + 1].y);

            let point2 = (i <= mapCurve.length - 4) ? this.getPoint((mapCurve[i + 1].x + mapCurve[i + 2].x) / 2,
                    (mapCurve[i + 1].y + mapCurve[i + 2].y) / 2) :
                this.getPoint(mapCurve[i + 2].x, mapCurve[i + 2].y);

            let steps = bezier.init(point0, point1, point2, 1);

            for (let m = 1; m <= steps; ++m) {
                let data = bezier.getAnchorPoint(m);

                this.track.push(data);
            }
        }
    };

    getTrack() {
        this.getPoints();
        return this.track;
    }
}

/*---------------------------------------------------------------------------View-------------------------------------------------------------------------------------------------------------- */

class CanvasView {
    constructor(model) {
        this.model = model;
        this.context = document.getElementById('canvas').getContext('2d');
    }

    createCanvas() {
        let canvas = document.getElementById('canvas');
        canvas.width = this.model.canvasWidth;
        canvas.height = this.model.canvasHeight;
    }

    draw() {
        let levelBg = new Image();
        levelBg.src = this.model.levelBg;
        this.context.drawImage(levelBg, 0, 0, this.model.canvasWidth, this.model.canvasHeight);
    }
}

class BallView extends CanvasView{
    frame = 0;
    numberOfRows = 10;
    numberOfCols = 6;
    tickPerFrame = 1;
    tickCount = 0;
    spriteWidth = 300;
    spriteHeight = 180;
    rowCount = 0;

    constructor(model) {
        super();
        this.model = model;
        this.color = this.model.color;
    }

    drawBall() {
        let ballImage = new Image();
        ballImage.src = this.color;
        this.context.save();
        this.context.beginPath();
        this.context.arc(
            this.model.x, this.model.y,
            this.model.ballRadius, 0, Math.PI * 2, false
        );

        this.context.closePath();
        this.context.clip();
        this.animateColor(ballImage);
        this.context.restore();
    }

    animateColor(image) {
        this.context.translate(this.model.x - this.model.ballRadius, this.model.y - this.model.ballRadius);

        this.context.drawImage(
            image,
            this.frame * this.spriteWidth / this.numberOfRows,
            this.rowCount * this.spriteHeight / this.numberOfCols,
            this.spriteWidth / this.numberOfRows, this.spriteHeight,
            0, 0,
            this.model.ballRadius * 2 * 10 / this.numberOfRows, this.model.ballRadius * 2 * 6
        );

        if (this.tickCount > this.tickPerFrame) {
            this.tickCount = 0;

            if (this.frame === this.numberOfRows - 1) {
                this.rowCount++;
            }

            if (this.rowCount === 6) {
                this.rowCount = 0;
            }
            this.frame = (this.frame < this.numberOfRows - 1) ? this.frame += 1 : this.frame = 0;
        }

        this.tickCount++;
    }

    draw() {
        this.drawBall()
    }
}

class FrogView extends CanvasView {
    frame = 0;
    numberOfRows = 10;
    numberOfCols = 6;
    tickPerFrame = 1;
    tickCount = 0;
    spriteWidth = 300;
    spriteHeight = 180;
    rowCount = 0;

    constructor(model) {
        super();
        this.model = model;
        this.color = this.model.color;
        this.secondColor = this.model.secondShotColor;
    }

    drawFrog() {
        let frogImage = new Image();
        frogImage.src = './images/frog.png';

        this.context.save();
        this.context.beginPath();

        this.context.arc(
            this.model.frogLeft + this.model.frogWidth / 2,
            this.model.frogTop + this.model.frogHeight / 2,
            this.model.frogWidth / 2, 0, Math.PI * 2, false
        );

        this.context.closePath();
        this.context.clip();

        this.context.translate(
            this.model.frogLeft + this.model.frogWidth / 2,
            this.model.frogTop + this.model.frogHeight / 2
        );

        this.context.rotate(this.model.frogAngle);

        this.context.drawImage(
            frogImage,
            -this.model.frogWidth / 2, -this.model.frogHeight / 2,
            this.model.frogWidth, this.model.frogHeight
        );

        this.context.restore();
    }

    drawShot() {
        let shotImage = new Image();
        shotImage.src = this.color;

        this.context.save();
        this.context.beginPath();

        this.context.arc(
            this.model.frogLeft + this.model.frogWidth / 2,
            this.model.frogTop + this.model.frogHeight / 2,
            this.model.frogWidth / 2, 0, Math.PI * 2, false
        );
        this.context.closePath();

        this.context.translate(
            this.model.shotLeft, this.model.shotTop
        );

        this.context.rotate(-this.model.shotAngle);

        this.context.beginPath();
        this.context.arc(
            0,
            this.model.frogHeight / 4,
            this.model.shotRadius, 0, Math.PI * 2, false)
        this.context.closePath();
        this.context.clip()

        this.animateColor(shotImage);
        this.context.restore();
    }

    animateColor(image) {
        this.context.translate(0, 0);

        this.context.drawImage(
            image,
            this.frame * this.spriteWidth / this.numberOfRows, this.rowCount * this.spriteHeight / this.numberOfCols,
            this.spriteWidth / this.numberOfRows, this.spriteHeight,
            -this.model.shotRadius, -this.model.shotRadius + this.model.frogHeight / 4,
            this.model.shotRadius * 2 * 10 / this.numberOfRows, this.model.shotRadius * 2 * 6
        );

        if (this.tickCount > this.tickPerFrame) {
            this.tickCount = 0;
            if (this.frame === this.numberOfRows - 1) {
                this.rowCount++;
            }
            if (this.rowCount === 6) {
                this.rowCount = 0;
            }
            this.frame = (this.frame < this.numberOfRows - 1) ? this.frame += 1 : this.frame = 0;
        }
        this.tickCount++;
    }

    drawSecondBall() {
        let shotImage = new Image();
        shotImage.src = this.secondColor;
        this.context.save();
        this.context.beginPath();

        this.context.arc(
            this.model.frogLeft + this.model.frogWidth / 2,
            this.model.frogTop + this.model.frogHeight / 2,
            this.model.frogWidth / 2 + 2, 0, Math.PI * 2, false
        );

        this.context.closePath();

        this.context.translate(
            this.model.secondShotLeft, this.model.secondShotTop
        );

        this.context.rotate(this.model.frogAngle);

        this.context.beginPath();
        this.context.arc(
            0,
            -this.model.frogHeight / 5,
            this.model.shotRadius / 2 + 1, 0, Math.PI * 2, false)
        this.context.closePath();
        this.context.clip();
        this.context.fill();


        this.context.translate(0, 0);

        this.context.drawImage(
            shotImage,
            0, 0,
            30, 30,
            -this.model.shotRadius / 2 - 2, -this.model.frogHeight / 5 - this.model.shotRadius / 2 - 1,
            this.model.shotRadius + 3, this.model.shotRadius + 3
        );

        this.context.restore();
    }

    draw() {
        this.drawFrog();
        this.drawShot();
        this.drawSecondBall();
    }
}

/*-------------------------------------------------------------------Controller------------------------------------------------------------------------------------------------------------------*/

export class CanvasController {
    constructor() {
        this.game = new CanvasModel();
        this.view = new CanvasView(this.game);
        this.frogController = new FrogController();
        this.ballController = new BallController(this.game.totalBalls, this.frogController.model);

        this.view.createCanvas();
        this.gameSize();
    }

    resize() {
        let container = document.querySelector('.game__field');
        let canvas = document.getElementById('canvas');
        let offsetWidth = container.clientWidth;
        let offsetHeight = container.clientHeight;
        let canvasRatio = 360 / 640;
        let windowRatio = (offsetWidth > offsetHeight) ? offsetHeight / offsetWidth : offsetWidth / offsetHeight;
        let width;
        let height;

        if (windowRatio < canvasRatio) {
            height = offsetHeight;
            width = height / canvasRatio;
        } else {
            width = offsetWidth;
            height = width * canvasRatio;
        }

        canvas.width = width;
        canvas.height = height;
        this.game.updateSize(width, height);
        this.frogController.updateSize(width, height);
        this.ballController.updateSize(width, height);
    }

    gameSize() {
        window.addEventListener('resize', () => {
            setTimeout(() => {
                this.resize();
            }, 0);
        });
    }

    draw() {
        this.view.draw();
        this.frogController.draw();
        this.ballController.draw();
    }
}

export class Player {
    constructor() {
        this.score = 0;
        this.createPlayer();
    }

    createRecords(data) {
        let table = document.querySelector('.game__records-table');
        let tr = table.querySelectorAll('.game__top-five');
        
        for (let i = 0; i < tr.length; i++) {
            tr[i].firstElementChild.textContent = data[i][0];
            tr[i].lastElementChild.textContent = data[i][1];
        }
    }

    createPlayer() {
        let name = localStorage.getItem('name');

        if (name) {
            let playerScore = localStorage.getItem('score');
            let playerName = document.querySelector('.player__info-name');
            let playerScoreInfo = document.querySelector('.player__info-score');
            playerName.textContent = `${name}`;

            if (playerScore > 0) {
                playerScoreInfo.textContent = `Score: ${playerScore}`;
            } else {
                localStorage.setItem('score', '0');
                playerScoreInfo.textContent = 'Score: 0';
            }
        }
    }

    checkScore(score) {
        let localStorageScore = localStorage.getItem('score');

        if (score > localStorageScore) {
            localStorage.setItem('score', score);
            this.createPlayer();
        } else {
            localStorage.setItem('score', localStorageScore);
        }

        this.updateTableRecords('GOROHOVICH_ZUMA_RECORDS', [localStorage.getItem('name'), String(this.score)])
            .then(result => this.createRecords(result));
    }

    updateGameScore() {
        let gameScore = document.querySelector('.game__score');
        gameScore.textContent = `SCORE : ${this.score}`;
    }

    getExtraScore(track, previousSection, level) {
        let gameField = document.querySelector('.game__field');
        let canvas = document.getElementById('canvas');
        let offsetLeft = document.body.offsetLeft - canvas.offsetLeft;
        let offsetTop = document.body.offsetTop - canvas.offsetTop;
        let extraScore = document.createElement('div');
        extraScore.classList.add('extra_score');
        gameField.append(extraScore);
        let width = extraScore.offsetWidth / 2;
        let height = extraScore.offsetHeight / 2;
        extraScore.style.left = track.previousSection.x - width - offsetLeft + 'px';
        extraScore.style.top = track.previousSection.y - height - offsetTop + 'px';
        let count = 50;

        for (let i = previousSection + 35; i < track.length; i += 35) {
            let x = track[i].x;
            let y = track[i].y;

            setTimeout(() => {
                extraScore.style.left = x - width - offsetLeft + 'px';
                extraScore.style.top = y - height - offsetTop + 'px';
                this.score += 1 * level;
                extraScore.textContent = `+ ${this.score}`;

                if (i + 70 > track.length) {
                    setTimeout(() => {
                        extraScore.remove();
                    }, 200);
                }
            }, count += 60);
        }
    }

    checkTop(records, value) {
        let nameIndex = null;

        for (let i = 0; i < records.length; i++) {
            if (records[i][0] === value[0]) {
                nameIndex = i;
                break;
            }
        }

        if (nameIndex !== null) {
            if (+(records[nameIndex][1]) <= +(value[1])) {
                records[nameIndex][1] = value[1];
                return records;
            } else if (+(records[nameIndex][1]) >= +(value[1])) {
                return records;
            }
        } else {
            for (let j = 0; j < records.length; j++) {
                if (+(value[1]) > +(records[j][1])) {
                    records.splice(j, 0, value);
                    return records;
                }
            }
        }

        return records;
    }

    async updateTableRecords(name, value) {
        let password = String(Math.random());
        let myHeaders = new Headers();
        myHeaders.append('Content-type', 'application/x-www-form-urlencoded');
        let urlencodedRecords = new URLSearchParams();
        urlencodedRecords.append('f', 'LOCKGET');
        urlencodedRecords.append('n', name);
        urlencodedRecords.append('p', password);
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencodedRecords
        };
        let records = await fetch('https://fe.it-academy.by/AjaxStringStorage2.php', requestOptions)
            .then(response => response.json())
            .then(result => JSON.parse(result.result))
            .catch(error => console.log('error', error));
        let newRecords = await this.checkTop(records, value);

        await newRecords.sort(function (a, b) {
            return (+(a[1]) < +(b[1])) ? 1 : (+(a[1]) > +(b[1])) ? -1 : 0;
        });

        let myHeadersUpdate = new Headers();
        myHeadersUpdate.append('Content-type', 'application/x-www-form-urlencoded');
        let urlencodedRecordsUpdate = new URLSearchParams();
        urlencodedRecordsUpdate.append('f', 'UPDATE');
        urlencodedRecordsUpdate.append('n', name);
        urlencodedRecordsUpdate.append('p', password);
        urlencodedRecordsUpdate.append('v', JSON.stringify(newRecords));
        let requestOptionsUpdate = {
            method: 'POST',
            headers: myHeadersUpdate,
            body: urlencodedRecordsUpdate
        };

        await fetch('https://fe.it-academy.by/AjaxStringStorage2.php', requestOptionsUpdate)
            .then(response => response.json())
            .then(result => result)
            .catch(error => console.log('error', error));

        return records;
    }

    nextLevel(status, level, totalBalls, score){
        let nextButton = document.querySelector('.next');

        nextButton.addEventListener('click', () => {
            window.location.reload();
            location.hash = '#Play';
        });

        let canvas = document.getElementById('canvas');
        let gameEndTable = document.querySelector('.game__end-table');
        let statistics = document.querySelectorAll('.statistics');

        gameEndTable.style.width = canvas.offsetWidth + 'px';
        gameEndTable.style.height = canvas.offsetHeight + 'px';
        gameEndTable.style.left = canvas.offsetLeft + 'px';

        if (status === 'win') {
            statistics[0].textContent = `You WIN`;
            statistics[1].textContent = `Level: ${level}`;
            statistics[2].textContent = `Balls: ${totalBalls}`;
            statistics[3].textContent = `Score: ${score}`;
        }

        if (status === 'lose') {
            statistics[0].textContent = `GAME OVER`;
        }

        gameEndTable.classList.remove('hidden');
    }
}

class BallController {
    constructor(totalBalls, frog) {
        this.frog = frog;
        this.totalBalls = totalBalls;
        this.player = new Player();
        this.balls = [];
        this.spacing = 36;
        this.track = [];
        this.views = [];
        this.createFirstBall();
        this.gameEnd = false;
        this.ballNeedShift = false;
        this.shiftedBalls = [];
        this.fasterBallsState = true;
        this.ballCounter = 0;
        this.currentCombo = 0;
        this.maxCombo = 0;
        this.multiplierCombo = 1;
        this.comboCounter = 0;

        this.checkUnload();
        this.music = this.createMusic();
    }

    updateSize(width, height) {
        for (let i = 0; i < this.balls.length; i++) {
            this.balls[i].updateSize(width, height);
        }
    }

    createFirstBall() {
        let ball = this.createRandomBall();
        let view = new BallView(ball);
        this.views.unshift(view);
        this.balls.unshift(ball);

        ball.createPosition(this.spacing);
        this.track = ball.track;
    }

    createFasterBalls() {
        if (this.balls.length < 30 && this.fasterBallsState) {
            let speed = 12;
            
            for (let i = 0; i < this.balls.length; i++) {
                this.balls[i].update(speed);
            }

            if (this.balls[0].getTrackSection() === this.spacing * 2) {
                let ball = this.createRandomBall();
                let view = new BallView(ball);
                this.views.unshift(view);
                this.balls.unshift(ball);

                ball.createPosition(this.spacing);
            }
        }
    }

    createBalls() {
        if (this.balls.length !== 0) {
            this.pushNextBall(0, 1);

            if (this.balls[0].getTrackSection() === this.spacing * 2 &&
                this.totalBalls !== 0 && this.totalBalls > 0
            ) {
                let ball = this.createRandomBall();
                let view = new BallView(ball);
                this.views.unshift(view);
                this.balls.unshift(ball);
                ball.createPosition(this.spacing);
            }
        }
    }

    createRandomBall() {
        this.totalBalls--;
        this.ballCounter++;
        return new BallModel();
    }

    pushBall(ball, pushPosition) {
        let index;

        for (let i = 0; i < this.balls.length; i++) {

            if (this.balls[i].trackSection > pushPosition) {
                index = i;
                break;
            }

            if (i === this.balls.length - 1) {
                index = i + 1;
            }
        }

        ball.createPosition(pushPosition);

        this.balls.splice(index, 0, ball);

        this.frog.colors = this.checkColor();
        let view = new BallView(ball);
        this.views.splice(index, 0, view);

        if (this.balls[index - 1] &&
            this.balls[index - 1].color === this.balls[index].color &&
            this.balls[index].getTrackSection() - this.balls[index - 1].getTrackSection() > this.spacing + 1) {
            this.addShiftedBall(ball);
        }

        if (this.balls[index + 1] &&
            this.balls[index + 1].color === this.balls[index].color &&
            this.balls[index + 1].getTrackSection() - this.balls[index].getTrackSection() > this.spacing + 1) {
            this.addShiftedBall(this.balls[index + 1]);
        }

        this.checkTail(index, true);
    }

    pushNextBall(index, speed) {
        let tempBalls = [];
        tempBalls.push(this.balls[index]);

        for (let i = index; i < this.balls.length - 1; i++) {

            if (this.balls[i + 1].getTrackSection() - this.balls[i].getTrackSection() <= this.spacing) {

                if (this.balls[i + 1].getTrackSection() - this.balls[i].getTrackSection() < this.spacing) {

                    this.balls[i + 1].update(4);
                }

                tempBalls.push(this.balls[i + 1]);
            } else {
                break;
            }
        }

        for (let i = this.balls.length - 1; i > 0; i --) {

            if (this.balls[i].getTrackSection() - this.balls[i - 1].getTrackSection() < this.spacing) {
                this.balls[i].update(4);
            }

        }

        for (let j = 0; j < tempBalls.length; j++) {
            tempBalls[j].update(speed);
        }

        if (this.balls[this.balls.length - 1].getTrackSection() >= this.track.length - this.spacing) {
            this.balls.splice(this.balls.length - 2, 1);

            if (this.balls.length === 2) {
                this.gameEnd = true;
                this.frog.canShoot = 0;
                this.music.main.pause();
                this.music.end.play();                
            }

            if (this.gameEnd) {
                setTimeout(() => {
                    this.player.nextLevel('lose');
                }, 500);
            }
        }
    }

    checkCollision(shot) {
        for (let i = 0; i < this.balls.length; i++) {

            let dx = this.balls[i].x - shot.x;
            let dy = this.balls[i].y - shot.y;
            let distance = Math.sqrt((dx * dx) + (dy * dy));

            if (distance <= this.balls[i].ballRadius * 2) {
                this.frog.down = 1;
                return i;
            }
        }
        return -1;
    }

    checkPosition(ball, index, position) {
        let pushPosition;

        if (position === 'next') {
            pushPosition = this.balls[index].getTrackSection();
        } else if (position === 'previous') {
            pushPosition = this.balls[index].getTrackSection() - this.spacing;
        }
        this.pushBall(ball, pushPosition);
    }

    checkColor() {
        let colorArray = [];

        for (let i = 0; i < this.balls.length; i++) {
            colorArray.push(this.balls[i].color);
        }

        return Array.from(new Set(colorArray));
    }

    checkTail(index, status) {
        let tempBalls = [];
        tempBalls.push(this.balls[index]);

        let color = this.balls[index].color;
        let i = index + 1;

        while (this.balls[i]) {

            if (this.balls[i].color === color) {

                if (this.balls[i].getTrackSection() - this.balls[i - 1].getTrackSection() <= this.spacing + 1) {
                    tempBalls.push(this.balls[i]);
                    i++;
                } else if (!status) {
                    tempBalls.push(this.balls[i]);
                    i++;
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        let j = index - 1;

        while (this.balls[j]) {

            if (this.balls[j].color === color) {

                if (this.balls[j + 1].getTrackSection() - this.balls[j].getTrackSection() <= this.spacing + 1) {
                    tempBalls.push(this.balls[j]);
                    j--;
                } else if (!status) {
                    tempBalls.push(this.balls[j]);
                    j--;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        j++;

        if (tempBalls.length > 2 && status) {
            this.clearBalls(j, tempBalls);
        }
        return tempBalls.length;
    }

    clearBalls(index, tempBalls) {
        this.currentCombo++;

        this.checkWinGame(tempBalls);

        let tempScore = 0;

        for (let i = 0; i < tempBalls.length; i++) {
            tempScore += 10 + this.frog.level
        }

        tempScore *= this.multiplierCombo * this.frog.level;
        this.player.score += tempScore;

        this.balls.splice(index, tempBalls.length);
        this.views.splice(index, tempBalls.length);

        if (!this.gameEnd) {
            this.frog.colors = this.checkColor();
        }

        if (this.balls[index - 1] &&
            this.balls[index] &&
            this.balls[index - 1].color === this.balls[index].color
        ) {
            if (this.checkTail(index, false) < 3) {
                if (this.currentCombo > this.maxCombo) {
                    this.maxCombo = this.currentCombo;
                }
                this.comboCounter += this.currentCombo;
                this.currentCombo = 0;
            }

            this.addShiftedBall(this.balls[index]);
        } else {
            if (this.currentCombo > this.maxCombo) {
                this.maxCombo = this.currentCombo;
            }
            this.comboCounter += this.currentCombo;
            this.currentCombo = 0;            
            this.music.clearBall.currentTime = 0;
            this.music.clearBall.play();            
        }
    }

    checkWinGame(tempBalls) {
        if (this.balls.length === tempBalls.length) {
            this.gameEnd = true;            
            this.music.main.pause();
            this.music.score.play();            

            this.frog.canShoot = 0;
            this.player.getExtraScore(this.track, this.balls[this.balls.length - 1].getTrackSection(), this.frog.level);

            let currentLevel = localStorage.getItem('level');
            let nextLevel = this.frog.level + 1;

            if (nextLevel < currentLevel) {
                localStorage.setItem('level', currentLevel);
            } else if (nextLevel > currentLevel && this.frog.level < 9) {
                localStorage.setItem('level', String(nextLevel));
            }

            setTimeout(() => {
                this.player.checkScore(this.player.score);                
                this.music.win.play();
                
                this.player.nextLevel(
                    'win',
                    this.frog.level,
                    this.ballCounter,
                    this.player.score
                );
            }, 5000);
        }
    }

    addShiftedBall(ball) {
        if (this.shiftedBalls === null) {
            this.shiftedBalls = [];
            this.shiftedBalls.push(ball);
        } else {
            this.shiftedBalls.push(ball);
        }

        setTimeout(() => {
            this.ballNeedShift = true;            
            this.music.shifted.currentTime = 0;
            this.music.shifted.play();            
        }, 100);
    }

    shiftOfTwoTails() {
        if (this.shiftedBalls.length !== 0) {

            for (let i = 0; i < this.shiftedBalls.length; i++) {
                let index = this.balls.indexOf(this.shiftedBalls[i]);

                if (index !== -1 && this.balls[index - 1]) {

                    if (this.shiftedBalls[i].color === this.balls[index - 1].color) {
                        let speed;

                        if (this.shiftedBalls[i].getTrackSection() - this.balls[index - 1].getTrackSection() > this.spacing + 2) {
                            speed = 3;
                        } else {
                            speed = 10;
                        }

                        this.pushNextBall(index, -speed);

                        if (this.shiftedBalls[i].getTrackSection() - this.balls[index - 1].getTrackSection() <= this.spacing) {
                            this.multiplierCombo++;
                            this.shiftedBalls.splice(i, 1);

                            this.checkTail(index - 1, true);

                            if (this.shiftedBalls.length === 0) {
                                this.ballNeedShift = false;
                                this.multiplierCombo = 1;
                            }
                        }
                    } else {
                        this.shiftedBalls.splice(i, 1);
                        if (this.currentCombo > this.maxCombo) {
                            this.maxCombo = this.currentCombo;
                        }
                        this.comboCounter += this.currentCombo;
                        this.currentCombo = 0;
                    }
                }
            }
        } else {
            this.ballNeedShift = false;
            this.multiplierCombo = 1;
        }
    }

    shooting() {
        if (this.frog.shotState === 1) {

            let flag = this.checkCollision({x: this.frog.shotLeft, y: this.frog.shotTop});

            if (flag !== -1) {
                let previousX = this.track[this.balls[flag].getTrackSection() - Math.ceil(this.balls[flag].ballRadius)].x;
                let previousY = this.track[this.balls[flag].getTrackSection() - Math.ceil(this.balls[flag].ballRadius)].y;
                let previousDistance = Math.sqrt(
                    (this.frog.shotLeft - previousX) * (this.frog.shotLeft - previousX) +
                    (this.frog.shotTop - previousY) * (this.frog.shotTop - previousY)
                );

                let nextX = this.track[this.balls[flag].getTrackSection() + Math.ceil(this.balls[flag].ballRadius)].x;
                let nextY = this.track[this.balls[flag].getTrackSection() + Math.ceil(this.balls[flag].ballRadius)].y;
                let nextDistance = Math.sqrt(
                    (this.frog.shotLeft - nextX) * (this.frog.shotLeft - nextX) +
                    (this.frog.shotTop - nextY) * (this.frog.shotTop - nextY)
                );

                let position = (previousDistance > nextDistance) ? 'next' : 'previous';
                let ball = this.createRandomBall();
                ball.color = this.frog.color;
                this.checkPosition(ball, flag, position);
            }
        }
    }

    draw() {
        this.player.updateGameScore();

        if (this.ballNeedShift) {
            this.shiftOfTwoTails();
        }

        this.shooting();

        if (!this.gameEnd) {
            if (this.fasterBallsState && this.balls.length < 30) {
                this.createFasterBalls();
            } else {
                if (!this.gameEnd) {
                    this.fasterBallsState = false;
                    this.frog.canShoot = 1;
                    this.createBalls();
                }
            }
            for (let i = 0; i < this.balls.length; i++) {
                this.views[i].draw();
            }
        }
    }

    checkUnload() {
        window.addEventListener('beforeunload', (eo) => {
            if (!this.gameEnd && location.hash === '#Game') {
                eo.returnValue = 'Ваш прогресс не будет сохранен. Вы уверены что хотите покинуть игру?';
                if (eo.returnValue) {
                    window.location.reload();
                }
            }
        });

        window.addEventListener('popstate', (eo) => {
            if (location.hash === '#Play' && !this.gameEnd) {
                let conf = confirm('Ваш прогресс не будет сохранен. Вы уверены что хотите покинуть игру?');
                if (conf) {
                    window.location.reload();
                } else {
                    location.hash = '#Game';
                }
            }
        });
    }

    createMusic() {        
        let musicArray = {};
        let main = new Audio();
        main.src = './sounds/main.mp3';
        main.play();
        main.loop = true;

        let win = new Audio();
        win.src = './sounds/win.mp3';

        let end = new Audio();
        end.src = './sounds/end.mp3';

        let clearBall = new Audio();
        clearBall.src = './sounds/clear-ball.mp3';

        let shifted = new Audio();
        shifted.src = './sounds/fireball.mp3';

        let score = new Audio();
        score.src = './sounds/score.mp3';

        musicArray.main = main;
        musicArray.win = win;
        musicArray.end = end;
        musicArray.clearBall = clearBall;
        musicArray.shifted = shifted;
        musicArray.score = score;

        return musicArray;
    }
}

class FrogController {
    constructor() {
        this.model = new FrogModel();
        this.view = new FrogView(this.model);
        this.moveFrog();
        this.shot();
        this.swapColor();
    }

    moveFrog() {
        let canvas = document.getElementById('canvas');

        canvas.addEventListener('mousemove', (eo) => {
            let clientX = eo.clientX - canvas.getBoundingClientRect().x;
            let clientY = eo.clientY - canvas.getBoundingClientRect().y;

            this.model.updateFrogAngle(clientX, clientY);
            if (this.model.shotState === 0) {
                this.model.updateShotAngle(clientX, clientY);
            }
        });
    }

    shot() {
        let canvas = document.getElementById('canvas');

        canvas.addEventListener('click', (eo) => {
            if (!this.model.shotState && this.model.canShoot) {
                this.model.shotSpeed = this.model.frogWidth / 10;
                this.model.shotState = 1;                
                this.fireSound().play();                
            }
        });
    }

    fireSound() {
        let fireSound = new Audio();
        fireSound.src = './sounds/fireball.mp3';
        return fireSound;
    }

    updateSize(width, height) {
        this.model.updateSize(width, height)
    }

    restartShot() {
        let canvas = document.getElementById('canvas');
        let field = document.querySelector('.game__field');

        let offsetLeft = (field.clientWidth - canvas.offsetWidth) / 2;
        let offsetTop = (field.clientHeight - canvas.offsetHeight) / 2;

        if (this.model.shotLeft - this.model.shotRadius < canvas.offsetLeft - offsetLeft ||
            this.model.shotTop - this.model.shotRadius < canvas.offsetTop - offsetTop ||
            this.model.shotLeft + this.model.shotRadius > canvas.offsetWidth ||
            this.model.shotTop + this.model.shotRadius > canvas.offsetHeight) {
            this.model.restartShot();
            this.view.secondColor = this.model.secondShotColor;
            this.view.color = this.model.color;
        }
    }

    stopShot() {
        if (this.model.down === 1) {
            this.model.stopShot();
            this.view.secondColor = this.model.secondShotColor;
            this.view.color = this.model.color;
        }
    }

    swapColor() {
        window.oncontextmenu = function (eo) {
            return false;
        }

        window.addEventListener('mousedown', (eo) => {
            if (eo.button === 2) {
                let firstColor = this.model.color;
                let secondColor = this.model.secondShotColor;

                this.model.color = secondColor;
                this.model.secondShotColor = firstColor;
                this.view.color = secondColor;
                this.view.secondColor = firstColor;
            }
        });
    }

    draw() {
        this.stopShot();
        this.restartShot();
        this.view.draw();
        this.model.updateShot()
    }
}
