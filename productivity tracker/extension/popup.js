async function loadData() {
  try {
    const res = await fetch("http://localhost:5000/analytics");
    const data = await res.json();

    let productive = 0;
    let unproductive = 0;

    data.forEach(item => {
      if (item.productive) {
        productive += item.timeSpent;
      } else {
        unproductive += item.timeSpent;
      }
    });

    const total = productive + unproductive;
    const score = total ? Math.round((productive / total) * 100) : 0;

    document.getElementById("output").innerHTML = `
      <h3>📊 Productivity Report</h3>
      <p>🟢 Productive Time: ${productive}s</p>
      <p>🔴 Distracting Time: ${unproductive}s</p>
      <hr>
      <h2>⭐ Score: ${score}%</h2>
    `;
  } catch (err) {
    document.getElementById("output").innerHTML =
      "❌ Cannot connect to backend";
  }
}