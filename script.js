document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    let score = 0;
    let grid = Array(4).fill(null).map(() => Array(4).fill(0));

    function drawBoard() {
        board.innerHTML = '';
        grid.forEach(row => {
            row.forEach(cell => {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.classList.add('t' + cell);
                tile.textContent = cell > 0 ? cell : '';
                board.appendChild(tile);
            });
        });
    }

    function generateNumber() {
        let emptyCells = [];
        grid.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell === 0) emptyCells.push({ r, c });
            });
        });

        if (emptyCells.length === 0) return;

        let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        drawBoard();
    }

    function slide(row, reverse = false) {
        let newRow = row.filter(x => x);
        while (newRow.length < 4) newRow.push(0);
        if (reverse) newRow.reverse();
        return newRow;
    }

    function merge(row, reverse = false) {
        let newRow = slide(row, reverse);
        for (let i = 0; i < 3; i++) {
            if (newRow[i] === newRow[i + 1] && newRow[i] !== 0) {
                newRow[i] *= 2;
                score += newRow[i];
                newRow[i + 1] = 0;
            }
        }
        newRow = slide(newRow, reverse);
        return newRow;
    }

    function move(direction) {
        let moved = false;
        if (direction === 'left') {
            grid = grid.map(row => {
                let newRow = merge(slide(row));
                if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
                return newRow;
            });
        } else if (direction === 'right') {
            grid = grid.map(row => {
                let newRow = merge(slide(row, true));
                if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
                return newRow.reverse();
            });
        } else if (direction === 'up') {
            grid = transpose(grid).map(row => {
                let newRow = merge(slide(row));
                if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
                return newRow;
            });
            grid = transpose(grid);
        } else if (direction === 'down') {
            grid = transpose(grid).map(row => {
                let newRow = merge(slide(row, true));
                if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
                return newRow.reverse();
            });
            grid = transpose(grid);
        }
        if (moved) {
            generateNumber();
        }
        drawBoard();
        document.getElementById('score').textContent = 'Score: ' + score;
    }

    function transpose(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[i]));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') move('left');
        if (e.key === 'ArrowRight') move('right');
        if (e.key === 'ArrowUp') move('up');
        if (e.key === 'ArrowDown') move('down');
    });

    generateNumber();
    drawBoard();
});
