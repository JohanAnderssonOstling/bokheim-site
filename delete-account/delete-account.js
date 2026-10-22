"use strict";

const credentials = document.querySelector("#credentials-form");
const accountForm = document.querySelector("#account-form");
const review = document.querySelector("#review");
const deletion = document.querySelector("#delete-form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmation = document.querySelector("#confirmation");
const deleteButton = document.querySelector("#delete-button");
const cancelButton = document.querySelector("#cancel-button");
const status = document.querySelector("#status");
let deleting = false;

credentials.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!credentials.reportValidity()) return;
  document.querySelector("#account-email").textContent = email.value.trim();
  accountForm.hidden = true;
  review.hidden = false;
  status.textContent = "";
  confirmation.focus();
});

cancelButton.addEventListener("click", () => {
  if (deleting) return;
  deletion.reset();
  password.value = "";
  review.hidden = true;
  accountForm.hidden = false;
  status.textContent = "";
  password.focus();
});

deletion.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (deleting || !deletion.reportValidity()) return;
  deleting = true;
  deleteButton.disabled = true;
  cancelButton.disabled = true;
  status.dataset.error = "false";
  status.textContent = "Deleting your account…";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch("https://api.bokheim.se/api/auth/delete-account", {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value.trim(), password: password.value, confirmation: confirmation.value }),
      signal: controller.signal,
    });
    if (response.status !== 204) {
      const messages = {
        400: "Enter DELETE exactly to confirm account deletion.",
        401: "The email or password is incorrect. Check your account details and try again.",
        404: "Account deletion is not available on the server yet. Please try again later.",
        429: "Too many attempts. Wait five minutes before trying again.",
      };
      throw new Error(messages[response.status] || "The server could not complete account deletion. Please try again later.");
    }
    credentials.reset();
    deletion.reset();
    review.hidden = true;
    status.textContent = "Your Bokheim account and synced library records have been deleted. All sessions have been revoked. Books saved on your devices remain there.";
    status.focus();
  } catch (error) {
    password.value = "";
    deletion.reset();
    review.hidden = true;
    accountForm.hidden = false;
    status.dataset.error = "true";
    status.textContent = error instanceof TypeError || error.name === "AbortError"
      ? "The server response could not be received. Deletion may have completed. Try signing in to Bokheim to check your account before retrying."
      : error.message;
    status.focus();
  } finally {
    clearTimeout(timeout);
    deleting = false;
    deleteButton.disabled = false;
    cancelButton.disabled = false;
  }
});

window.addEventListener("pagehide", () => {
  password.value = "";
  confirmation.value = "";
});
