document.addEventListener('DOMContentLoaded', () => {
    const radioButtons = document.querySelectorAll('input[name="package"]');
    const packageCards = document.querySelectorAll('.package-card');
    
    const mainPriceElement = document.getElementById('main-price');
    const oldPriceElement = document.getElementById('old-price');
    const savedAmountElement = document.getElementById('saved-amount');
    const btnPriceElement = document.getElementById('btn-price');
    const stickyAmountElement = document.getElementById('sticky-amount');
    const oldStickyElement = document.querySelector('.old-sticky');
    
    // Initial setup based on checked radio
    updatePrices(document.querySelector('input[name="package"]:checked'));

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            // Remove selected class from all cards
            packageCards.forEach(card => card.classList.remove('selected'));
            
            // Add selected class to the parent card of the checked radio
            if (this.checked) {
                this.closest('.package-card').classList.add('selected');
                updatePrices(this);
            }
        });
    });

    function updatePrices(selectedRadio) {
        if (!selectedRadio) return;
        
        const price = selectedRadio.value;
        const oldPrice = selectedRadio.getAttribute('data-old');
        const savedAmount = selectedRadio.getAttribute('data-saved');
        const label = selectedRadio.getAttribute('data-label');

        // Update elements
        mainPriceElement.textContent = price;
        oldPriceElement.textContent = oldPrice;
        savedAmountElement.textContent = savedAmount;
        btnPriceElement.textContent = label;
        stickyAmountElement.textContent = price;
        oldStickyElement.textContent = oldPrice + ' درهم';
    }

    // --- Countdown Timer Logic ---
    function startCountdown() {
        let hours = 4;
        let minutes = 29;
        let seconds = 59;

        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        setInterval(() => {
            seconds--;
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    if (hours < 0) {
                        hours = 4; // Reset to loop for marketing purposes
                    }
                }
            }

            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
        }, 1000);
    }

    startCountdown();
});
