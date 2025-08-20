class WheelOfNames {
  constructor() {
    this.canvas = document.getElementById("wheel");
    this.ctx = this.canvas.getContext("2d");
    this.names = [];
    this.colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FECA57",
      "#FF9FF3",
      "#54A0FF",
      "#5F27CD",
      "#00D2D3",
      "#FF9F43",
      "#10AC84",
      "#EE5A24",
      "#0ABDE3",
      "#C44569",
      "#FFC312",
      "#12CBC4",
      "#ED4C67",
      "#006BA6",
      "#F79F1F",
      "#A3CB38",
    ];
    this.spinning = false;
    this.currentRotation = 0;

    this.initializeElements();
    this.setupEventListeners();
    this.drawWheel();
  }

  initializeElements() {
    this.nameInput = document.getElementById("name-input");
    this.addBtn = document.getElementById("add-btn");
    this.spinBtn = document.getElementById("spin-btn");
    this.namesList = document.getElementById("names-list");
    this.nameCount = document.getElementById("name-count");
    this.clearAllBtn = document.getElementById("clear-all");
    this.resultModal = document.getElementById("result-modal");
    this.winnerName = document.getElementById("winner-name");
    this.closeModal = document.getElementById("close-modal");
  }

  setupEventListeners() {
    this.addBtn.addEventListener("click", () => this.addName());
    this.nameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addName();
    });
    this.spinBtn.addEventListener("click", () => this.spinWheel());
    this.clearAllBtn.addEventListener("click", () => this.clearAllNames());
    this.closeModal.addEventListener("click", () => this.hideResult());

    // Click outside modal to close
    this.resultModal.addEventListener("click", (e) => {
      if (e.target === this.resultModal) this.hideResult();
    });
  }

  addName() {
    const input = this.nameInput.value.trim();
    if (!input) return;

    // Split by newlines and filter out empty lines
    const newNames = input
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name && !this.names.includes(name));

    if (newNames.length > 0) {
      this.names.push(...newNames);
      this.nameInput.value = "";
      this.updateNamesList();
      this.drawWheel();
      this.updateUI();
    }
  }

  removeName(name) {
    const index = this.names.indexOf(name);
    if (index > -1) {
      this.names.splice(index, 1);
      this.updateNamesList();
      this.drawWheel();
      this.updateUI();
    }
  }

  clearAllNames() {
    this.names = [];
    this.updateNamesList();
    this.drawWheel();
    this.updateUI();
  }

  updateNamesList() {
    if (this.names.length === 0) {
      this.namesList.innerHTML =
        '<p class="empty-message">No names added yet. Add some names to get started!</p>';
    } else {
      this.namesList.innerHTML = this.names
        .map(
          (name) => `
                <div class="name-item">
                    <span class="name-text">${name}</span>
                    <button class="remove-btn" onclick="wheel.removeName('${name}')">×</button>
                </div>
            `
        )
        .join("");
    }
  }

  updateUI() {
    this.nameCount.textContent = this.names.length;
    this.clearAllBtn.style.display = this.names.length > 0 ? "block" : "none";
    this.spinBtn.disabled = this.names.length < 2;
  }

  drawWheel() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = 180;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.names.length === 0) {
      // Draw empty wheel
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = "#f8f9fa";
      this.ctx.fill();
      this.ctx.strokeStyle = "#e9ecef";
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      // Draw placeholder text
      this.ctx.fillStyle = "#666";
      this.ctx.font = "bold 18px Poppins";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Add names to", centerX, centerY - 10);
      this.ctx.fillText("get started!", centerX, centerY + 15);
      return;
    }

    const anglePerSegment = (2 * Math.PI) / this.names.length;

    // Draw segments
    for (let i = 0; i < this.names.length; i++) {
      const startAngle = i * anglePerSegment;
      const endAngle = (i + 1) * anglePerSegment;

      // Draw segment
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      this.ctx.lineTo(centerX, centerY);
      this.ctx.fillStyle = this.colors[i % this.colors.length];
      this.ctx.fill();
      this.ctx.strokeStyle = "#fff";
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      // Draw text
      const textAngle = startAngle + anglePerSegment / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.7);

      this.ctx.save();
      this.ctx.translate(textX, textY);
      this.ctx.rotate(textAngle + Math.PI / 2);

      this.ctx.fillStyle = "#fff";
      this.ctx.font = "bold 14px Poppins";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      // Add text shadow for better readability
      this.ctx.shadowColor = "rgba(0,0,0,0.3)";
      this.ctx.shadowBlur = 2;
      this.ctx.shadowOffsetX = 1;
      this.ctx.shadowOffsetY = 1;

      this.ctx.fillText(this.names[i], 0, 0);
      this.ctx.restore();
    }

    // Draw center circle
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    this.ctx.fillStyle = "#333";
    this.ctx.fill();
  }

  spinWheel() {
    if (this.spinning || this.names.length < 2) return;

    this.spinning = true;
    this.spinBtn.disabled = true;
    this.spinBtn.querySelector("span").textContent = "🌀 SPINNING...";

    // Calculate spin parameters
    const minSpins = 5;
    const maxSpins = 8;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const spinAngle = spins * 360;
    const duration = 3000 + Math.random() * 2000; // 3-5 seconds

    // Set CSS variables for animation
    this.canvas.style.setProperty("--spin-amount", `${spinAngle}deg`);
    this.canvas.style.setProperty("--spin-duration", `${duration}ms`);

    // Add spinning class
    this.canvas.classList.add("spinning");

    // Calculate winner
    setTimeout(() => {
      this.finishSpin(spinAngle);
    }, duration);
  }

  finishSpin(totalRotation) {
    this.spinning = false;
    this.canvas.classList.remove("spinning");

    // Calculate which segment the pointer is on
    const normalizedRotation = (360 - (totalRotation % 360)) % 360;
    const anglePerSegment = 360 / this.names.length;
    const winnerIndex = Math.floor(normalizedRotation / anglePerSegment);
    const winner = this.names[winnerIndex];

    // Remove winner from the list
    this.names.splice(winnerIndex, 1);

    // Update the display
    this.updateNamesList();
    this.drawWheel();
    this.updateUI();

    // Show result
    this.showResult(winner);

    // Reset button
    this.spinBtn.disabled = false;
    this.spinBtn.querySelector("span").textContent = "🎲 SPIN THE WHEEL";
  }

  showResult(winner) {
    this.winnerName.textContent = winner;
    this.resultModal.classList.remove("hidden");

    // Trigger animation
    setTimeout(() => {
      this.resultModal.classList.add("show");
    }, 10);

    // Add confetti effect
    this.createConfetti();
  }

  hideResult() {
    this.resultModal.classList.remove("show");
    setTimeout(() => {
      this.resultModal.classList.add("hidden");
    }, 300);
  }

  createConfetti() {
    const colors = ["#ff4757", "#667eea", "#764ba2", "#4ecdc4", "#45b7d1"];

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${
                      colors[Math.floor(Math.random() * colors.length)]
                    };
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1001;
                    animation: fall 3s linear forwards;
                `;

        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => confetti.remove(), 3000);
      }, i * 50);
    }

    // Add fall animation if not exists
    if (!document.querySelector("#confetti-style")) {
      const style = document.createElement("style");
      style.id = "confetti-style";
      style.textContent = `
                @keyframes fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
      document.head.appendChild(style);
    }
  }
}

// Initialize the wheel when page loads
let wheel;
document.addEventListener("DOMContentLoaded", () => {
  wheel = new WheelOfNames();
});
