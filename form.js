const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUT3qtUWoeQZWfZMgZ90qcfLVsIqoXoRrU3bZoYQvAYaSIJTYdxJSqNNRr1QG3Gta57A/exec"

function submitForm() {
  const btn = document.getElementById("submitBtn")
  const name = document.getElementById("name").value.trim()
  const phone = document.getElementById("phone").value.trim()
  const residence = document.getElementById("residence").value.trim()
  const firstTime = document.querySelector('input[name="firstTime"]:checked').value
  const course = document.getElementById("course").value.trim()
  const year = document.getElementById("year").value
  const event = document.getElementById("event").value.trim()
  const tripId = document.getElementById("tripId").value.trim()

  hideMessages()

  if (!name || !phone || !residence || !course || !year || !event || !tripId) {
    showMsg("errorMsg", "❌ Please fill in all fields.")
    return
  }

  btn.disabled = true
  btn.textContent = "Checking..."

  const payload = { name, phone, residence, firstTime, course, year, event, tripId }

  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      const existing = data.data || []
      const isDuplicate = existing.some(r =>
        String(r["Phone"]).replace(/^0+/, '') === String(phone).replace(/^0+/, '')
      )

      if (isDuplicate) {
        btn.disabled = false
        btn.textContent = "Register Passenger"
        showMsg("duplicateMsg", "⚠️ This phone number is already registered.")
        return
      }

      btn.textContent = "Saving..."

      fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      })
      .then(() => {
        btn.disabled = false
        btn.textContent = "Register Passenger"
        showMsg("successMsg", "✅ Registration saved!")
        clearForm()
      })
      .catch(() => {
        btn.disabled = false
        btn.textContent = "Register Passenger"
        showMsg("errorMsg", "❌ Network error. Check connection.")
      })
    })
    .catch(() => {
      btn.disabled = false
      btn.textContent = "Register Passenger"
      showMsg("errorMsg", "❌ Could not connect. Check internet.")
    })
}

function showMsg(id, text) {
  hideMessages()
  const el = document.getElementById(id)
  el.textContent = text
  el.classList.remove("hidden")
  setTimeout(() => el.classList.add("hidden"), 5000)
}

function hideMessages() {
  document.getElementById("successMsg").classList.add("hidden")
  document.getElementById("duplicateMsg").classList.add("hidden")
  document.getElementById("errorMsg").classList.add("hidden")
}

function clearForm() {
  document.getElementById("name").value = ""
  document.getElementById("phone").value = ""
  document.getElementById("residence").value = ""
  document.getElementById("course").value = ""
  document.getElementById("year").value = ""
  document.querySelector('input[name="firstTime"][value="No"]').checked = true
}