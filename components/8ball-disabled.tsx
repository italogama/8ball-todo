"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface Todo {
  text: string;
  completed: boolean;
}

const SHAKE_THRESHOLD = 20;
const SHAKE_TIME_THRESHOLD = 1000;

function useShake(onShake: () => void) {
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const lastShake = useRef<number | null>(null);
  const accRef = useRef<DeviceMotionEventAcceleration | null>(null);
  const shakeRef = useRef<() => void>();
  shakeRef.current = onShake;

  useEffect(() => {
    if (!permission || permission !== "granted") return;

    const listener = (e: DeviceMotionEvent) => {
      e.preventDefault();
      const current = e.accelerationIncludingGravity;
      if (!current) return;

      if (!accRef.current) {
        accRef.current = current;
        return;
      }

      const deltaX = Math.abs(accRef.current.x! - current.x!);
      const deltaY = Math.abs(accRef.current.y! - current.y!);
      const deltaZ = Math.abs(accRef.current.z! - current.z!);
      if ((deltaX > SHAKE_THRESHOLD && deltaY > SHAKE_THRESHOLD) || (deltaX > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD) || (deltaY > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD)) {
        if (!lastShake.current) {
          lastShake.current = Date.now();
          shakeRef.current?.();
        } else if (lastShake.current + SHAKE_TIME_THRESHOLD > Date.now()) {
          return;
        } else {
          lastShake.current = Date.now();
          shakeRef.current?.();
        }
      }
    };

    window.addEventListener("devicemotion", listener);

    return () => {
      window.removeEventListener("devicemotion", listener);
    };
  }, [permission]);

  useEffect(() => {
    // @ts-expect-error: TypeScript doesn't know about this:
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      // @ts-expect-error: TypeScript doesn't know about this:
      DeviceMotionEvent.requestPermission().then((permissionState: PermissionState) => {
        setPermission(permissionState);
      });
    } else {
      setPermission("granted");
    }
  }, []);
}

export default function EightBallDisabled() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<string>("");

  const [todoTodo, setTodoTodo] = useState<Todo | null>(null);
  const [dragging, setDragging] = useState(false);
  const [draggingHasStarted, setDraggingHasStarted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!todo) return;
    setTodo("");
    setTodos((prevTodos) => [...prevTodos, { text: todo, completed: false }]);
  }

  const todoOpacity = draggingHasStarted && !dragging ? 1 : 0;

  const showRandomTodo = useCallback(() => {
    setDraggingHasStarted(true);
    setDragging(false);
    setTodos((prevTodos) => {
      const uncompletedTodos = prevTodos.filter((todo) => !todo.completed);
      if (uncompletedTodos.length === 0) return prevTodos;

      const randomTodo = uncompletedTodos[Math.floor(Math.random() * uncompletedTodos.length)];
      setTodoTodo(randomTodo);

      return prevTodos.map((todo) => (todo === randomTodo ? { ...todo, completed: true } : todo));
    });
  }, []);

  useShake(showRandomTodo);

  return (
    <div className="relative flex w-full  items-center justify-center">
      <div className="absolute top-1 right-1 text-right">
        <h1 className="text-2xl font-semibold tracking-tight pb-3">Todo List</h1>

        <Alert>
          {/* <Terminal className="h-4 w-4" /> */}
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>You need to login first!</AlertDescription>
        </Alert>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-2xl font-semibold tracking-tight pb-3">Add your tasks and shake the ball to choose randomly!</h1>
        <motion.div
          className="relative bg-black w-[200px] h-[200px] rounded-full"
          drag
          dragConstraints={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div className="transition-opacity absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border-4 border-gray-800 w-[150px] h-[150px] rounded-full" style={{ opacity: todoOpacity }}>
            <div className="relative h-full flex items-center justify-center mt-[25px]">
              <div className="absolute w-[60px] z-20 top-[30px] text-white text-base truncate text-center">{todoTodo?.text}</div>
              <div className="rotate-[180deg] w-[120px] h-[120px]">
                <svg fill="#c5ee4f" id="triangle" viewBox="0 0 100 100">
                  <polygon points="50 15, 100 100, 0 100" />
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[150px] h-[150px] rounded-full text-black font-extrabold text-[130px] flex items-center justify-center">8</div>
        </motion.div>
      </div>
    </div>
  );
}
