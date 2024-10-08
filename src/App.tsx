import React, { useState, createContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { TimerContextProvider } from "./TimerState";
import { GameManagerProvider } from "./GameState";
import GameRenderer from "./GameRenderer";
import Page from "./Page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <TimerContextProvider>
        <GameManagerProvider>
          <Page>
            <GameRenderer />
          </Page>
        </GameManagerProvider>
      </TimerContextProvider>
    </React.StrictMode>
  );
}

export default App;
