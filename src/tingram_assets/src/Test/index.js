import { tingram } from "../../declarations/tingram";

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  // Interact with tingram actor, calling the greet method
  const greeting = await tingram.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
