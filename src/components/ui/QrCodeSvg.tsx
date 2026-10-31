"use client";

// Simple self-contained SVG QR Code renderer for hackathon demo
export function QrCodeSvg({
  value,
  size = 200,
  className = "",
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  // Deterministic pseudo-random pattern based on string hash for authentic QR appearance
  const gridSize = 25;
  const matrix: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  // Helper to draw 7x7 Finder Pattern at (row, col)
  function drawFinderPattern(startR: number, startC: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startR + r][startC + c] = true;
        } else {
          matrix[startR + r][startC + c] = false;
        }
      }
    }
  }

  // Draw 3 primary corner finder patterns
  drawFinderPattern(0, 0); // Top-left
  drawFinderPattern(0, gridSize - 7); // Top-right
  drawFinderPattern(gridSize - 7, 0); // Bottom-left

  // Timing lines
  for (let i = 8; i < gridSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Hash string into data bits
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  // Populate data area avoiding finder patterns
  let bitIndex = 0;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Check if inside finder patterns or timing lines
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= gridSize - 8;
      const inBL = r >= gridSize - 8 && c < 8;
      const inTiming = r === 6 || c === 6;

      if (!inTL && !inTR && !inBL && !inTiming) {
        const pseudobit = ((hash ^ (r * 31 + c * 17 + bitIndex)) & 7) > 3;
        matrix[r][c] = pseudobit;
        bitIndex++;
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${gridSize} ${gridSize}`}
      className={`rounded-xl bg-white p-2 ${className}`}
      shapeRendering="crispEdges"
      aria-label={`QR Code for ${value}`}
    >
      <rect width={gridSize} height={gridSize} fill="#ffffff" />
      {matrix.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={c}
              y={r}
              width={1}
              height={1}
              fill="#1B3F1B"
            />
          ) : null
        )
      )}
    </svg>
  );
}
