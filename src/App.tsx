import React, { useState, useRef, useCallback } from "react";
import randomColor from "randomcolor";
import "./App.css";

import { Memory, Process } from "./Memory";
import { useCalculateFree, allocate } from "./allocation";

export default function App() {
  const [size, setSize] = useState<number>(0);
  const [processes, setProcesses] = useState<Process[]>([]);

  const { free, average, blocks } = useCalculateFree(size, processes);

  const sizeInputRef = useRef<HTMLInputElement>(null);
  const requestIdInputRef = useRef<HTMLInputElement>(null);
  const requestSizeInputRef = useRef<HTMLInputElement>(null);

  const handleSetSize = useCallback(() => {
    try {
      if (!sizeInputRef.current) {
        throw new Error("Failed to set memory size");
      }
      const size = parseInt(sizeInputRef.current.value, 10);
      if (!size || size < 0 || size > 1000) {
        throw new Error("Invalid memory size");
      }
      setSize(size);
    } catch (error) {
      alert(error.message);
    }
  }, []);

  const handleRequest = useCallback(() => {
    if (!requestIdInputRef.current || !requestSizeInputRef.current) {
      throw new Error("Failed to handle request");
    }

    const id = parseInt(requestIdInputRef.current.value, 10);
    const size = parseInt(requestSizeInputRef.current.value, 10);

    if (!id || id < 0 || id > 1000) {
      throw new Error("Invalid request id");
    }

    if (size < 0 || size > 1000) {
      throw new Error("Invalid request size");
    }

    setProcesses((processes) => {
      try {
        return allocate(processes, blocks, { id, size });
      } catch (error) {
        alert(error.message);
        return processes;
      }
    });
  }, [blocks]);

  if (!size) {
    return (
      <div className="app">
        <label>Set Size (KB)</label>
        <input ref={sizeInputRef} type="number" />
        <button onClick={handleSetSize} style={{ marginLeft: 10 }}>
          OK
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <div>
        <div>Memory size: {size}KB</div>
        <div>
          <label>Request ID:</label>
          <input ref={requestIdInputRef} type="number" />
        </div>
        <div>
          <label>Request Size:</label>
          <input ref={requestSizeInputRef} type="number" />
        </div>
        <button onClick={handleRequest}>Request</button>
      </div>
      <div>
        <Memory size={size} processes={processes} />
      </div>
      <div>
        <div>Free: {free}KB</div>
        <div>Average: {average}KB</div>
      </div>
    </div>
  );
}
