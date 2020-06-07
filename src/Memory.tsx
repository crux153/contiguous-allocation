import React from "react";
import "./Memory.css";

export interface Process {
  id: number;
  size: number;
  address: number;
  color: string;
}

export type MemoryProps = {
  size: number;
  processes: Process[];
};

const width = 600;
const height = 600;

export function Memory({ size, processes }: MemoryProps) {
  const unit = height / size;
  return (
    <div className="memory" style={{ width, height }}>
      {processes.map((process) => (
        <div
          key={process.id}
          className="process"
          style={{
            top: process.address * unit,
            height: process.size * unit,
            backgroundColor: process.color,
          }}
        >
          <div className="name">Process {process.id}</div>
          <div className="meta">Address: {process.address}KB</div>
          <div className="meta">Size: {process.size}KB</div>
        </div>
      ))}
    </div>
  );
}
