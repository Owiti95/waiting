/**
 * VA Waiting List - Landing Page JavaScript
 *
 * Uses fetch() with no-cors to bypass CORS issues
 */

;(function () {
  'use strict'

  const SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbzdRQNHnfeiIFmtTFpLzA4NH0umKQzNwXN_PS5cSnxVdXOV-B0Y5AnlRYaesZaDA9TLjg/exec'

  document.addEventListener('DOMContentLoaded', init)

  function init() {
    const form = document.getElementById('waiting-list-form')
    const submitBtn = document.getElementById('submit-btn')
    const formMessage = document.getElementById('form-message')

    if (!form || !submitBtn || !formMessage) {
      console.error('Required form elements not found')
      return
    }

    form.addEventListener('submit', handleSubmit)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const form = e.target
    const submitBtn = document.getElementById('submit-btn')
    const formMessage = document.getElementById('form-message')

    submitBtn.disabled = true
    submitBtn.textContent = 'Submitting...'

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      business: form.business.value.trim(),
      goal: form.goal.value.trim(),
      tasks: form.tasks.value.trim(),
      success: form.success.value.trim(),
      failure: form.failure.value.trim(),
      concerns: form.concerns.value.trim(),
      alternatives: form.alternatives.value.trim(),
      price: form.price.value.trim(),
    }

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // 🔥 bypass CORS
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // ⚠️ We assume success (because no-cors hides response)
      onFormSuccess(form, formMessage, submitBtn)
    } catch (error) {
      onFormError(error, formMessage, submitBtn)
    }
  }

  function onFormSuccess(form, formMessage, submitBtn) {
    formMessage.textContent =
      "Application submitted successfully! If you're a fit, we'll be in touch."
    formMessage.className = 'form-message success'
    formMessage.style.display = 'block'

    form.reset()

    submitBtn.disabled = false
    submitBtn.textContent = 'Submit Application'
  }

  function onFormError(error, formMessage, submitBtn) {
    console.error('Submission error:', error)

    formMessage.textContent = 'Something went wrong. Please try again.'
    formMessage.className = 'form-message error'
    formMessage.style.display = 'block'

    submitBtn.disabled = false
    submitBtn.textContent = 'Submit Application'
  }
})()
