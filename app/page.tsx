"use client";

import ModelList from "@components/ModelList";
import ModelInstaller from "@components/ModelInstaller";

export default function Home() {
  return (
    <div>
      <h1>Modèles Ollama</h1>
      <ModelInstaller />
      <hr />
      <ModelList />
    </div>
  );
}
