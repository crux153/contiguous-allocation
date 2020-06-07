import { useMemo } from "react";
import { Process } from "./Memory";
import randomColor from "randomcolor";

export interface Block {
  size: number;
  address: number;
}

export interface Request {
  id: number;
  size: number;
}

export function useCalculateFree(size: number, processes: Process[]) {
  return useMemo(() => {
    const memory = Array(size).fill(null);
    for (const process of processes) {
      for (
        let address = process.address;
        address < process.address + process.size;
        address++
      ) {
        memory[address] = process.id;
      }
    }

    const blocks = [];
    let block = null;
    for (let address = 0; address < size; address++) {
      if (memory[address] === null) {
        if (block === null) {
          block = {
            size: 1,
            address,
          };
        } else {
          block.size++;
        }
      } else if (block !== null) {
        blocks.push(block);
        block = null;
      }
    }
    if (block !== null) {
      blocks.push(block);
    }

    const free = blocks.reduce((acc, block) => acc + block.size, 0);
    const average = blocks.length ? Math.round(free / blocks.length) : 0;

    return {
      free,
      average,
      blocks,
    };
  }, [size, processes]);
}

export function allocate(
  processes: Process[],
  blocks: Block[],
  request: Request
) {
  const exists = processes.find((process) => process.id === request.id);

  if (request.size === 0) {
    if (!exists) {
      throw new Error("Process not exists");
    }
    return processes.filter((process) => process.id !== request.id);
  }

  if (exists) {
    throw new Error("Process already exists");
  }

  const diffs = blocks
    .map((block) => ({
      ...block,
      diff: block.size - request.size,
    }))
    .filter((block) => block.diff >= 0);

  if (!diffs.length) {
    throw new Error("Not enough memory");
  }

  const target = diffs.reduce((prev, cur) =>
    prev.diff < cur.diff ? prev : cur
  );
  const process: Process = {
    id: request.id,
    size: request.size,
    address: target.address,
    color: randomColor({ luminosity: "light" }),
  };

  return [...processes, process];
}
