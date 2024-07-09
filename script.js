document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const voronoiButton = document.getElementById('voronoiButton');
    const delaunayButton = document.getElementById('delaunayButton');
    const resetButton = document.getElementById('resetButton');

    const sites = [];
    let showVoronoi = false;
    let showDelaunay = false;

    function resizeCanvas() {
        canvas.width = window.innerWidth / 2;
        canvas.height = window.innerHeight / 1.75;
        draw();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left + Math.random() * 4 - 2;
        const y = event.clientY - rect.top + Math.random() * 4 - 2;
        sites.push([x, y]);
        draw();
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (showVoronoi) {
            drawVoronoi();
        }

        if (showDelaunay) {
            drawDelaunay();
        }

        ctx.fillStyle = 'white';
        for (const site of sites) {
            ctx.beginPath();
            ctx.arc(site[0], site[1], 3, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    function drawVoronoi() {
        if (sites.length < 2) return;
        const delaunay = d3.Delaunay.from(sites);
        const voronoiDiagram = delaunay.voronoi([0, 0, canvas.width, canvas.height]);

        ctx.strokeStyle = 'orange';

        ctx.beginPath();
        for (let cell of voronoiDiagram.cellPolygons()) {
            ctx.moveTo(cell[0][0], cell[0][1]);
            for (let j = 1; j < cell.length; j++) {
                ctx.lineTo(cell[j][0], cell[j][1]);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(255,100,3,0.1)';
            ctx.fill();
        }
        ctx.stroke();
    }

    function drawDelaunay() {
        if (sites.length < 3) return;
        const delaunay = d3.Delaunay.from(sites);
        ctx.beginPath();
        delaunay.render(ctx);
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    voronoiButton.addEventListener('click', () => {
        showVoronoi = !showVoronoi;
        voronoiButton.classList.toggle('active', showVoronoi);
        draw();
    }); 

    delaunayButton.addEventListener('click', () => {
        showDelaunay = !showDelaunay;
        delaunayButton.classList.toggle('active', showDelaunay);
        draw();
    });

    resetButton.addEventListener('click', () => {
        sites.length = 0;
        showVoronoi = false;
        showDelaunay = false;
        voronoiButton.classList.remove('active', showVoronoi);
        delaunayButton.classList.remove('active', showDelaunay);
        draw();
    });
});
