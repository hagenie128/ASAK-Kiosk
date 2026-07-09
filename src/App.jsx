const setupItems = [
  "React + Vite workspace is ready.",
  "No pipeline output is stored in frontend.",
  "Connect API calls through backend endpoints as features are added.",
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">ASAK Frontend</p>
        <h1>Kiosk UI workspace</h1>
        <p className="summary">
          Clean frontend setup for the ASAK kiosk. Data pipeline assets stay in the root data
          folders.
        </p>
      </section>

      <section className="panel" aria-labelledby="setup-title">
        <h2 id="setup-title">Setup Check</h2>
        <ul>
          {setupItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
