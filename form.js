const SCRIPT_URL = CONFIG.scriptUrl
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

  // Hide all messages
  hideMessages()

  // Basic validation
  if (!name || !phone || !residence || !course || !year || !event || !tripId) {
    showMsg("errorMsg", "Please fill in all fields before submitting.")
    return
  }

  // Disable button while submitting
  btn.disabled = true
  btn.textContent = "Saving..."

  const payload = {
    name, phone, residence, firstTime,
    course, year, event, tripId
  }

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    btn.disabled = false
    btn.textContent = "Register Passenger"

    if (data.status === "success") {
      showMsg("successMsg", "✅ Registration saved!")
      clearForm()
    } else if (data.status === "duplicate") {
      showMsg("duplicateMsg", "⚠️ This phone number is already registered.")
    } else {
      showMsg("errorMsg", "❌ Something went wrong. Try again.")
    }
  })
  .catch(err => {
    btn.disabled = false
    btn.textContent = "Register Passenger"
    showMsg("errorMsg", "❌ Network error. Check your connection.")
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