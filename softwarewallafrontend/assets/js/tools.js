async function fetchTools() {
    try {
        const response = await fetch('http://localhost:5000/api/tool');  // Replace with your API endpoint
        const tools = await response.json();

        const toolContainer = document.querySelector('.all-tools');
        toolContainer.innerHTML = ''; // Clear the container

        tools.forEach(tool => {
            const toolElement = `
                <div class="col-md-4 mb-4 single-tool">
                    <div class="rounded bundleCard">
                        <div class="card-image">
                            <img class="img-fluid card-img" src="${tool.img}" alt="${tool.name}" />
                        </div>
                        <div class="card-body text-center pb-0">
                            <h5>${tool.name}</h5>
                            <span class="badge tag p-3 card-price">₹ ${tool.month} ₹</span>
                            <button class="btn mx-auto primary-button smooth-anchor mt-2 w-100 buy-button" data-tool-id="${tool._id}">
                                <i class="icon-arrow-right-circle"></i> Buy
                            </button>
                        </div>
                    </div>
                </div>
            `;
            toolContainer.innerHTML += toolElement;
        });

        // Add event listeners to the buy buttons
        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', event => {
                const toolId = event.currentTarget.getAttribute('data-tool-id');
                const selectedTool = tools.find(t => t._id === toolId);
                showModal(selectedTool);
            });
        });

    } catch (error) {
        console.error('Error fetching tools:', error);
    }
}

const paymentMethods = {
    paypal: {
        qrCode: 'path_to_paypal_qr_code.png', // Replace with actual QR code image path
        contact: 'test@mail',
    },
    upi: {
        qrCode: 'assets/images/upiqr.jpg', // Replace with actual QR code image path
        contact: 'toolswalaatoolswala@okhdfcbank',
    }
};

// Function to show the modal with tool data
function showModal(tool) {
    // Populate modal with the tool data
    document.getElementById('toolName').textContent = tool.name;
    document.getElementById('toolDescription').textContent = tool.description;

    // Set the initial price to the monthly price
    document.getElementById('priceDisplay').textContent = tool.month;
    document.getElementById('monthly-btn').classList.add('active');

    // Attach event listeners to the pricing buttons
    document.querySelectorAll('.pricing-btn').forEach(button => {
        button.addEventListener('click', event => {
            // Remove 'active' class from all buttons
            document.querySelectorAll('.pricing-btn').forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            event.currentTarget.classList.add('active');

            const priceType = event.currentTarget.getAttribute('data-price');
            document.getElementById('priceDisplay').textContent = tool[priceType]; // Update price
        });
    });

    // Show the modal (using Bootstrap's modal function)
    const modal = new bootstrap.Modal(document.getElementById('toolModal'));
    modal.show();

    // PayPal and UPI buttons instead of radio buttons and Buy button
    document.getElementById('payWithPayPal').onclick = () => showPaymentInfo(tool, 'paypal', modal);
    document.getElementById('payWithUPI').onclick = () => showPaymentInfo(tool, 'upi', modal);
    const closeButton = document.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
        modal.hide();
    });
}

// Function to show the payment modal and close the first modal
function showPaymentInfo(tool, paymentMethod, toolModal) {
    const paymentDetails = paymentMethods[paymentMethod];
    if (paymentDetails) {
        document.getElementById('qrCode').src = paymentDetails.qrCode;
        const selectedPrice = document.getElementById('priceDisplay').textContent;

        // Display payment info and price
        document.getElementById('contactDetails').innerHTML = `
            ${paymentDetails.contact} <br>
            <strong>Total Price: ₹ ${selectedPrice}</strong>
        `;

        // Close the first modal and show the second modal
        toolModal.hide();
        const paymentModal = new bootstrap.Modal(document.getElementById('paymentInfoModal'));
        paymentModal.show();
        const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', () => {
        paymentModal.hide();
    });
    }
}

// Fetch tools when the page loads
window.onload = fetchTools;
